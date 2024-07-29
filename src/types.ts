import { type TDocumentDefinitions } from 'pdfmake/interfaces.js';
import type AbstractInvoiceData from '#src/abstract_invoice_data';

export interface CatalogItem {
  id: string;
  texto: string;
}

export type DocumentOptions = Omit<TDocumentDefinitions, 'content' | 'footer'>;

export interface CatalogsData {
  cfdi40Impuestos: CatalogItem[];
  cfdi40ObjetosImpuestos: CatalogItem[];
  cfdi40UsosCfdi: CatalogItem[];
  cfdi40RegimenesFiscales: CatalogItem[];
  cfdi40TiposRelaciones: CatalogItem[];
  cfdi40Meses: CatalogItem[];
  cfdi40Periodicidades: CatalogItem[];
  cfdi40Exportaciones: CatalogItem[];
  cfdi40MetodosPago: CatalogItem[];
  cfdi40FormasPago: CatalogItem[];
  cfdi40TiposComprobantes: CatalogItem[];
  retenciones20ClavesRetencion: CatalogItem[];
}

export type DocumentTranslatorInterface<T extends AbstractInvoiceData> = {
  translate(
    data: T,
    documentDefinitionsOptions: DocumentOptions,
    catalogs: CatalogsData,
    primaryColor: string,
  ): TDocumentDefinitions;
};
