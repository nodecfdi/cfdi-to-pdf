import { BuilderInterface } from './builder-interface';
import PdfPrinter from 'pdfmake';
import { createWriteStream } from 'fs';
import { DocumentTranslatorInterface } from '../templates/document-translator-interface';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { AbstractInvoiceData } from '../abstract-invoice-data';

export class PdfMakerBuilder<T extends AbstractInvoiceData> implements BuilderInterface<T> {
    private _printer: PdfPrinter;
    private _documentTranslator: DocumentTranslatorInterface<T>;

    constructor(documentTranslator: DocumentTranslatorInterface<T>, printer: PdfPrinter | null = null) {
        if (!printer) {
            const fonts = {
                Courier: {
                    normal: 'Courier',
                    bold: 'Courier-Bold',
                    italics: 'Courier-Oblique',
                    bolditalics: 'Courier-BoldOblique',
                },
                Helvetica: {
                    normal: 'Helvetica',
                    bold: 'Helvetica-Bold',
                    italics: 'Helvetica-Oblique',
                    bolditalics: 'Helvetica-BoldOblique',
                },
                Times: {
                    normal: 'Times-Roman',
                    bold: 'Times-Bold',
                    italics: 'Times-Italic',
                    bolditalics: 'Times-BoldItalic',
                },
                Symbol: {
                    normal: 'Symbol',
                },
                ZapfDingbats: {
                    normal: 'ZapfDingbats',
                },
            };
            printer = new PdfPrinter(fonts);
        }

        this._documentTranslator = documentTranslator;
        this._printer = printer;
    }

    public build(data: T, destination: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const pdfTemplate = this.buildPdf(data);
            const pdfStream = this._printer.createPdfKitDocument(pdfTemplate, {});
            pdfStream.pipe(createWriteStream(destination));
            pdfStream.on('end', () => {
                return resolve();
            });
            pdfStream.on('error', (err) => {
                return reject(err);
            });
            pdfStream.end();
        });
    }

    public buildBase64(data: T): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const pdfTemplate = this.buildPdf(data);
            const pdfStream = this._printer.createPdfKitDocument(pdfTemplate, {});
            const chunks: Uint8Array[] = [];
            pdfStream.on('data', (chunk) => {
                chunks.push(chunk);
            });
            pdfStream.on('end', () => {
                return resolve(Buffer.concat(chunks).toString('base64'));
            });
            pdfStream.on('error', (err) => {
                return reject(err);
            });
            pdfStream.end();
        });
    }

    public buildPdf(data: T): TDocumentDefinitions {
        return this._documentTranslator.translate(data);
    }
}
