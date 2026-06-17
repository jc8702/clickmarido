import Image from 'next/image';
import type { Quote } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface QuotePrintTemplateProps {
  quote: Quote;
}

export function QuotePrintTemplate({ quote }: QuotePrintTemplateProps) {
  return (
    <div className="hidden print:block print:bg-white print:text-black print:p-8 space-y-8">
      <div className="flex justify-between items-start border-b pb-6">
        <div>
          <h1 className="text-3xl font-black text-black">CLICK MARIDO</h1>
          <p className="text-sm text-gray-500">Faz Tudo & Soluções Residenciais</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">ORÇAMENTO #{quote.number}</h2>
          <p className="text-xs text-gray-500">Data de emissão: {formatDate(quote.createdAt)}</p>
          <p className="text-xs text-gray-500">Status: {quote.status}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
        <div className="space-y-1">
          <h3 className="text-xs font-black text-gray-400 uppercase">Dados do Cliente</h3>
          <p className="text-sm font-bold text-gray-800">{quote.client.name}</p>
          <p className="text-xs text-gray-600">Tel: {quote.client.phone}</p>
          {quote.client.email && (
            <p className="text-xs text-gray-600">Email: {quote.client.email}</p>
          )}
          {quote.client.address && (
            <p className="text-xs text-gray-600">End: {quote.client.address}</p>
          )}
        </div>
        <div className="space-y-1 text-right">
          <h3 className="text-xs font-black text-gray-400 uppercase">Prestador</h3>
          <p className="text-sm font-bold text-gray-800">Click Marido Soluções</p>
          <p className="text-xs text-gray-600">Multiempresa ERP SaaS</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-800 border-b pb-1">Serviços Contratados</h3>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b text-gray-400 uppercase font-black">
              <th className="py-2">Serviço / Categoria</th>
              <th className="py-2 text-center">Quantidade</th>
              <th className="py-2 text-right">Unitário</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {quote.services.map((s, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">
                  <p className="font-bold text-gray-800">
                    {s.service?.name || 'Serviço Personalizado'}
                  </p>
                  <p className="text-[10px] text-gray-500">{s.service?.category}</p>
                </td>
                <td className="py-2 text-center font-semibold">{s.quantity}</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(s.value)}</td>
                <td className="py-2 text-right font-bold">
                  {formatCurrency(s.quantity * s.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {quote.materials && quote.materials.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800 border-b pb-1">Materiais Fornecidos</h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b text-gray-400 uppercase font-black">
                <th className="py-2">Material</th>
                <th className="py-2 text-center">Quantidade</th>
                <th className="py-2 text-right">Unitário</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.materials.map((m, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 font-bold text-gray-800">{m.description}</td>
                  <td className="py-2 text-center font-semibold">{m.quantity}</td>
                  <td className="py-2 text-right font-semibold">{formatCurrency(m.value)}</td>
                  <td className="py-2 text-right font-bold">
                    {formatCurrency(m.quantity * m.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end">
        <div className="w-64 space-y-2 border-t pt-4 text-xs font-semibold text-gray-700">
          <div className="flex justify-between">
            <span>Deslocamento:</span>
            <span>{formatCurrency(quote.travelFee)}</span>
          </div>
          <div className="flex justify-between text-red-500">
            <span>Desconto:</span>
            <span>- {formatCurrency(quote.discount)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-sm font-black text-gray-900">
            <span>Valor Final:</span>
            <span>{formatCurrency(quote.totalValue)}</span>
          </div>
        </div>
      </div>

      {quote.signature ? (
        <div className="pt-8 flex flex-col items-center justify-center space-y-2">
          <p className="text-xs font-black text-gray-400 uppercase">
            Assinatura Digital do Cliente
          </p>
          <div className="relative border border-gray-300 rounded-lg p-2 bg-white w-72 h-36 flex items-center justify-center">
            <Image
              src={quote.signature}
              alt="Assinatura"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <p className="text-[10px] text-gray-500 font-semibold">
            Assinado eletronicamente em: {quote.signedAt ? formatDate(quote.signedAt) : ''}
          </p>
        </div>
      ) : (
        <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs font-bold text-gray-400">
          <div className="border-t pt-4">Assinatura do Prestador</div>
          <div className="border-t pt-4">Assinatura do Cliente</div>
        </div>
      )}
    </div>
  );
}
