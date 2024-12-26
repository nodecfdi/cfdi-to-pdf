import { wrapCatalog } from '@nodecfdi/sat-micro-catalogs';
import {
  type BufferOptions,
  type CustomTableLayout,
  type Margins,
  type Style,
  type StyleDictionary,
} from 'pdfmake/interfaces.js';
import type AbstractInvoiceData from '../abstract_invoice_data.js';
import { type CatalogsData, type DocumentOptions, type DocumentTranslatorInterface } from '../types.js';

export default class AbstractPdfMakerBuilder<T extends AbstractInvoiceData> {
  declare protected _documentTranslator: DocumentTranslatorInterface<T>;

  declare protected _catalogs?: CatalogsData;

  declare protected _documentOptions: DocumentOptions;

  declare protected _options?: BufferOptions;

  protected _primaryColor = '#359136';

  protected _bgGrayColor = '#f8f8f8';

  protected _defaultPageMargins: Margins = [20, 30, 20, 30];

  public setPrimaryColor(color: string): void {
    this._primaryColor = color;
  }

  public setBgGrayColor(color: string): void {
    this._bgGrayColor = color;
  }

  public defaultStyle(): Style {
    return {
      font: 'Helvetica',
      fontSize: 8,
    };
  }

  public defaultDictionaryStyles(): StyleDictionary {
    return {
      header: {
        fontSize: 12,
        bold: true,
      },
      subHeader: {
        fontSize: 10,
        bold: true,
      },
      tableSubtitleHeader: {
        fontSize: 9,
        bold: true,
      },
      tableHeader: {
        bold: true,
        color: 'white',
      },
      tableSmall: {
        fontSize: 7,
      },
      tableSat: {
        fontSize: 5,
      },
      tableSatSub: {
        bold: true,
      },
    };
  }

  protected async defaultCatalogs(): Promise<CatalogsData> {
    const cfdi40ImpuestosRaw = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_impuestos');
    const cfdi40ObjetosImpuestosRaw = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_objetos_impuestos');
    const cfdi40UsosCfdiRaw = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_usos_cfdi');
    const cfdi40RegimenesFiscalesRaw = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_regimenes_fiscales');
    const cfdi40TiposRelacionesRaw = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_tipos_relaciones');
    const cfdi40MesesRaw = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_meses');
    const cfdi40PeriodicidadesRaw = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_periodicidades');
    const cfdi40ExportacionesRaw = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_exportaciones');
    const cfdi40MetodosPagoRaw = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_metodos_pago');
    const cfdi40FormasPagoRaw = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_formas_pago');
    const cfdi40TiposComprobantesRaw = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_tipos_comprobantes');
    const pagosTiposCadenaPagoRaw = await import('@nodecfdi/sat-micro-catalogs/raw/pagos_tipos_cadena_pago');
    const retenciones20ClavesRetencionRaw = await import('@nodecfdi/sat-micro-catalogs/raw/ret_20_claves_retencion');
    const retenciones20PeriodicidadesRaw = await import('@nodecfdi/sat-micro-catalogs/raw/ret_20_periodicidades');
    const retenciones20PeriodosRaw = await import('@nodecfdi/sat-micro-catalogs/raw/ret_20_periodos');
    const retenciones20TiposPagoRaw = await import('@nodecfdi/sat-micro-catalogs/raw/ret_20_tipos_pago_retencion');

    return {
      cfdi40Impuestos: wrapCatalog(cfdi40ImpuestosRaw.default),
      cfdi40ObjetosImpuestos: wrapCatalog(cfdi40ObjetosImpuestosRaw.default),
      cfdi40UsosCfdi: wrapCatalog(cfdi40UsosCfdiRaw.default),
      cfdi40RegimenesFiscales: wrapCatalog(cfdi40RegimenesFiscalesRaw.default),
      cfdi40TiposRelaciones: wrapCatalog(cfdi40TiposRelacionesRaw.default),
      cfdi40Meses: wrapCatalog(cfdi40MesesRaw.default),
      cfdi40Periodicidades: wrapCatalog(cfdi40PeriodicidadesRaw.default),
      cfdi40Exportaciones: wrapCatalog(cfdi40ExportacionesRaw.default),
      cfdi40MetodosPago: wrapCatalog(cfdi40MetodosPagoRaw.default),
      cfdi40FormasPago: wrapCatalog(cfdi40FormasPagoRaw.default),
      cfdi40TiposComprobantes: wrapCatalog(cfdi40TiposComprobantesRaw.default),
      pagosTiposCadenaPago: wrapCatalog(pagosTiposCadenaPagoRaw.default),
      retenciones20ClavesRetencion: wrapCatalog(retenciones20ClavesRetencionRaw.default),
      retenciones20Periodicidades: wrapCatalog(retenciones20PeriodicidadesRaw.default),
      retenciones20Periodos: wrapCatalog(retenciones20PeriodosRaw.default),
      retenciones20TiposPago: wrapCatalog(retenciones20TiposPagoRaw.default),
    };
  }

  public layouts(): Record<string, CustomTableLayout> {
    const primaryColor = this._primaryColor;
    const defaultLayout: CustomTableLayout = {
      defaultBorder: false,
      hLineWidth(i, _node) {
        if (i === 1) {
          return 3;
        }

        return 2;
      },
      hLineColor(_i, _node) {
        return primaryColor;
      },
      paddingTop(_i) {
        return 2;
      },
      paddingBottom(_i) {
        return 2;
      },
      paddingLeft(_i) {
        return 2;
      },
      paddingRight(_i) {
        return 2;
      },
    };

    return {
      tableLayout: {
        ...defaultLayout,
      },
      conceptosLayout: {
        ...defaultLayout,
        hLineWidth(_i, _node) {
          return 1;
        },
        paddingBottom(_i) {
          return 1;
        },
      },
      stampLayout: {
        ...defaultLayout,
        hLineWidth(_i, _node) {
          return 1;
        },
        paddingTop(_i) {
          return 4;
        },
        paddingBottom(_i) {
          return 4;
        },
        paddingLeft(_i) {
          return 0;
        },
        paddingRight(_i) {
          return 0;
        },
      },
    };
  }
}
