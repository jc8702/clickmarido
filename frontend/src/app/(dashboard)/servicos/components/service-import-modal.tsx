import { useState, useRef } from 'react';
import { Upload, XCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiClient } from '@/lib/api/client';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

interface ServiceImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ServiceImportModal({ isOpen, onClose, onSuccess }: ServiceImportModalProps) {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [importStep, setImportStep] = useState<'UPLOAD' | 'PREVIEW' | 'SUCCESS'>('UPLOAD');
  const [validationItems, setValidationItems] = useState<Record<string, unknown>[]>([]);
  const [importSummary, setImportSummary] = useState<{
    totalProcessed: number;
    createdCount: number;
    updatedCount: number;
    errorCount: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setImportFile(null);
    setImportError('');
    setImportStep('UPLOAD');
    setValidationItems([]);
    setImportSummary(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Selecionar arquivo para importação
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.csv') || file.type === 'text/csv') {
        setImportFile(file);
        setImportError('');
      } else {
        setImportError('O arquivo selecionado deve ser do tipo CSV.');
        setImportFile(null);
      }
    }
  };

  // Executar Validação e Preview do CSV
  const handleImportCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;

    setImportLoading(true);
    setImportError('');
    setValidationItems([]);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const csvContent = event.target?.result as string;
          const data = await ApiClient.post<Record<string, unknown>[]>(
            '/services/import/validate',
            { csv: csvContent },
          );

          if (data) {
            setValidationItems(data);
            setImportStep('PREVIEW');
          }
        } catch (err: unknown) {
          setImportError((err as Error).message || 'Erro ao processar validação do arquivo.');
        } finally {
          setImportLoading(false);
        }
      };

      reader.onerror = () => {
        setImportError('Erro ao ler o arquivo localmente.');
        setImportLoading(false);
      };

      reader.readAsText(importFile, 'UTF-8');
    } catch (err: unknown) {
      setImportError((err as Error).message || 'Erro ao iniciar leitura do arquivo.');
      setImportLoading(false);
    }
  };

  // Confirmar Importação em Lote dos itens válidos
  const handleConfirmImport = async () => {
    const validItems = validationItems.filter((item) => item.isValid);
    if (validItems.length === 0) {
      setImportError('Nenhum item válido para importar.');
      return;
    }

    setImportLoading(true);
    setImportError('');

    try {
      const data = await ApiClient.post<{
        totalProcessed: number;
        createdCount: number;
        updatedCount: number;
        errorCount: number;
      }>('/services/import/confirm', { items: validItems });

      if (data) {
        setImportSummary(data);
        setImportStep('SUCCESS');
        onSuccess();
      }
    } catch (err: unknown) {
      setImportError((err as Error).message || 'Erro ao confirmar importação em lote.');
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
      <div
        className={`relative w-full rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto ${
          importStep === 'PREVIEW' ? 'max-w-4xl' : 'max-w-md'
        }`}
      >
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            <Upload className="w-5 h-5 text-violet-500" />
            {importStep === 'UPLOAD' && 'Importar Serviços em Lote'}
            {importStep === 'PREVIEW' && 'Pré-visualização do Catálogo'}
            {importStep === 'SUCCESS' && 'Importação Concluída'}
          </h3>
          <p className="text-zinc-500 text-xs mt-1">
            {importStep === 'UPLOAD' &&
              'Faça upload de uma lista de serviços estruturada no formato .csv.'}
            {importStep === 'PREVIEW' &&
              'Revise os registros identificados e valide os conflitos/erros antes de confirmar.'}
            {importStep === 'SUCCESS' && 'Resumo do processamento em lote concluído com sucesso.'}
          </p>
        </div>

        {/* Alertas de Erro Globais */}
        {importError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500 flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            {importError}
          </div>
        )}

        {/* Conteúdo dinâmico por Step */}
        {importStep === 'UPLOAD' && (
          <form onSubmit={handleImportCsv} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Arquivo CSV
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 rounded-xl bg-zinc-900 border-2 border-dashed border-zinc-800 hover:border-violet-500/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-zinc-850"
              >
                <Upload className="w-8 h-8 text-zinc-500" />
                <span className="text-xs font-bold text-zinc-300">
                  {importFile ? importFile.name : 'Selecionar arquivo .csv'}
                </span>
                <span className="text-[10px] text-zinc-500 text-center">
                  Cabeçalho: Categoria;Nome;Descrição;Valor;Tempo Médio (min);Complexidade;Garantia
                  (dias);Especialidade;Status
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
              <Button
                type="button"
                onClick={handleClose}
                className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white font-bold h-10 px-5 rounded-lg text-xs"
              >
                Fechar
              </Button>
              {importFile && (
                <Button
                  type="submit"
                  disabled={importLoading}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50"
                >
                  {importLoading ? 'Validando...' : 'Validar e Pré-visualizar'}
                </Button>
              )}
            </div>
          </form>
        )}

        {importStep === 'PREVIEW' && (
          <div className="space-y-6">
            {/* Sumário Rápido */}
            <div className="grid grid-cols-4 gap-3 text-center text-xs font-bold">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-850">
                <span className="block text-zinc-500 text-[10px] uppercase">Lidos</span>
                <span className="text-white text-lg font-black">{validationItems.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="block text-emerald-500/70 text-[10px] uppercase">Inserir</span>
                <span className="text-lg font-black">
                  {validationItems.filter((i) => i.action === 'CREATE' && i.isValid).length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <span className="block text-amber-500/70 text-[10px] uppercase">Atualizar</span>
                <span className="text-lg font-black">
                  {validationItems.filter((i) => i.action === 'UPDATE' && i.isValid).length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <span className="block text-red-500/70 text-[10px] uppercase">Erros</span>
                <span className="text-lg font-black">
                  {validationItems.filter((i) => !i.isValid).length}
                </span>
              </div>
            </div>

            {/* Tabela de Preview */}
            <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
              <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
                <table className="w-full border-collapse text-left text-xs text-zinc-400">
                  <thead className="bg-zinc-900/60 sticky top-0 text-zinc-300 font-bold uppercase border-b border-zinc-900">
                    <tr>
                      <th className="p-3 w-16">Linha</th>
                      <th className="p-3 w-28">Ação</th>
                      <th className="p-3 w-28">Categoria</th>
                      <th className="p-3">Nome</th>
                      <th className="p-3 w-24">Valor</th>
                      <th className="p-3 w-24">Tempo</th>
                      <th className="p-3 w-28">Complexidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 font-medium">
                    {validationItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-zinc-900/20 transition-colors ${!item.isValid ? 'bg-red-500/5' : ''}`}
                      >
                        <td className="p-3 font-mono font-bold text-zinc-500">{item.index}</td>
                        <td className="p-3">
                          {!item.isValid && (
                            <Badge className="bg-red-500/15 text-red-400 border border-red-500/25 px-2 py-0.5 text-[10px] font-black uppercase">
                              Erro
                            </Badge>
                          )}
                          {item.isValid && item.action === 'CREATE' && (
                            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-black uppercase">
                              Inserir
                            </Badge>
                          )}
                          {item.isValid && item.action === 'UPDATE' && (
                            <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2 py-0.5 text-[10px] font-black uppercase">
                              Atualizar
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 text-zinc-300">{item.service.category || '-'}</td>
                        <td
                          className="p-3 font-bold text-white max-w-[200px] truncate"
                          title={item.service.name}
                        >
                          {item.service.name || (
                            <span className="text-zinc-650 italic">Sem Nome</span>
                          )}
                        </td>
                        <td className="p-3 text-emerald-400 font-mono font-bold">
                          {item.service.value ? formatCurrency(item.service.value) : '-'}
                        </td>
                        <td className="p-3 font-mono">
                          {item.service.averageTime ? `${item.service.averageTime} min` : '-'}
                        </td>
                        <td className="p-3">{item.service.complexity || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Relatório de Erros detalhado */}
            {validationItems.some((item) => !item.isValid) && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-2">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Relatório de Erros de Validação
                </h4>
                <div className="max-h-[150px] overflow-y-auto space-y-1 pr-2 scrollbar-thin text-[11px] font-medium text-red-300 font-mono">
                  {validationItems
                    .filter((item) => !item.isValid)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded bg-red-500/10 border border-red-500/20"
                      >
                        <span className="font-bold text-red-400">Linha {item.index}:</span>{' '}
                        {item.errors.join(' | ')}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
              <Button
                type="button"
                onClick={() => setImportStep('UPLOAD')}
                className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white font-bold h-10 px-5 rounded-lg text-xs"
              >
                Voltar para Upload
              </Button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleClose}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 font-bold h-10 px-5 rounded-lg text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  disabled={importLoading || validationItems.filter((i) => i.isValid).length === 0}
                  onClick={handleConfirmImport}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50 shadow-lg shadow-violet-600/20"
                >
                  {importLoading
                    ? 'Confirmando...'
                    : `Confirmar Importação (${validationItems.filter((i) => i.isValid).length} itens)`}
                </Button>
              </div>
            </div>
          </div>
        )}

        {importStep === 'SUCCESS' && importSummary && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                Catálogo Importado com Sucesso!
              </h4>
              <p className="text-zinc-500 text-xs mt-1">
                Os serviços válidos foram processados e salvos em lote no banco.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-850">
                <span className="block text-zinc-500 text-[10px] uppercase">Enviados</span>
                <span className="text-white text-base font-black">
                  {importSummary.totalProcessed}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="block text-emerald-500/70 text-[10px] uppercase">Novos</span>
                <span className="text-base font-black">{importSummary.createdCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <span className="block text-amber-500/70 text-[10px] uppercase">Atualizados</span>
                <span className="text-base font-black">{importSummary.updatedCount}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-900">
              <Button
                type="button"
                onClick={handleClose}
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold h-10 px-6 rounded-lg text-xs"
              >
                Entendido e Fechar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
