import { type SatCatalog } from '@nodecfdi/sat-micro-catalogs';
import { type TDocumentDefinitions } from 'pdfmake/interfaces.js';
import type AbstractInvoiceData from '#src/abstract_invoice_data';

export type DocumentOptions = Omit<TDocumentDefinitions, 'content' | 'footer'>;

export interface CatalogsData {
  cfdi40Impuestos: SatCatalog;
  cfdi40ObjetosImpuestos: SatCatalog;
  cfdi40UsosCfdi: SatCatalog;
  cfdi40RegimenesFiscales: SatCatalog;
  cfdi40TiposRelaciones: SatCatalog;
  cfdi40Meses: SatCatalog;
  cfdi40Periodicidades: SatCatalog;
  cfdi40Exportaciones: SatCatalog;
  cfdi40MetodosPago: SatCatalog;
  cfdi40FormasPago: SatCatalog;
  cfdi40TiposComprobantes: SatCatalog;
  pagosTiposCadenaPago: SatCatalog;
  retenciones20ClavesRetencion: SatCatalog;
  retenciones20Periodicidades: SatCatalog;
  retenciones20Periodos: SatCatalog;
  retenciones20TiposPago: SatCatalog;
}

export type DocumentTranslatorInterface<T extends AbstractInvoiceData> = {
  translate(
    data: T,
    documentDefinitionsOptions: DocumentOptions,
    catalogs: CatalogsData,
    primaryColor: string,
    bgGrayColor: string,
  ): TDocumentDefinitions;
};
