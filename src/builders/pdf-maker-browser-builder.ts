/* istanbul ignore file */
import { type Style, type TDocumentDefinitions } from 'pdfmake/interfaces';
import { type DocumentTranslatorInterface } from '../templates/document-translator-interface.js';
import { type AbstractInvoiceData } from '../abstract-invoice-data.js';
import { getPdfMake, type PdfMakeBrowser } from '../pdfmake-builder.js';
import { StaticCatalogs } from '../catalogs/static-catalogs.js';
import { type CatalogsInterface } from '../catalogs/catalogs-interface.js';
import { type BuilderInterface } from './builder-interface.js';

export class PdfMakerBrowserBuilder<T extends AbstractInvoiceData> implements BuilderInterface<T> {
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
    _data: T,
    _destination: string,
    _catalogs: CatalogsInterface = new StaticCatalogs(),
  ): Promise<void> {
    console.warn('This method not permitted on browser');

    throw new Error('Method not work on browser');
  }

  public async buildBase64(
    data: T,
    catalogs: CatalogsInterface = new StaticCatalogs(),
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        const pdfTemplate = this.buildPdf(data, catalogs);
        const pfdDocGenerator = getPdfMake<PdfMakeBrowser>().createPdf(pdfTemplate);
        pfdDocGenerator.getBase64((pdfBase64) => {
          resolve(pdfBase64);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public buildPdf(data: T, catalogs: CatalogsInterface): TDocumentDefinitions {
    return this._documentTranslator.translate(data, this._defaultStyle, catalogs);
  }
}
