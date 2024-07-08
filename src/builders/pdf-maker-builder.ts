import { type Style, type TDocumentDefinitions } from 'pdfmake/interfaces';
import { type DocumentTranslatorInterface } from '../templates/document-translator-interface.js';
import { type AbstractInvoiceData } from '../abstract-invoice-data.js';
import { getPdfMake, type PdfMakeNode } from '../pdfmake-builder.js';
import { StaticCatalogs } from '../catalogs/static-catalogs.js';
import { type CatalogsInterface } from '../catalogs/catalogs-interface.js';
import { type BuilderInterface } from './builder-interface.js';

export class PdfMakerBuilder<T extends AbstractInvoiceData> implements BuilderInterface<T> {
  private readonly _documentTranslator: DocumentTranslatorInterface<T>;

  private readonly _defaultStyle: Style;

  constructor(documentTranslator: DocumentTranslatorInterface<T>, defaultStyle?: Style) {
    this._documentTranslator = documentTranslator;
    if (!defaultStyle) {
      defaultStyle = {
        font: 'Roboto',
      };
    }

    this._defaultStyle = defaultStyle;
  }

  public async build(
    data: T,
    destination: string,
    catalogs: CatalogsInterface = new StaticCatalogs(),
  ): Promise<void> {
    const fs = await import('node:fs');

    return new Promise<void>((resolve, reject) => {
      const pdfTemplate = this.buildPdf(data, catalogs);
      const pdfStream = getPdfMake<PdfMakeNode>().createPdfKitDocument(pdfTemplate, {});
      const fileWriteStream = fs.createWriteStream(destination);
      fileWriteStream.on('error', (error: Error) => {
        fileWriteStream.end();
        reject(error);
      });

      pdfStream.pipe(fileWriteStream);
      pdfStream.on('end', () => {
        resolve();
      });
      pdfStream.on('error', (error) => {
        reject(error);
      });
      pdfStream.end();
    });
  }

  public async buildBase64(
    data: T,
    catalogs: CatalogsInterface = new StaticCatalogs(),
  ): Promise<string> {
    const buffer = await import('node:buffer');

    return new Promise<string>((resolve, reject) => {
      const pdfTemplate = this.buildPdf(data, catalogs);
      const pdfStream = getPdfMake<PdfMakeNode>().createPdfKitDocument(pdfTemplate, {});
      const chunks: Uint8Array[] = [];
      pdfStream.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk);
      });
      pdfStream.on('end', () => {
        resolve(buffer.Buffer.concat(chunks).toString('base64'));
      });
      pdfStream.on('error', (error) => {
        reject(error);
      });
      pdfStream.end();
    });
  }

  public buildPdf(data: T, catalogs: CatalogsInterface): TDocumentDefinitions {
    return this._documentTranslator.translate(data, this._defaultStyle, catalogs);
  }
}
