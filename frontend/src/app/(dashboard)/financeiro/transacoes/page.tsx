'use client';

import { useState, useEffect } from 'react';
import { FinancialTransaction, getFinancialTransactions, createTransaction, deleteTransaction, updateTransaction } from '@/lib/api-financial';
import { format } from 'date-fns';
import { Plus, Trash, CheckCircle } from 'lucide-react';

const COMPANY_ID = "6fb48ab0-08ab-49bd-9eab-57dd4f923ff1"; // MOCK for MVP

export default function FinancialTransactionsPage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [type, setType] = useState<'RECEITA' | 'DESPESA'>('RECEITA');
  const [category, setCategory] = useState('PIX');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().substring(0, 10));
  const [status, setStatus] = useState<'PENDENTE' | 'PAGO' | 'CANCELADO'>('PAGO');

  const fetchTx = async () => {
    setLoading(true);
    try {
      const data = await getFinancialTransactions(COMPANY_ID);
      setTransactions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTx();
  }, []);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    await createTransaction({
      companyId: COMPANY_ID,
      type,
      category,
      value: parseFloat(value),
      description,
      transactionDate: new Date(transactionDate).toISOString(),
      status,
      paidAt: status === 'PAGO' ? new Date().toISOString() : undefined,
    });
    setIsModalOpen(false);
    fetchTx();
  };

  const handleMarkAsPaid = async (tx: FinancialTransaction) => {
    await updateTransaction(tx.id, { status: 'PAGO', paidAt: new Date().toISOString() });
    fetchTx();
  };

  const handleDelete = async (id: string) => {
    if(confirm('Tem certeza?')) {
      await deleteTransaction(id);
      fetchTx();
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Extrato & Lançamentos</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Lançamento
        </button>
      </div>

      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-card">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-4">Carregando...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4">Nenhuma transação encontrada.</td></tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx.id} className="border-t">
                  <td className="px-4 py-3">{format(new Date(tx.transactionDate), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3 font-bold">
                    <span className={tx.type === 'RECEITA' ? 'text-emerald-500' : 'text-rose-500'}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">{tx.category}</td>
                  <td className="px-4 py-3">{tx.description || '-'}</td>
                  <td className="px-4 py-3 text-right font-medium">R$ {tx.value.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${tx.status === 'PAGO' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    {tx.status === 'PENDENTE' && (
                      <button onClick={() => handleMarkAsPaid(tx)} title="Marcar como Pago" className="text-emerald-500 hover:text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(tx.id)} title="Excluir" className="text-rose-500 hover:text-rose-400">
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md p-6 rounded-xl border">
            <h3 className="text-xl font-bold mb-4">Novo Lançamento</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">Tipo</label>
                  <select value={type} onChange={e => setType(e.target.value as any)} className="w-full border p-2 rounded bg-background">
                    <option value="RECEITA">RECEITA (+)</option>
                    <option value="DESPESA">DESPESA (-)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Data</label>
                  <input type="date" value={transactionDate} onChange={e => setTransactionDate(e.target.value)} required className="w-full border p-2 rounded bg-background" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Categoria</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border p-2 rounded bg-background">
                  {type === 'RECEITA' ? (
                    <>
                      <option value="PIX">PIX</option>
                      <option value="DINHEIRO">DINHEIRO</option>
                      <option value="CARTAO">CARTAO</option>
                      <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                    </>
                  ) : (
                    <>
                      <option value="COMBUSTIVEL">COMBUSTIVEL</option>
                      <option value="MATERIAIS">MATERIAIS</option>
                      <option value="FERRAMENTAS">FERRAMENTAS</option>
                      <option value="MARKETING">MARKETING</option>
                      <option value="OUTROS">OUTROS</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Valor (R$)</label>
                <input type="number" step="0.01" min="0" value={value} onChange={e => setValue(e.target.value)} required className="w-full border p-2 rounded bg-background" placeholder="0.00" />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Descrição</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded bg-background" placeholder="Opcional" />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Status do Pagamento</label>
                <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full border p-2 rounded bg-background">
                  <option value="PAGO">PAGO / RECEBIDO</option>
                  <option value="PENDENTE">PENDENTE (A Vencer)</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
