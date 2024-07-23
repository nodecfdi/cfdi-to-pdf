import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { type BufferOptions, type Style, type TFontDictionary } from 'pdfmake/interfaces.js';
import type AbstractInvoiceData from '../../abstract_invoice_data.js';
import { catalogsSource } from '../../catalogs/catalogs_source.js';
import {
  type CatalogsData,
  type DocumentOptions,
  type DocumentTranslatorInterface,
} from '../../types.js';
import AbstractPdfMakerBuilder from '../abstract_pdf_maker_builder.js';

export class PdfMakerBuilder<T extends AbstractInvoiceData> extends AbstractPdfMakerBuilder<T> {
  private readonly _overrideFonts?: TFontDictionary;

  private readonly _overrideVFS: Record<string, string>;

  public constructor(
    documentTranslator: DocumentTranslatorInterface<T>,
    documentOptions?: DocumentOptions,
    catalogs?: CatalogsData,
    overrideFonts?: TFontDictionary,
    overrideVFS?: Record<string, string>,
    options?: BufferOptions,
  ) {
    super();
    this._documentTranslator = documentTranslator;
    this._catalogs = catalogs ?? catalogsSource;
    this._overrideFonts = overrideFonts;
    this._overrideVFS = overrideVFS ?? pdfFonts.pdfMake.vfs;
    this._documentOptions = {
      ...documentOptions,
      defaultStyle: {
        ...this.defaultStyle(),
        ...documentOptions?.defaultStyle,
      },
      styles: {
        ...this.defaultDictionaryStyles(),
        ...documentOptions?.styles,
      },
      pageMargins: documentOptions?.pageMargins ?? this._defaultPageMargins,
    };
    this._options = options;
  }

  public async buildRaw(data: T): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const pdfDoc = this.buildPdf(data);
      try {
        pdfDoc.getBuffer((pdfBuffer) => {
          resolve(pdfBuffer.toString('binary'));
        }, this._options);
      } catch (error) {
        reject(error as Error);
      }
    });
  }

  public async buildBase64(data: T): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        this.buildPdf(data).getBase64((pdfBase64) => {
          resolve(pdfBase64);
        }, this._options);
      } catch (error) {
        reject(error as Error);
      }
    });
  }

  protected buildPdf(data: T): pdfMake.TCreatedPdf {
    const pdfTemplate = this._documentTranslator.translate(
      data,
      this._documentOptions,
      this._catalogs,
      this._primaryColor,
    );

    return pdfMake.createPdf(pdfTemplate, undefined, this._overrideFonts, this._overrideVFS);
  }

  public defaultStyle(): Style {
    return {
      fontSize: 8,
    };
  }
}