'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useModesy, PRESET_USERS } from '@/context/ModesyContext';
import { chatService, ChatConversationItem, ChatMessage, ChatUser } from '@/services/chatService';
import { Search, Send, CheckCheck, MessageSquare, UserCheck, Loader2 } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useModesy();
  const searchParams = useSearchParams();

  // Active user: if not logged in, default to Saadan (Member)
  const currentUser = user || PRESET_USERS.saadan;

  const [threads, setThreads] = useState<ChatConversationItem[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const [searchableUsers, setSearchableUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const queryProcessedRef = useRef(false);

  const loadThreads = useCallback(async () => {
    if (!currentUser?.id) return;
    const list = await chatService.getThreads(currentUser.id);
    setThreads(list);

    if (list.length > 0) {
      // If current selected is not in list, select first
      setSelectedThreadId(prev => (prev && list.some(t => Number(t.id) === Number(prev)) ? prev : Number(list[0].id)));
    } else {
      setSelectedThreadId(null);
      setMessages([]);
    }
    setLoading(false);
  }, [currentUser?.id]);

  // Initial load or user change
  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (!search.trim() || !currentUser?.id) {
      setSearchableUsers([]);
      return;
    }

    const timeout = window.setTimeout(() => {
      chatService.searchUsers(search, currentUser.id).then(setSearchableUsers);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search, currentUser?.id]);

  // Handle URL query parameters (e.g. from "Ask Question" button) once per query
  useEffect(() => {
    const sellerParam = searchParams.get('seller');
    const productIdParam = searchParams.get('productId');

    if (sellerParam && currentUser?.id && !queryProcessedRef.current) {
      queryProcessedRef.current = true;
      let targetUser = PRESET_USERS.vendor;
      if (sellerParam === 'admin') targetUser = PRESET_USERS.admin;
      else if (sellerParam === 'saadan') targetUser = PRESET_USERS.saadan;

      if (String(targetUser.id) !== String(currentUser.id)) {
        chatService
          .startOrGetThread(
            currentUser.id,
            targetUser.id,
            productIdParam ? `Question about Product #${productIdParam}` : 'Direct inquiry'
          )
          .then(newThreadId => {
            loadThreads().then(() => {
              setSelectedThreadId(Number(newThreadId));
            });
          });
      }
    }
  }, [searchParams, currentUser?.id, loadThreads]);

  // Load messages whenever selected thread changes
  useEffect(() => {
    if (selectedThreadId && currentUser?.id) {
      chatService.getMessages(Number(selectedThreadId)).then(msgs => {
        setMessages(msgs);
        chatService.markThreadRead(Number(selectedThreadId), currentUser.id).then(() => {
          // Refresh thread list to update unread badge
          chatService.getThreads(currentUser.id).then(setThreads);
        });
      });
    }
  }, [selectedThreadId, currentUser?.id]);

  // Use Supabase Realtime when configured; retain polling for local/offline mode.
  useEffect(() => {
    if (!selectedThreadId || !currentUser?.id) return;

    const refreshLiveChat = () => {
      chatService.getMessages(Number(selectedThreadId)).then(setMessages);
      chatService.getThreads(currentUser.id).then(setThreads);
    };
    const unsubscribe = chatService.subscribeToThread(
      Number(selectedThreadId),
      currentUser.id,
      refreshLiveChat
    );
    if (unsubscribe) return unsubscribe;

    const interval = setInterval(() => {
      refreshLiveChat();
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedThreadId, currentUser?.id]);

  // Instant refresh when user focuses window
  useEffect(() => {
    const handleFocus = () => {
      if (selectedThreadId) {
        chatService.getMessages(Number(selectedThreadId)).then(setMessages);
      }
      if (currentUser?.id) {
        chatService.getThreads(currentUser.id).then(setThreads);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [selectedThreadId, currentUser?.id]);

  // Auto scroll only the inner chat messages container (never scrolls the outer browser window)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedThreadId || !currentUser?.id || isSending) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      let activeThread = threads.find(t => Number(t.id) === Number(selectedThreadId));
      if (!activeThread) {
        const freshThreads = await chatService.getThreads(currentUser.id);
        activeThread = freshThreads.find(t => Number(t.id) === Number(selectedThreadId));
      }
      if (!activeThread) return;

      // Send real message without any fake auto-reply!
      const chatSender: ChatUser = {
        ...currentUser,
        id: currentUser.id.toString(),
      };
      const newMsg = await chatService.sendMessage(
        Number(selectedThreadId),
        currentUser.id,
        activeThread.otherUser.id,
        messageText,
        chatSender
      );

      // Update message state directly with duplicate guard
      setMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      // Refresh threads to update lastMessage and ordering
      const updated = await chatService.getThreads(currentUser.id);
      setThreads(updated);
    } finally {
      setIsSending(false);
    }
  };

  const selectedThread = threads.find(t => Number(t.id) === Number(selectedThreadId));

  const filteredThreads = threads.filter(t =>
    t.otherUser.username.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartConversation = async (targetUser: ChatUser) => {
    const threadId = await chatService.startOrGetThread(
      currentUser.id,
      targetUser.id,
      'Direct message'
    );
    await loadThreads();
    setSelectedThreadId(Number(threadId));
    setSearch('');
  };

  return (
    <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto px-2 sm:px-4 py-6 font-sans text-[#414456]">
      {/* Breadcrumb */}
      <nav className="text-[12.5px] text-[#777777] flex items-center gap-1.5 mb-2">
        <Link href="/" className="hover:text-[#00a99d] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[#333333] font-medium">Messages</span>
      </nav>

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[26px] font-bold text-[#203145]">Messages</h1>
        <p className="text-[13px] text-[#777777]">
          Direct communication between buyers and sellers.
        </p>
      </div>

      {/* Main Chat Box matching Modesy PHP chat.php */}
      <div className="bg-white rounded-[6px] border border-[#eef0f3] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row h-[700px]">
        {/* Left: Chat Contacts Panel */}
        <div className="w-full md:w-84 border-r border-[#eef0f3] flex flex-col bg-[#ffffff] shrink-0">
          {/* User Status Bar */}
          <div className="p-3.5 border-b border-[#f1f3f5] flex items-center justify-between bg-[#fafbfc]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#00a99d] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#28a745] rounded-full ring-2 ring-white"></span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-bold text-[#203145] truncate">{currentUser.username}</p>
                  <span
                    className={`text-[9.5px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                      currentUser.role === 'vendor'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : currentUser.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-[11px] text-[#777777] truncate">{currentUser.email}</p>
              </div>
            </div>
          </div>

          {/* Search Contacts */}
          <div className="p-3 border-b border-[#f1f3f5]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-[#dee2e6] rounded text-[12px] text-[#333333] placeholder-[#888888] focus:outline-none focus:border-[#00a99d] transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="px-3 py-2 text-[11px] font-semibold text-[#888888] uppercase tracking-wider bg-[#fafbfc] border-b border-[#f1f3f5] flex items-center justify-between">
            <span>Conversations</span>
            <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded-full font-medium">
              {filteredThreads.length}
            </span>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f1f3f5]">
            {search.trim() && searchableUsers.length > 0 && (
              <div className="border-b border-[#f1f3f5]">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#888888] bg-[#fafbfc]">
                  People
                </div>
                {searchableUsers.map(candidate => (
                  <button
                    key={`person-${candidate.id}`}
                    type="button"
                    onClick={() => handleStartConversation(candidate)}
                    className="w-full p-3 text-left flex items-center gap-3 hover:bg-teal-50/60 transition-colors"
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#00a99d]">
                      <Image
                        src={candidate.avatar}
                        alt={candidate.username}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-[#203145]">{candidate.username}</p>
                      <p className="truncate text-[11px] text-[#777777]">{candidate.email}</p>
                    </div>
                    <UserCheck className="h-4 w-4 shrink-0 text-[#00a99d]" />
                  </button>
                ))}
              </div>
            )}
            {loading ? (
              <div className="p-6 text-center text-xs text-gray-400">Loading conversations...</div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto" />
                <p>No conversations found for {currentUser.username}.</p>
                <p className="text-[11px] text-gray-400">
                  Click &quot;Ask Question&quot; on any product page to start chatting.
                </p>
              </div>
            ) : (
              filteredThreads.map(thread => {
                const isSelected = Number(thread.id) === Number(selectedThreadId);
                return (
                  <button
                    key={`thread-${thread.id}`}
                    type="button"
                    onClick={() => setSelectedThreadId(Number(thread.id))}
                    className={`w-full p-3 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected ? 'bg-teal-50/60 border-l-4 border-[#00a99d]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00a99d] to-[#20c997] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                        {thread.otherUser.username.slice(0, 2).toUpperCase()}
                      </div>
                      {thread.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#28a745] rounded-full ring-2 ring-white"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className="text-[13px] font-bold text-[#203145] truncate">
                            {thread.otherUser.username}
                          </p>
                          <span
                            className={`text-[9px] uppercase px-1 py-0.1 rounded font-semibold shrink-0 ${
                              thread.otherUser.role === 'vendor'
                                ? 'bg-blue-50 text-blue-600'
                                : thread.otherUser.role === 'admin'
                                ? 'bg-purple-50 text-purple-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {thread.otherUser.role === 'vendor' ? 'Seller' : thread.otherUser.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#888888] shrink-0">{thread.lastMessageTime}</span>
                      </div>
                      <p className="text-[11.5px] text-[#555555] font-medium truncate mt-0.5">{thread.subject}</p>
                      <p className="text-[11px] text-[#888888] truncate">{thread.lastMessage}</p>
                    </div>

                    {thread.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#00a99d] text-white text-[9.5px] font-bold flex items-center justify-center shrink-0 self-center">
                        {thread.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Message Thread Panel */}
        <div className="flex-1 flex flex-col bg-[#fcfdfe]">
          {selectedThread ? (
            <>
              {/* Header */}
              <div className="p-3.5 border-b border-[#eef0f3] bg-white flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00a99d] to-[#20c997] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {selectedThread.otherUser.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[13.5px] font-bold text-[#203145]">
                        {selectedThread.otherUser.username}
                      </h2>
                      <span
                        className={`text-[9.5px] uppercase px-1.5 py-0.2 rounded font-semibold ${
                          selectedThread.otherUser.role === 'vendor'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : selectedThread.otherUser.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {selectedThread.otherUser.role === 'vendor' ? 'Verified Seller' : selectedThread.otherUser.role}
                      </span>
                      <span className="text-[11px] text-[#28a745] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#28a745]"></span>
                        Online
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[#777777] line-clamp-1 mt-0.5">{selectedThread.subject}</p>
                  </div>
                </div>

                {/* Attached Product Card if any */}
                {selectedThread.product && (
                  <div className="hidden sm:flex items-center gap-2.5 p-1.5 pr-3 bg-[#f8f9fa] border border-[#eef0f3] rounded text-xs">
                    <div className="w-9 h-9 rounded relative overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={selectedThread.product.image}
                        alt={selectedThread.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 max-w-[170px]">
                      <p className="font-medium text-[#203145] truncate text-[11.5px]">
                        {selectedThread.product.title}
                      </p>
                      <p className="text-[11px] font-bold text-[#00a99d]">
                        ${selectedThread.product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages Body */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-[#f8f9fa]/50">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-gray-400">
                    No messages in this conversation yet. Send the first message below!
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    // String comparison guarantees correct alignment regardless of number/string ID types
                    const isMe = String(msg.senderId) === String(currentUser.id);

                    return (
                      <div
                        key={`msg-${msg.id}-${msg.timestamp || index}`}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] sm:max-w-[65%] rounded-[8px] px-3.5 py-2 text-[13px] shadow-2xs ${
                            isMe
                              ? 'bg-[#00a99d] text-white rounded-br-none'
                              : 'bg-white border border-[#eef0f3] text-[#333333] rounded-bl-none'
                          }`}
                        >
                          {!isMe && (
                            <p className="text-[11px] font-bold text-[#00a99d] mb-1 flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              <span>{msg.senderName}</span>
                            </p>
                          )}
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span
                              className={`text-[10px] ${
                                isMe ? 'text-white/80' : 'text-[#888888]'
                              }`}
                            >
                              {msg.createdAt}
                            </span>
                            {isMe && (
                              <CheckCheck className="w-3 h-3 text-white/80" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#eef0f3] bg-white flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Reply as ${currentUser.username} (${currentUser.role})...`}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  disabled={isSending}
                  className="flex-1 px-4 py-2 bg-[#f8f9fa] border border-[#dcdfe6] rounded-full text-[13px] text-[#333333] focus:outline-none focus:border-[#00a99d] transition-colors disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="w-10 h-10 rounded-full bg-[#00a99d] hover:bg-[#008e84] disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer"
                  aria-label="Send message"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 ml-0.5" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-xs text-gray-400 p-8 space-y-2">
              <MessageSquare className="w-10 h-10 text-gray-300" />
              <p className="text-sm font-semibold text-[#203145]">Select a conversation</p>
              <p>Choose an existing thread from the left or start a new inquiry from a product.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
