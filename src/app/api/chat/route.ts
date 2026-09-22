import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
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

const DATA_FILE = path.join(process.cwd(), 'src/data/chat-store.json');

const SEED_THREADS: ChatThread[] = [
  {
    id: 1,
    user1Id: '5', // Saadan (Member)
    user2Id: '3', // Trendshop (Seller)
    subject: 'Floral Print Summer Dress - Sizing & Availability',
    product: {
      id: 1,
      title: 'Floral Print Summer Dress',
      price: 34.0,
      image: '/sites/modesy/banner-clothing.jpg'
    },
    lastMessage: 'We also offer free size exchanges within 14 days of delivery if needed :)',
    lastMessageTime: '11:25 AM',
    updatedAt: Date.now() - 1000 * 60 * 15
  },
  {
    id: 2,
    user1Id: '5', // Saadan (Member)
    user2Id: '1', // Admin
    subject: 'Order #10019 Tracking Update & Support',
    lastMessage: 'tes',
    lastMessageTime: '12:25 PM',
    updatedAt: Date.now() - 1000 * 60 * 5
  },
  {
    id: 3,
    user1Id: '4', // Peter Jone
    user2Id: '3', // Trendshop
    subject: 'Question about Black bag over the shoulder delivery',
    product: {
      id: 6,
      title: 'Black bag over the shoulder',
      price: 48.0,
      image: '/sites/modesy/banner-clothing.jpg'
    },
    lastMessage: 'Yes Peter, it comes with an adjustable and detachable leather shoulder strap!',
    lastMessageTime: 'Yesterday',
    updatedAt: Date.now() - 1000 * 60 * 60 * 24
  }
];

const SEED_MESSAGES: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 101,
      threadId: 1,
      senderId: '5',
      receiverId: '3',
      senderName: 'Saadan',
      senderAvatar: '/sites/modesy/avatar-admin.jpg',
      message: 'Hi Trendshop, is the Floral Print Summer Dress true to size or should I size up for a relaxed fit?',
      createdAt: '11:20 AM',
      timestamp: Date.now() - 1000 * 60 * 20,
      isRead: true
    },
    {
      id: 102,
      threadId: 1,
      senderId: '3',
      receiverId: '5',
      senderName: 'Trendshop',
      senderAvatar: '/sites/modesy/avatar-vendor.jpg',
      message: 'Hello Saadan! It has a stretchy elastic waistline and fits true to size. If you prefer a loose look, size M would also work nicely!',
      createdAt: '11:24 AM',
      timestamp: Date.now() - 1000 * 60 * 16,
      isRead: true
    },
    {
      id: 103,
      threadId: 1,
      senderId: '3',
      receiverId: '5',
      senderName: 'Trendshop',
      senderAvatar: '/sites/modesy/avatar-vendor.jpg',
      message: 'We also offer free size exchanges within 14 days of delivery if needed :)',
      createdAt: '11:25 AM',
      timestamp: Date.now() - 1000 * 60 * 15,
      isRead: true
    }
  ],
  2: [
    {
      id: 201,
      threadId: 2,
      senderId: '1',
      receiverId: '5',
      senderName: 'Admin',
      senderAvatar: '/sites/modesy/avatar-admin.jpg',
      message: 'Hello Saadan! Your order #10019 has been processed and ready for dispatch. Courier tracking: TRK-9837192 via DHL Express.',
      createdAt: '09:00 AM',
      timestamp: Date.now() - 1000 * 60 * 60 * 3,
      isRead: true
    },
    {
      id: 202,
      threadId: 2,
      senderId: '1',
      receiverId: '5',
      senderName: 'Admin',
      senderAvatar: '/sites/modesy/avatar-admin.jpg',
      message: 'Your order has been queued for shipping dispatch.',
      createdAt: '09:02 AM',
      timestamp: Date.now() - 1000 * 60 * 60 * 3 + 120000,
      isRead: true
    },
    {
      id: 203,
      threadId: 2,
      senderId: '5',
      receiverId: '1',
      senderName: 'Saadan',
      senderAvatar: '/sites/modesy/avatar-admin.jpg',
      message: 'haloo',
      createdAt: '12:11 PM',
      timestamp: Date.now() - 1000 * 60 * 14,
      isRead: true
    },
    {
      id: 204,
      threadId: 2,
      senderId: '1',
      receiverId: '5',
      senderName: 'Admin',
      senderAvatar: '/sites/modesy/avatar-admin.jpg',
      message: 'tes',
      createdAt: '12:25 PM',
      timestamp: Date.now() - 1000 * 60 * 5,
      isRead: true
    }
  ],
  3: [
    {
      id: 301,
      threadId: 3,
      senderId: '4',
      receiverId: '3',
      senderName: 'Peter Jone',
      senderAvatar: '/sites/modesy/avatar-admin.jpg',
      message: 'Hello, can you confirm if the Black bag over the shoulder comes with adjustable shoulder strap?',
      createdAt: 'Yesterday 14:10',
      timestamp: Date.now() - 1000 * 60 * 60 * 25,
      isRead: true
    },
    {
      id: 302,
      threadId: 3,
      senderId: '3',
      receiverId: '4',
      senderName: 'Trendshop',
      senderAvatar: '/sites/modesy/avatar-vendor.jpg',
      message: 'Yes Peter, it comes with an adjustable and detachable leather shoulder strap!',
      createdAt: 'Yesterday 14:15',
      timestamp: Date.now() - 1000 * 60 * 60 * 24,
      isRead: true
    }
  ]
};

