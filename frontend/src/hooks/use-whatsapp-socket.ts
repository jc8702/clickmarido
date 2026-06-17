'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

interface UseWhatsAppSocketOptions {
  companyId?: string;
  onNewMessage?: (data: { conversation: unknown; message: unknown }) => void;
  onInstanceStatus?: (data: { instanceId: string; status: string; qrCode?: string }) => void;
  onConversationUpdate?: (data: unknown) => void;
  enabled?: boolean;
}

export function useWhatsAppSocket(options: UseWhatsAppSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const {
    companyId,
    onNewMessage,
    onInstanceStatus,
    onConversationUpdate,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled || !companyId) return;

    const socket = io(`${WS_URL}/ws/whatsapp`, {
      query: { companyId },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;
    setSocket(socket);

    socket.on('connect', () => {
      socket.emit('join-company', companyId);
    });

    if (onNewMessage) {
      socket.on('new-message', onNewMessage);
    }
    if (onInstanceStatus) {
      socket.on('instance-status', onInstanceStatus);
    }
    if (onConversationUpdate) {
      socket.on('conversation-update', onConversationUpdate);
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [companyId, enabled]);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { socket, emit };
}
