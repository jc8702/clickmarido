'use client';

import { Technician } from '@/lib/api-technicians';
import Link from 'next/link';

interface TechniciansTableProps {
  technicians: Technician[];
  onEdit: (tech: Technician) => void;
  onDelete: (id: string) => void;
}

export function TechniciansTable({ technicians, onEdit, onDelete }: TechniciansTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Telefone</th>
            <th className="px-4 py-3">Especialidade</th>
            <th className="px-4 py-3">Avaliação</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-card">
          {technicians.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">Nenhum técnico cadastrado.</td>
            </tr>
          ) : (
            technicians.map((tech) => (
              <tr key={tech.id} className="border-t">
                <td className="px-4 py-3 font-medium">{tech.name}</td>
                <td className="px-4 py-3">{tech.phone}</td>
                <td className="px-4 py-3">{tech.specialty || '-'}</td>
                <td className="px-4 py-3">⭐ {tech.rating.toFixed(1)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${tech.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tech.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/tecnicos/${tech.id}`} className="text-primary hover:underline mr-3 font-medium">Perfil</Link>
                  <button onClick={() => onEdit(tech)} className="text-blue-500 hover:text-blue-700 mr-3">Editar</button>
                  <button onClick={() => { if(confirm('Excluir técnico?')) onDelete(tech.id); }} className="text-red-500 hover:text-red-700">Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