function readStore(): { threads: ChatThread[]; messages: Record<number, ChatMessage[]> } {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && parsed.threads && parsed.messages) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading chat store:', err);
  }

  // Initialize with seed data if file does not exist
  writeStore(SEED_THREADS, SEED_MESSAGES);
  return { threads: SEED_THREADS, messages: SEED_MESSAGES };
}

function writeStore(threads: ChatThread[], messages: Record<number, ChatMessage[]>) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify({ threads, messages }, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing chat store:', err);
  }
}

function mapSupabaseMessage(row: Record<string, unknown>): ChatMessage {
  const senderId = String(row.sender_id);
  const receiverId = String(row.receiver_id);
  const createdAt = String(row.created_at || new Date().toISOString());
  return {
    id: Number(row.id),
    threadId: Number(row.chat_id),
    senderId,
    receiverId,
    senderName: `User #${senderId}`,
    senderAvatar: '/sites/modesy/avatar-admin.jpg',
    message: String(row.message || ''),
    createdAt: new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date(createdAt).getTime(),
    isRead: Boolean(row.is_read)
  };
}

function mapSupabaseThread(row: Record<string, unknown>, latestMessage?: Record<string, unknown>): ChatThread {
  const updatedAt = String(row.updated_at || new Date().toISOString());
  const message = latestMessage ? mapSupabaseMessage(latestMessage) : undefined;
  return {
    id: Number(row.id),
    user1Id: String(row.sender_id),
    user2Id: String(row.receiver_id),
    subject: String(row.subject || 'Product inquiry'),
    lastMessage: message?.message || String(row.subject || 'Product inquiry'),
    lastMessageTime: message?.createdAt || new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    updatedAt: new Date(updatedAt).getTime()
  };
}

