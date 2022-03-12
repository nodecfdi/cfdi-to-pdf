import { BuilderInterface } from './builder-interface';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DocumentTranslatorInterface } from '../templates/document-translator-interface';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { AbstractInvoiceData } from '../abstract-invoice-data';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class PdfMakerBrowserBuilder<T extends AbstractInvoiceData> implements BuilderInterface<T> {
    private _documentTranslator: DocumentTranslatorInterface<T>;

    constructor(documentTranslator: DocumentTranslatorInterface<T>) {
        this._documentTranslator = documentTranslator;
    }

    public build(_data: T, _destination: string): Promise<void> {
        console.warn('This method not permitted on browser');
        return Promise.reject('Method not work on browser');
    }

    public buildBase64(data: T): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                const pdfTemplate = this.buildPdf(data);
                const pfdDocGenerator = pdfMake.createPdf(pdfTemplate);
                pfdDocGenerator.getBase64((pdfBase64) => {
                    resolve(pdfBase64);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public buildPdf(data: T): TDocumentDefinitions {
        return this._documentTranslator.translate(data);
    }
}
