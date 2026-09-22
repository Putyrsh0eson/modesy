import { PRESET_USERS } from '@/context/ModesyContext';
import { supabase } from '@/lib/supabase';

export interface ChatProduct {
  id: number;
  title: string;
  price: number;
  image: string;
}

export interface ChatThread {
  id: number;
  user1Id: string;
  user2Id: string;
  subject: string;
  product?: ChatProduct;
  lastMessage: string;
  lastMessageTime: string;
  updatedAt: number;
}

export interface ChatMessage {
  id: number;
  threadId: number;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  createdAt: string;
  timestamp: number;
  isRead: boolean;
}

export interface ChatConversationItem {
  id: number;
  otherUser: {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar: string;
  };
  subject: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  product?: ChatProduct;
  updatedAt: number;
}

export interface ChatUser {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
}

function resolveUserInfo(userId: string | number, directory: ChatUser[] = []) {
  const strId = String(userId);
  const match = Object.values(PRESET_USERS).find(u => String(u.id) === strId);
  if (match) {
    return {
      id: String(match.id),
      username: match.username,
      email: match.email,
      role: String(match.role),
      avatar: match.avatar || '/sites/modesy/avatar-admin.jpg'
    };
  }
  const directoryMatch = directory.find(user => String(user.id) === strId);
  if (directoryMatch) return directoryMatch;
  return {
    id: strId,
    username: `User #${strId}`,
    email: `user${strId}@modesy.com`,
    role: 'member',
    avatar: '/sites/modesy/avatar-admin.jpg'
  };
}

export const chatService = {
  subscribeToThread: (
    threadId: number,
    currentUserId: string | number,
    onChange: () => void
  ): (() => void) | null => {
    const client = supabase;
    if (!client) return null;

    const channel = client
      .channel(`chat-live-${threadId}-${String(currentUserId)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${threadId}` },
        onChange
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat' },
        onChange
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  },

  searchUsers: async (search: string, currentUserId: string | number): Promise<ChatUser[]> => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return [];

    const presetMatches = Object.values(PRESET_USERS)
      .filter(user => String(user.id) !== String(currentUserId))
      .filter(user => user.username.toLowerCase().includes(normalizedSearch) || user.email.toLowerCase().includes(normalizedSearch))
      .map(user => ({
        id: String(user.id),
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      }));

    try {
      const res = await fetch(`/api/chat?action=users&search=${encodeURIComponent(search)}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const remoteUsers = (data.users || []) as ChatUser[];
        const merged = [...remoteUsers, ...presetMatches]
          .filter(user => String(user.id) !== String(currentUserId))
          .filter((user, index, users) => users.findIndex(candidate => candidate.id === user.id) === index);
        return merged;
      }
    } catch {
      // Use preset accounts when the remote directory is unavailable.
    }

    return presetMatches;
  },

  getThreads: async (currentUserId: string | number): Promise<ChatConversationItem[]> => {
    const userIdStr = String(currentUserId);

    try {
      // Call server API for real-time shared database across all browsers/incognito
      const res = await fetch('/api/chat', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const threads: ChatThread[] = data.threads || [];
        const messages: Record<number, ChatMessage[]> = data.messages || {};
        const directory = (data.users || []) as ChatUser[];

        const userThreads = threads.filter(
          t => String(t.user1Id) === userIdStr || String(t.user2Id) === userIdStr
        );

        const result: ChatConversationItem[] = userThreads.map(t => {
          const otherUserId = String(t.user1Id) === userIdStr ? t.user2Id : t.user1Id;
          const otherUser = resolveUserInfo(otherUserId, directory);
          const threadMsgs = messages[t.id] || [];

          const unreadCount = threadMsgs.filter(
            m => String(m.receiverId) === userIdStr && !m.isRead
          ).length;

          return {
            id: Number(t.id),
            otherUser,
            subject: t.subject,
            lastMessage: t.lastMessage,
            lastMessageTime: t.lastMessageTime,
            unreadCount,
            isOnline: otherUser.role === 'vendor' || otherUser.role === 'admin',
            product: t.product,
            updatedAt: t.updatedAt
          };
        });

        return result.sort((a, b) => b.updatedAt - a.updatedAt);
      }
    } catch {
      // Fallback if offline
    }

    return [];
  },

  getThread: async (threadId: number): Promise<ChatThread | null> => {
    try {
      const res = await fetch('/api/chat', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const threads: ChatThread[] = data.threads || [];
        return threads.find(t => Number(t.id) === Number(threadId)) || null;
      }
    } catch {
      // ignore
    }
    return null;
  },

  getMessages: async (threadId: number): Promise<ChatMessage[]> => {
    try {
      const res = await fetch(`/api/chat?threadId=${threadId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const list: ChatMessage[] = data.messages || [];

        // Deduplicate
        const seen = new Set<string | number>();
        const unique: ChatMessage[] = [];
        for (const m of list) {
          if (!seen.has(m.id)) {
            seen.add(m.id);
            unique.push(m);
          }
        }
        return unique;
      }
    } catch {
      // ignore
    }
    return [];
  },

  sendMessage: async (
    threadId: number,
    senderId: string | number,
    receiverId: string | number,
    message: string,
    senderUser?: ChatUser
  ): Promise<ChatMessage> => {
    const sender = senderUser || resolveUserInfo(senderId);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sendMessage',
        threadId,
        senderId: String(senderId),
        receiverId: String(receiverId),
        senderName: sender.username,
        senderAvatar: sender.avatar,
        message
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.message) {
        return data.message;
      }
    }

    // Fallback response object
    const now = new Date();
    return {
      id: Date.now(),
      threadId: Number(threadId),
      senderId: String(senderId),
      receiverId: String(receiverId),
      senderName: sender.username,
      senderAvatar: sender.avatar,
      message,
      createdAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime(),
      isRead: false
    };
  },

  markThreadRead: async (threadId: number, currentUserId: string | number): Promise<void> => {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'markRead',
          threadId,
          userId: String(currentUserId)
        })
      });
    } catch {
      // ignore
    }
  },

  startOrGetThread: async (
    user1Id: string | number,
    user2Id: string | number,
    subject: string,
    product?: ChatProduct
  ): Promise<number> => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'startThread',
          user1Id: String(user1Id),
          user2Id: String(user2Id),
          subject,
          product
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.threadId) return Number(data.threadId);
      }
    } catch {
      // ignore
    }

    return Date.now();
  }
};
