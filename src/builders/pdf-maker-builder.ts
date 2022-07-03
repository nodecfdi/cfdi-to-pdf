import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { createWriteStream } from 'fs';
import { BuilderInterface } from './builder-interface';
import { DocumentTranslatorInterface } from '~/templates/document-translator-interface';
import { AbstractInvoiceData } from '~/abstract-invoice-data';
import { getPdfMake, PdfMakeNode } from '~/pdfmake-builder';

export class PdfMakerBuilder<T extends AbstractInvoiceData> implements BuilderInterface<T> {
    private _documentTranslator: DocumentTranslatorInterface<T>;

    constructor(documentTranslator: DocumentTranslatorInterface<T>) {
        this._documentTranslator = documentTranslator;
    }

    public build(data: T, destination: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const pdfTemplate = this.buildPdf(data);
            const pdfStream = getPdfMake<PdfMakeNode>().createPdfKitDocument(pdfTemplate, {});
            pdfStream.pipe(createWriteStream(destination));
            pdfStream.on('end', () => {
                return resolve();
            });
            pdfStream.on('error', (err: Error) => {
                return reject(err);
            });
            pdfStream.end();
        });
    }

    public buildBase64(data: T): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const pdfTemplate = this.buildPdf(data);
            const pdfStream = getPdfMake<PdfMakeNode>().createPdfKitDocument(pdfTemplate, {});
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
