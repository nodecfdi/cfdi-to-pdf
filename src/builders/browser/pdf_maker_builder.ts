import pdfMake from 'pdfmake/build/pdfmake.js';
import { type BufferOptions, type Style, type TFontDictionary } from 'pdfmake/interfaces.js';
import type AbstractInvoiceData from '../../abstract_invoice_data.js';
import { type CatalogsData, type DocumentOptions, type DocumentTranslatorInterface } from '../../types.js';
import AbstractPdfMakerBuilder from '../abstract_pdf_maker_builder.js';

export default class PdfMakerBuilder<T extends AbstractInvoiceData> extends AbstractPdfMakerBuilder<T> {
  private readonly _overrideFonts?: TFontDictionary;

  private _overrideVFS?: Record<string, string>;

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
    this._catalogs = catalogs;
    this._overrideFonts = overrideFonts;
    this._overrideVFS = overrideVFS;
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
    const builderPdf = await this.buildPdf(data);

    return new Promise<string>((resolve, reject) => {
      try {
        builderPdf.getBuffer((pdfBuffer) => {
          resolve(pdfBuffer.toString('binary'));
        }, this._options);
      } catch (error) {
        reject(error as Error);
      }
    });
  }

  public async buildBase64(data: T): Promise<string> {
    const builderPdf = await this.buildPdf(data);

    return new Promise<string>((resolve, reject) => {
      try {
        builderPdf.getBase64((pdfBase64) => {
          resolve(pdfBase64);
        }, this._options);
      } catch (error) {
        reject(error as Error);
      }
    });
  }

  protected async buildPdf(data: T): Promise<pdfMake.TCreatedPdf> {
    const vfsFonts = await import('pdfmake/build/vfs_fonts.js');
    const vfs = 'default' in vfsFonts ? vfsFonts.default : vfsFonts;
    if (!this._overrideVFS) {
      this._overrideVFS = vfs as unknown as Record<string, string>;
    }

    const catalogs = this._catalogs ?? (await this.defaultCatalogs());

    const pdfTemplate = this._documentTranslator.translate(
      data,
      this._documentOptions,
      catalogs,
      this._primaryColor,
      this._bgGrayColor,
    );

    return pdfMake.createPdf(pdfTemplate, this.layouts(), this._overrideFonts, this._overrideVFS);
  }

  public defaultStyle(): Style {
    return {
      fontSize: 8,
    };
  }
}
