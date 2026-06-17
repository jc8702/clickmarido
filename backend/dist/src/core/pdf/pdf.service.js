"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = __importDefault(require("pdfkit"));
let PdfService = class PdfService {
    async generateQuotePdf(quoteData) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({ margin: 50 });
                const buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => resolve(Buffer.concat(buffers)));
                doc.fontSize(20).text('Orçamento - Click Marido', { align: 'center' });
                doc.moveDown();
                doc.fontSize(12).text(`ID do Orçamento: ${quoteData.id}`);
                doc.text(`Data: ${new Date(quoteData.createdAt).toLocaleDateString()}`);
                doc.text(`Status: ${quoteData.status}`);
                if (quoteData.client) {
                    doc.text(`Cliente: ${quoteData.client.name}`);
                }
                doc.moveDown();
                doc.fontSize(14).text('Serviços:', { underline: true });
                doc.moveDown(0.5);
                if (quoteData.services && quoteData.services.length > 0) {
                    quoteData.services.forEach((item) => {
                        doc
                            .fontSize(12)
                            .text(`- ${item.service?.name || 'Serviço'} (Qtd: ${item.quantity}) - R$ ${item.value}`);
                    });
                }
                else {
                    doc.fontSize(12).text('Nenhum serviço detalhado.');
                }
                doc.moveDown();
                doc
                    .fontSize(16)
                    .text(`Total: R$ ${quoteData.totalValue}`, { align: 'right' });
                doc.end();
            }
            catch (error) {
                reject(error instanceof Error ? error : new Error(String(error)));
            }
        });
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map