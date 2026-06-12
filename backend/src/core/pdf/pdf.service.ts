import { Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import { PassThrough } from 'stream';

@Injectable()
export class PdfService {
  async generateQuotePdf(quoteData: any): Promise<Buffer> {
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
        if (quoteData.items && quoteData.items.length > 0) {
          quoteData.items.forEach((item: any) => {
            doc.fontSize(12).text(`- ${item.service?.name || 'Serviço'} (Qtd: ${item.quantity}) - R$ ${item.unitPrice}`);
          });
        } else {
          doc.fontSize(12).text('Nenhum serviço detalhado.');
        }
        doc.moveDown();
        
        // Total
        doc.fontSize(16).text(`Total: R$ ${quoteData.totalAmount}`, { align: 'right' });
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
