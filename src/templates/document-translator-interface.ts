import { type Style, type TDocumentDefinitions } from 'pdfmake/interfaces';
import { type CatalogsInterface } from '../catalogs/catalogs-interface.js';
import { type AbstractInvoiceData } from '../abstract-invoice-data.js';

export type DocumentTranslatorInterface<T extends AbstractInvoiceData> = {
  translate(data: T, defaultStyle: Style, catalogs: CatalogsInterface): TDocumentDefinitions;
};
