import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { AbstractInvoiceData } from '~/abstract-invoice-data';

export interface DocumentTranslatorInterface<T extends AbstractInvoiceData> {
    translate(data: T): TDocumentDefinitions;
}
