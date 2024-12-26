import { createWriteStream } from 'node:fs';
import { buffer } from 'node:stream/consumers';
import PdfPrinter from 'pdfmake';
import { type BufferOptions, type TFontDictionary } from 'pdfmake/interfaces.js';
import type AbstractInvoiceData from '../../abstract_invoice_data.js';
import { type CatalogsData, type DocumentOptions, type DocumentTranslatorInterface } from '../../types.js';
import AbstractPdfMakerBuilder from '../abstract_pdf_maker_builder.js';

export default class PdfMakerBuilder<T extends AbstractInvoiceData> extends AbstractPdfMakerBuilder<T> {
  private readonly _pdfPrinter: PdfPrinter;

  public constructor(
    documentTranslator: DocumentTranslatorInterface<T>,
    documentOptions?: DocumentOptions,
    catalogs?: CatalogsData,
    overrideFontDictionary?: TFontDictionary,
    options?: BufferOptions,
  ) {
    super();
    this._documentTranslator = documentTranslator;
    this._catalogs = catalogs;
    const fonts = overrideFontDictionary ?? this.defaultFontDictionary();
    this._pdfPrinter = new PdfPrinter(fonts);
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
    const pdfDoc = await this.buildPdf(data);
    pdfDoc.end();
    const pdfBuffer = await buffer(pdfDoc);

    return pdfBuffer.toString('binary');
  }

  public async buildBase64(data: T): Promise<string> {
    const pdfDoc = await this.buildPdf(data);
    pdfDoc.end();
    const pdfBuffer = await buffer(pdfDoc);

    return pdfBuffer.toString('base64');
  }

  public async build(data: T, destination: string): Promise<void> {
    const pdfDoc = await this.buildPdf(data);

    return new Promise<void>((resolve, reject) => {
      const fileWriteStream = createWriteStream(destination);
      fileWriteStream.on('error', (error: Error) => {
        fileWriteStream.end();
        reject(error);
      });

      pdfDoc.pipe(fileWriteStream);
      pdfDoc.on('end', () => {
        resolve();
      });
      pdfDoc.on('error', (error) => {
        reject(error as Error);
      });

      pdfDoc.end();
    });
  }

  public async buildStream(data: T): Promise<NodeJS.ReadableStream> {
    return await this.buildPdf(data);
  }

  protected async buildPdf(data: T): Promise<PDFKit.PDFDocument> {
    const catalogs = this._catalogs ?? (await this.defaultCatalogs());

    const pdfTemplate = this._documentTranslator.translate(
      data,
      this._documentOptions,
      catalogs,
      this._primaryColor,
      this._bgGrayColor,
    );

    return this._pdfPrinter.createPdfKitDocument(pdfTemplate, {
      ...this._options,
      tableLayouts: this.layouts(),
    });
  }

  public defaultFontDictionary(): TFontDictionary {
    return {
      Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique',
      },
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
      Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic',
      },
      Symbol: {
        normal: 'Symbol',
      },
      ZapfDingbats: {
        normal: 'ZapfDingbats',
      },
    };
  }
}
