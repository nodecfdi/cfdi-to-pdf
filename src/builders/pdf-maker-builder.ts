import { Style, TDocumentDefinitions } from 'pdfmake/interfaces';
import { BuilderInterface } from './builder-interface';
import { DocumentTranslatorInterface } from '../templates/document-translator-interface';
import { AbstractInvoiceData } from '../abstract-invoice-data';
import { getPdfMake, PdfMakeNode } from '../pdfmake-builder';
import { StaticCatalogs } from '../catalogs/static-catalogs';
import { CatalogsInterface } from '../catalogs/catalogs-interface';

export class PdfMakerBuilder<T extends AbstractInvoiceData> implements BuilderInterface<T> {
    private readonly _documentTranslator: DocumentTranslatorInterface<T>;

    private readonly _defaultStyle: Style;

    constructor(documentTranslator: DocumentTranslatorInterface<T>, defaultStyle?: Style) {
        this._documentTranslator = documentTranslator;
        if (!defaultStyle) {
            defaultStyle = {
                font: 'Roboto'
            };
        }
        this._defaultStyle = defaultStyle;
    }

    public build(data: T, destination: string, catalogs: CatalogsInterface = new StaticCatalogs()): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const fs = require('fs');
            const pdfTemplate = this.buildPdf(data, catalogs);
            const pdfStream = getPdfMake<PdfMakeNode>().createPdfKitDocument(pdfTemplate, {});
            const fileWriteStream = fs.createWriteStream(destination);
            fileWriteStream.on('error', (err: Error) => {
                fileWriteStream.end();

                return reject(err);
            });

            pdfStream.pipe(fileWriteStream);
            pdfStream.on('end', () => {
                return resolve();
            });
            pdfStream.on('error', (err) => {
                /* istanbul ignore next */
                return reject(err);
            });
            pdfStream.end();
        });
    }

    public buildBase64(data: T, catalogs: CatalogsInterface = new StaticCatalogs()): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const pdfTemplate = this.buildPdf(data, catalogs);
            const pdfStream = getPdfMake<PdfMakeNode>().createPdfKitDocument(pdfTemplate, {});
            const chunks: Uint8Array[] = [];
            pdfStream.on('data', (chunk) => {
                chunks.push(chunk);
            });
            pdfStream.on('end', () => {
                return resolve(Buffer.concat(chunks).toString('base64'));
            });
            pdfStream.on('error', (err) => {
                /* istanbul ignore next */
                return reject(err);
            });
            pdfStream.end();
        });
    }

    public buildPdf(data: T, catalogs: CatalogsInterface): TDocumentDefinitions {
        return this._documentTranslator.translate(data, this._defaultStyle, catalogs);
    }
}
