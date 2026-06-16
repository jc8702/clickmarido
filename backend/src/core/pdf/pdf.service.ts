import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Quote, Client, QuoteService, Service } from '@prisma/client';

interface QuoteServiceWithDetails extends QuoteService {
  service?: Service;
}

interface QuotePdfData extends Quote {
  client?: Client;
  services?: QuoteServiceWithDetails[];
}

@Injectable()
export class PdfService {
  async generateQuotePdf(quoteData: QuotePdfData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Header
        doc.fontSize(20).text('Orçamento - Click Marido', { align: 'center' });
        doc.moveDown();

        // Dados do Orçamento
        doc.fontSize(12).text(`ID do Orçamento: ${quoteData.id}`);
        doc.text(`Data: ${new Date(quoteData.createdAt).toLocaleDateString()}`);
        doc.text(`Status: ${quoteData.status}`);
        if (quoteData.client) {
          doc.text(`Cliente: ${quoteData.client.name}`);
        }
        doc.moveDown();

        // Serviços
        doc.fontSize(14).text('Serviços:', { underline: true });
        doc.moveDown(0.5);
        if (quoteData.services && quoteData.services.length > 0) {
          quoteData.services.forEach((item) => {
            doc
              .fontSize(12)
              .text(
                `- ${item.service?.name || 'Serviço'} (Qtd: ${item.quantity}) - R$ ${item.value}`,
              );
          });
        } else {
          doc.fontSize(12).text('Nenhum serviço detalhado.');
        }
        doc.moveDown();

        // Total
        doc
          .fontSize(16)
          .text(`Total: R$ ${quoteData.totalValue}`, { align: 'right' });

        doc.end();
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }
}
