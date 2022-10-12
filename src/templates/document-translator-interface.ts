import { Style, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CatalogsInterface } from '../catalogs/catalogs-interface';
import { AbstractInvoiceData } from '../abstract-invoice-data';

export interface DocumentTranslatorInterface<T extends AbstractInvoiceData> {
    translate(data: T, defaultStyle: Style, catalogs: CatalogsInterface): TDocumentDefinitions;
}
