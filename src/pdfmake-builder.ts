import {
  type BufferOptions,
  type CustomTableLayout,
  type TDocumentDefinitions,
  type TFontDictionary,
} from 'pdfmake/interfaces';
import { PdfmakeNotFound } from './exceptions/pdfmake-not-found.js';

export type PdfKitDocument = {
  end(): void;
} & NodeJS.ReadableStream;

export type TCreatedPdf = {
  download(cb?: () => void, options?: BufferOptions): void;
  download(defaultFileName: string, cb?: () => void, options?: BufferOptions): void;
  getBlob(cb: (result: Blob) => void, options?: BufferOptions): void;
  getBase64(cb: (result: string) => void, options?: BufferOptions): void;
  getBuffer(cb: (result: Uint8Array) => void, options?: BufferOptions): void;
  getDataUrl(cb: (result: string) => void, options?: BufferOptions): void;
  getStream(options?: BufferOptions): PdfKitDocument;
  open(options?: BufferOptions, win?: Window | null): void;
  print(options?: BufferOptions, win?: Window | null): void;
};

export type PdfMakeBrowser = {
  createPdf(
    documentDefinitions: TDocumentDefinitions,
    tableLayouts?: Record<string, CustomTableLayout>,
    fonts?: TFontDictionary,
    vfs?: Record<string, string>,
  ): TCreatedPdf;
};

export type PdfMakeNode = {
  createPdfKitDocument(
    docDefinition: TDocumentDefinitions,
    options?: BufferOptions,
  ): PdfKitDocument;
};

let _pdfmake: PdfMakeBrowser | PdfMakeNode | undefined;

const getPdfMake = <T extends PdfMakeBrowser | PdfMakeNode>(): T => {
  if (!_pdfmake) {
    throw new PdfmakeNotFound('No pdfmake was provided.');
  }

  return _pdfmake as T;
};

const installPdfMake = (pdfMake: PdfMakeBrowser | PdfMakeNode): void => {
  _pdfmake = pdfMake;
};

export { getPdfMake, installPdfMake };
