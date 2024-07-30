import {
  type BufferOptions,
  type CustomTableLayout,
  type Margins,
  type Style,
  type StyleDictionary,
} from 'pdfmake/interfaces.js';
import type AbstractInvoiceData from '#src/abstract_invoice_data';
import {
  type CatalogsData,
  type DocumentOptions,
  type DocumentTranslatorInterface,
} from '#src/types';

export default class AbstractPdfMakerBuilder<T extends AbstractInvoiceData> {
  protected declare _documentTranslator: DocumentTranslatorInterface<T>;

  protected declare _catalogs: CatalogsData;

  protected declare _documentOptions: DocumentOptions;

  protected declare _options?: BufferOptions;

  protected _primaryColor = '#359136';

  protected _defaultPageMargins: Margins = [20, 30, 20, 30];

  public setPrimaryColor(color: string): void {
    this._primaryColor = color;
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
      tableSat: {
        fontSize: 5,
      },
      tableSatSub: {
        bold: true,
        color: this._primaryColor,
      },
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
    };
  }
}
