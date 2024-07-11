import {
  type BufferOptions,
  type Margins,
  type Style,
  type StyleDictionary,
} from 'pdfmake/interfaces.js';
import type AbstractInvoiceData from '../abstract_invoice_data.js';
import {
  type CatalogsData,
  type DocumentOptions,
  type DocumentTranslatorInterface,
} from '../types.js';

export default class AbstractPdfMakerBuilder<T extends AbstractInvoiceData> {
  protected declare _documentTranslator: DocumentTranslatorInterface<T>;

  protected declare _catalogs: CatalogsData;

  protected declare _documentOptions: DocumentOptions;

  protected declare _options?: BufferOptions;

  protected _primaryColor = '#359136';

  protected _defaultPageMargins: Margins = [25, 30, 25, 35];

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
      primary: {
        color: this._primaryColor,
      },
      tableHeader: {
        bold: true,
      },
    };
  }
}