async function readSupabaseChat(threadId?: string) {
  if (!supabase) return null;

  if (threadId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', Number(threadId))
      .order('created_at', { ascending: true });
    if (error) throw error;
    return { messages: (data || []).map(row => mapSupabaseMessage(row as Record<string, unknown>)) };
  }

  const { data: chats, error: chatsError } = await supabase
    .from('chat')
    .select('*')
    .order('updated_at', { ascending: false });
  if (chatsError) throw chatsError;

  const { data: messages, error: messagesError } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: true });
  if (messagesError) throw messagesError;

  const latestByChat = new Map<number, Record<string, unknown>>();
  for (const row of messages || []) {
    latestByChat.set(Number(row.chat_id), row as Record<string, unknown>);
  }
  return {
    threads: (chats || []).map(row => mapSupabaseThread(row as Record<string, unknown>, latestByChat.get(Number(row.id)))),
    messages: (messages || []).reduce<Record<number, ChatMessage[]>>((result, row) => {
      const mapped = mapSupabaseMessage(row as Record<string, unknown>);
      result[mapped.threadId] = [...(result[mapped.threadId] || []), mapped];
      return result;
    }, {})
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const threadId = searchParams.get('threadId');
  const action = searchParams.get('action');

  if (action === 'users') {
    const search = (searchParams.get('search') || '').trim();
    if (!supabase || !search) return NextResponse.json({ users: [] });

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, slug, role, avatar')
      .ilike('username', `%${search}%`)
      .limit(20);

    if (error) {
      console.warn('Unable to search chat users:', error.message);
      return NextResponse.json({ users: [] });
    }

    return NextResponse.json({
      users: (data || []).map((profile) => ({
        id: String(profile.id),
        username: profile.username,
        email: `${profile.username}@modesy.com`,
        role: profile.role || 'member',
        avatar: profile.avatar || '/sites/modesy/avatar-admin.jpg',
        slug: profile.slug,
      })),
    });
  }

  if (supabase) {
    try {
      const liveData = await readSupabaseChat(threadId || undefined);
      if (liveData) return NextResponse.json(liveData);
    } catch (error) {
      console.warn('Supabase chat read failed; using local chat store:', error);
    }
  }

  const store = readStore();

  if (threadId) {
    const numId = Number(threadId);
    const msgs = store.messages[numId] || [];
    return NextResponse.json({ messages: msgs });
  }

  if (userId) {
    const userThreads = store.threads.filter(
      t => String(t.user1Id) === String(userId) || String(t.user2Id) === String(userId)
    );
    const participantIds = [...new Set(userThreads.flatMap(thread => [thread.user1Id, thread.user2Id]))];
    let users: Array<{ id: string; username: string; slug: string; role: string; avatar: string }> = [];
    if (supabase && participantIds.length > 0) {
      const result = await supabase
        .from('profiles')
        .select('id, username, slug, role, avatar')
        .in('id', participantIds);
      users = (result.data || []).map(profile => ({
        id: String(profile.id),
        username: profile.username,
        slug: profile.slug,
        role: profile.role || 'member',
        avatar: profile.avatar || '/sites/modesy/avatar-admin.jpg',
      }));
    }
    return NextResponse.json({ threads: userThreads, users });
  }

  return NextResponse.json(store);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (supabase && action === 'sendMessage') {
      const { threadId, senderId, receiverId, message } = body;
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: Number(threadId),
          sender_id: Number(senderId),
          receiver_id: Number(receiverId),
          message: String(message || '').trim()
        })
        .select('*')
        .single();
      if (!error && data) {
        await supabase.from('chat').update({ updated_at: new Date().toISOString() }).eq('id', Number(threadId));
        return NextResponse.json({ success: true, message: mapSupabaseMessage(data as Record<string, unknown>) });
      }
      console.warn('Supabase chat send failed; using local chat store:', error);
    }

    if (supabase && action === 'markRead') {
      const { threadId, userId } = body;
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('chat_id', Number(threadId))
        .eq('receiver_id', Number(userId));
      if (!error) return NextResponse.json({ success: true });
      console.warn('Supabase chat read status update failed; using local chat store:', error);
    }

    if (supabase && action === 'startThread') {
      const { user1Id, user2Id, subject } = body;
      const firstId = Number(user1Id);
      const secondId = Number(user2Id);
      const { data: existing } = await supabase
        .from('chat')
        .select('id')
        .or(`and(sender_id.eq.${firstId},receiver_id.eq.${secondId}),and(sender_id.eq.${secondId},receiver_id.eq.${firstId})`)
        .limit(1)
        .maybeSingle();
      if (existing) return NextResponse.json({ success: true, threadId: Number(existing.id) });

      const { data, error } = await supabase
        .from('chat')
        .insert({ sender_id: firstId, receiver_id: secondId, subject: subject || 'New Inquiry' })
        .select('id')
        .single();
      if (!error && data) return NextResponse.json({ success: true, threadId: Number(data.id) });
      console.warn('Supabase chat thread creation failed; using local chat store:', error);
    }

    const store = readStore();

    if (action === 'sendMessage') {
      const { threadId, senderId, receiverId, senderName, senderAvatar, message } = body;
      const numThreadId = Number(threadId);

      if (!store.messages[numThreadId]) {
        store.messages[numThreadId] = [];
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Unique ID
      const newMsg: ChatMessage = {
        id: Date.now() * 10000 + Math.floor(Math.random() * 9999),
        threadId: numThreadId,
        senderId: String(senderId),
        receiverId: String(receiverId),
        senderName: senderName || 'User',
        senderAvatar: senderAvatar || '/sites/modesy/avatar-admin.jpg',
        message: message.trim(),
        createdAt: timeStr,
        timestamp: now.getTime(),
        isRead: false
      };

      store.messages[numThreadId].push(newMsg);

      // Update thread
      const threadIdx = store.threads.findIndex(t => Number(t.id) === numThreadId);
      if (threadIdx !== -1) {
        store.threads[threadIdx].lastMessage = message.trim();
        store.threads[threadIdx].lastMessageTime = timeStr;
        store.threads[threadIdx].updatedAt = now.getTime();
      }

      writeStore(store.threads, store.messages);
      return NextResponse.json({ success: true, message: newMsg });
    }

    if (action === 'markRead') {
      const { threadId, userId } = body;
      const numThreadId = Number(threadId);
      const strUserId = String(userId);

      if (store.messages[numThreadId]) {
        store.messages[numThreadId].forEach(m => {
          if (String(m.receiverId) === strUserId) {
            m.isRead = true;
          }
        });
        writeStore(store.threads, store.messages);
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'startThread') {
      const { user1Id, user2Id, subject, product } = body;
      const u1 = String(user1Id);
      const u2 = String(user2Id);

      const existing = store.threads.find(
        t =>
          (String(t.user1Id) === u1 && String(t.user2Id) === u2) ||
          (String(t.user1Id) === u2 && String(t.user2Id) === u1)
      );

      if (existing) {
        return NextResponse.json({ success: true, threadId: Number(existing.id) });
      }

      const newId = Date.now() * 1000 + Math.floor(Math.random() * 999);
      const newThread: ChatThread = {
        id: newId,
        user1Id: u1,
        user2Id: u2,
        subject: subject || 'New Inquiry',
        product,
        lastMessage: subject || 'Started conversation',
        lastMessageTime: 'Just now',
        updatedAt: Date.now()
      };

      store.threads.unshift(newThread);
      store.messages[newId] = [];

      writeStore(store.threads, store.messages);
      return NextResponse.json({ success: true, threadId: newId });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
