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
    const { default: cfdi40ExportacionesRaw } = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_exportaciones', {
      assert: { type: 'json' },
    });
    const { default: cfdi40FormasPagoRaw } = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_formas_pago', {
      assert: { type: 'json' },
    });
    const { default: cfdi40ImpuestosRaw } = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_impuestos', {
      assert: { type: 'json' },
    });
    const { default: cfdi40MesesRaw } = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_meses', {
      assert: { type: 'json' },
    });
    const { default: cfdi40MetodosPagoRaw } = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_metodos_pago', {
      assert: { type: 'json' },
    });
    const { default: cfdi40ObjetosImpuestosRaw } = await import(
      '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_objetos_impuestos',
      {
        assert: { type: 'json' },
      }
    );
    const { default: cfdi40PeriodicidadesRaw } = await import(
      '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_periodicidades',
      {
        assert: { type: 'json' },
      }
    );
    const { default: cfdi40RegimenesFiscalesRaw } = await import(
      '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_regimenes_fiscales',
      {
        assert: { type: 'json' },
      }
    );
    const { default: cfdi40TiposComprobantesRaw } = await import(
      '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_tipos_comprobantes',
      {
        assert: { type: 'json' },
      }
    );
    const { default: cfdi40TiposRelacionesRaw } = await import(
      '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_tipos_relaciones',
      {
        assert: { type: 'json' },
      }
    );
    const { default: cfdi40UsosCfdiRaw } = await import('@nodecfdi/sat-micro-catalogs/raw/cfdi_40_usos_cfdi', {
      assert: { type: 'json' },
    });
    const { default: pagosTiposCadenaPagoRaw } = await import(
      '@nodecfdi/sat-micro-catalogs/raw/pagos_tipos_cadena_pago',
      {
        assert: { type: 'json' },
      }
    );
    const { default: retenciones20ClavesRetencionRaw } = await import(
      '@nodecfdi/sat-micro-catalogs/raw/ret_20_claves_retencion',
      {
        assert: { type: 'json' },
      }
    );
    const { default: retenciones20PeriodicidadesRaw } = await import(
      '@nodecfdi/sat-micro-catalogs/raw/ret_20_periodicidades',
      {
        assert: { type: 'json' },
      }
    );
    const { default: retenciones20PeriodosRaw } = await import('@nodecfdi/sat-micro-catalogs/raw/ret_20_periodos', {
      assert: { type: 'json' },
    });
    const { default: retenciones20TiposPagoRaw } = await import(
      '@nodecfdi/sat-micro-catalogs/raw/ret_20_tipos_pago_retencion',
      {
        assert: { type: 'json' },
      }
    );

    return {
      cfdi40Impuestos: wrapCatalog(cfdi40ImpuestosRaw),
      cfdi40ObjetosImpuestos: wrapCatalog(cfdi40ObjetosImpuestosRaw),
      cfdi40UsosCfdi: wrapCatalog(cfdi40UsosCfdiRaw),
      cfdi40RegimenesFiscales: wrapCatalog(cfdi40RegimenesFiscalesRaw),
      cfdi40TiposRelaciones: wrapCatalog(cfdi40TiposRelacionesRaw),
      cfdi40Meses: wrapCatalog(cfdi40MesesRaw),
      cfdi40Periodicidades: wrapCatalog(cfdi40PeriodicidadesRaw),
      cfdi40Exportaciones: wrapCatalog(cfdi40ExportacionesRaw),
      cfdi40MetodosPago: wrapCatalog(cfdi40MetodosPagoRaw),
      cfdi40FormasPago: wrapCatalog(cfdi40FormasPagoRaw),
      cfdi40TiposComprobantes: wrapCatalog(cfdi40TiposComprobantesRaw),
      pagosTiposCadenaPago: wrapCatalog(pagosTiposCadenaPagoRaw),
      retenciones20ClavesRetencion: wrapCatalog(retenciones20ClavesRetencionRaw),
      retenciones20Periodicidades: wrapCatalog(retenciones20PeriodicidadesRaw),
      retenciones20Periodos: wrapCatalog(retenciones20PeriodosRaw),
      retenciones20TiposPago: wrapCatalog(retenciones20TiposPagoRaw),
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
