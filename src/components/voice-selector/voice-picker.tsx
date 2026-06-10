'use client';

import { useState, useEffect, useCallback } from 'react';
import { VoicePreset, VoiceConfig } from '@/types';

interface VoicePickerProps {
  language?: string;
  gender?: string;
  style?: string;
  value?: VoiceConfig;
  onChange: (voice: VoiceConfig) => void;
  label?: string;
}

export function VoicePicker({
  language,
  gender,
  style,
  value,
  onChange,
  label = 'Selecionar Voz',
}: VoicePickerProps) {
  const [voices, setVoices] = useState<VoicePreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGender, setActiveGender] = useState<string>(gender || 'male');
  const [activeStyle, setActiveStyle] = useState<string>(style || 'corporate');
  const [activeLanguage, setActiveLanguage] = useState<string>(language || 'pt-BR');

  const fetchVoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeGender) params.set('gender', activeGender);
      if (activeStyle) params.set('style', activeStyle);
      if (activeLanguage) params.set('language', activeLanguage);

      const response = await fetch(`/api/tts/voices?${params}`);
      const result = await response.json();

      if (result.success) {
        setVoices(result.data);
      }
    } catch (error) {
      console.error('Erro ao buscar vozes:', error);
    } finally {
      setLoading(false);
    }
  }, [activeGender, activeStyle, activeLanguage]);

  useEffect(() => {
    const load = async () => {
      await fetchVoices();
    };
    load();
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [fetchVoices]);

  const handleSelect = (voice: VoicePreset) => {
    onChange({
      gender: voice.gender,
      style: voice.style,
      language: voice.language,
      provider: voice.provider,
      providerVoiceId: voice.providerVoiceId,
    });
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-zinc-300">{label}</label>

      <div className="flex flex-wrap gap-2">
        <select
          value={activeGender}
          onChange={e => setActiveGender(e.target.value)}
          className="bg-zinc-800 text-zinc-200 rounded-lg px-3 py-1.5 text-sm border border-zinc-700"
        >
          <option value="male">Masculina</option>
          <option value="female">Feminina</option>
        </select>

        <select
          value={activeStyle}
          onChange={e => setActiveStyle(e.target.value)}
          className="bg-zinc-800 text-zinc-200 rounded-lg px-3 py-1.5 text-sm border border-zinc-700"
        >
          <option value="corporate">Corporativa</option>
          <option value="young">Jovem</option>
          <option value="adult">Adulta</option>
          <option value="institutional">Institucional</option>
        </select>

        <select
          value={activeLanguage}
          onChange={e => setActiveLanguage(e.target.value)}
          className="bg-zinc-800 text-zinc-200 rounded-lg px-3 py-1.5 text-sm border border-zinc-700"
        >
          <option value="pt-BR">Português Brasil</option>
          <option value="en-US">English</option>
          <option value="es-ES">Español</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {loading ? (
          <div className="col-span-full text-center py-4 text-zinc-500">
            Carregando vozes...
          </div>
        ) : voices.length === 0 ? (
          <div className="col-span-full text-center py-4 text-zinc-500">
            Nenhuma voz encontrada para este filtro
          </div>
        ) : (
          voices.map(voice => {
            const isSelected = value?.providerVoiceId === voice.providerVoiceId;
            return (
              <button
                key={voice.id}
                onClick={() => handleSelect(voice)}
                className={`text-left px-3 py-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {voice.gender === 'male' ? '👨' : '👩'}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{voice.name}</div>
                    <div className="text-xs text-zinc-500">
                      {voice.provider} · {voice.style}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
