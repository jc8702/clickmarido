'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Conversation,
  Message,
  getConversations,
  getMessages,
  sendMessage,
} from '@/lib/api/modules/whatsapp';
import { Send, User, Check, CheckCheck, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const COMPANY_ID = '6fb48ab0-08ab-49bd-9eab-57dd4f923ff1'; // MOCK MVP

export default function ConversasPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const data = await getConversations(COMPANY_ID);
      setConversations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    // Simulação de Polling simplificado
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectChat = async (chat: Conversation) => {
    setSelectedChat(chat);
    try {
      const data = await getMessages(chat.id);
      setMessages(data);
      scrollToBottom();

      // Atualizar localmente unreadCount
      setConversations((prev) =>
        prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c)),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChat) return;

    const text = inputText;
    setInputText('');

    // Pre-insert optimistically
    const optimisticMsg: Message = {
      id: crypto.randomUUID(),
      fromMe: true,
      messageType: 'TEXT',
      content: text,
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom();

    try {
      await sendMessage(selectedChat.id, text);
      // Fariamos fetch novamente se o backend demorasse ou tivessemos WS
    } catch (e) {
      console.error(e);
      // Removendo optimist message se falhou
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] p-4 md:p-6 gap-6">
      {/* SIDEBAR DE CONVERSAS */}
      <div className="w-1/3 min-w-[300px] flex flex-col glass-card border-border/50 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-muted/50">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-500" /> WhatsApp
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Carregando conversas...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Nenhuma conversa encontrada.
            </div>
          ) : (
            conversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`p-4 border-b border-border/50 cursor-pointer transition-colors hover:bg-muted/50 flex items-center gap-3 ${selectedChat?.id === chat.id ? 'bg-muted' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm truncate">
                      {chat.client?.name || chat.contactName || chat.contactNumber}
                    </h4>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {format(new Date(chat.lastMessageAt), 'HH:mm')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{chat.contactNumber}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* CHAT ATIVO */}
      <div className="flex-1 flex flex-col glass-card border-border/50 rounded-xl shadow-sm overflow-hidden">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold">
                  {selectedChat.client?.name ||
                    selectedChat.contactName ||
                    selectedChat.contactNumber}
                </h3>
                <p className="text-xs text-muted-foreground">{selectedChat.contactNumber}</p>
              </div>
            </div>

            {/* Body */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/20"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-xl px-4 py-2 ${msg.fromMe ? 'bg-emerald-500 text-white rounded-tr-sm' : 'bg-background border border-border/50 shadow-sm rounded-tl-sm'}`}
                  >
                    {msg.messageType === 'OTHER' ? (
                      <div className="italic text-sm opacity-80">[Mídia Recebida]</div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
                    <div
                      className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${msg.fromMe ? 'text-emerald-100' : 'text-muted-foreground'}`}
                    >
                      {format(new Date(msg.timestamp), 'HH:mm')}
                      {msg.fromMe &&
                        (msg.read ? (
                          <CheckCheck className="w-3 h-3" />
                        ) : (
                          <Check className="w-3 h-3" />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-background/50">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 border border-border/50 rounded-full px-4 py-2 bg-muted/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare className="w-10 h-10 opacity-50" />
            </div>
            <p>Selecione uma conversa para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}
