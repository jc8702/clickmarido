import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ApiClient } from '@/lib/api/client';
import type { Quote } from '../types';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteId: string;
  onSuccess: (updatedQuote: Quote) => void;
}

export function SignatureModal({ isOpen, onClose, quoteId, onSuccess }: SignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sigError, setSigError] = useState('');
  const [sigLoading, setSigLoading] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#5b21b6';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [isOpen]);

  const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');

    setSigLoading(true);
    setSigError('');
    try {
      const res = await ApiClient.post<{ success: boolean; data: Quote }>(
        `/quotes/${quoteId}/sign`,
        {
          signature: dataUrl,
        },
      );

      if (res.success) {
        onSuccess(res.data);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar assinatura.';
      setSigError(errorMessage);
    } finally {
      setSigLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in-fade">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-5">
        <div>
          <h4 className="text-md font-bold text-white">Assinar Proposta Eletrônica</h4>
          <p className="text-zinc-500 text-[11px] mt-0.5">
            Assine usando o mouse ou desenhando na tela.
          </p>
        </div>

        {sigError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500">
            {sigError}
          </div>
        )}

        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={360}
            height={180}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="border border-zinc-700 bg-white rounded-xl cursor-crosshair touch-none"
          />
        </div>

        <div className="flex justify-between items-center">
          <Button
            type="button"
            onClick={clearCanvas}
            className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 font-bold h-9 px-4 rounded-xl text-xs"
          >
            Limpar Tela
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={onClose}
              className="text-zinc-500 hover:text-white text-xs font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={saveSignature}
              disabled={sigLoading}
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold h-9 px-4 rounded-xl text-xs"
            >
              {sigLoading ? 'Aprovando...' : 'Confirmar e Aprovar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
