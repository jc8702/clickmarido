'use client';

import { useState, useEffect } from 'react';
import { WhatsAppInstance, getInstance, connectInstance, disconnectInstance } from '@/lib/api/modules/whatsapp';
import { QrCode, Smartphone, Wifi, WifiOff } from 'lucide-react';
import Image from 'next/image';

const COMPANY_ID = "6fb48ab0-08ab-49bd-9eab-57dd4f923ff1"; // MOCK MVP
// MOCK WEBHOOK: Aponte aqui a URL onde a Evolution API irá enviar os webhooks, 
// ex: https://seu-ngrok.app/whatsapp/webhook
const WEBHOOK_URL = "https://clickmarido-api.exemplo.com/whatsapp/webhook"; 

export default function WhatsAppSettingsPage() {
  const [instance, setInstance] = useState<WhatsAppInstance | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInstance = async () => {
    setLoading(true);
    try {
      const data = await getInstance(COMPANY_ID);
      setInstance(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstance();
    // No mundo real, faríamos um Polling se status === 'QR_CODE' para atualizar a tela
    const interval = setInterval(() => {
      if(instance?.status === 'QR_CODE') {
        getInstance(COMPANY_ID).then(data => setInstance(data));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [instance?.status]);

  const handleConnect = async () => {
    setLoading(true);
    await connectInstance(COMPANY_ID, WEBHOOK_URL);
    await fetchInstance();
  };

  const handleDisconnect = async () => {
    if(confirm('Desconectar o WhatsApp da empresa?')) {
      setLoading(true);
      await disconnectInstance(COMPANY_ID);
      await fetchInstance();
    }
  };

  if (loading && !instance) {
    return <div className="p-8">Carregando conexões do WhatsApp...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-4xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Conexão WhatsApp (Evolution API)</h2>
        <p className="text-muted-foreground">Vincule o aparelho da franquia para atender clientes e enviar mensagens automatizadas.</p>
      </div>

      <div className="bg-card border rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Instância: {instance?.instanceId}</h3>
            <div className="flex items-center gap-2 mt-1">
              {instance?.status === 'CONNECTED' ? (
                <span className="flex items-center gap-1 text-emerald-500 font-bold text-sm bg-emerald-500/10 px-2 py-1 rounded">
                  <Wifi className="w-4 h-4" /> CONECTADO
                </span>
              ) : instance?.status === 'QR_CODE' ? (
                <span className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-500/10 px-2 py-1 rounded">
                  <QrCode className="w-4 h-4" /> AGUARDANDO LEITURA
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-500 font-bold text-sm bg-rose-500/10 px-2 py-1 rounded">
                  <WifiOff className="w-4 h-4" /> DESCONECTADO
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          {instance?.status === 'CONNECTED' ? (
            <button onClick={handleDisconnect} className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded font-bold">
              Desconectar
            </button>
          ) : (
            <button onClick={handleConnect} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded font-bold">
              {loading ? 'Gerando...' : 'Gerar QR Code'}
            </button>
          )}
        </div>
      </div>

      {instance?.status === 'QR_CODE' && instance.qrCode && (
        <div className="bg-card border rounded-lg p-8 flex flex-col items-center justify-center">
          <h4 className="text-xl font-bold mb-4">Leia o QR Code com seu WhatsApp</h4>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
            Abra o WhatsApp no seu celular, vá em "Aparelhos conectados" e aponte a câmera para o QR Code abaixo.
          </p>
          <div className="bg-white p-4 rounded-xl shadow-lg border">
            {/* O qrcode vem em formato de string base64 */}
            <Image src={instance.qrCode} alt="WhatsApp QR Code" width={256} height={256} className="rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
