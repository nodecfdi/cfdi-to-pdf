import { BufferOptions, CustomTableLayout, TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import { PdfmakeNotFound } from './exceptions/pdfmake-not-found';

export interface PdfKitDocument extends NodeJS.ReadableStream {
    end(): void;
}

export interface TCreatedPdf {
    download(cb?: () => void, options?: BufferOptions): void;
    download(defaultFileName: string, cb?: () => void, options?: BufferOptions): void;
    getBlob(cb: (result: Blob) => void, options?: BufferOptions): void;
    getBase64(cb: (result: string) => void, options?: BufferOptions): void;
    getBuffer(cb: (result: Buffer) => void, options?: BufferOptions): void;
    getDataUrl(cb: (result: string) => void, options?: BufferOptions): void;
    getStream(options?: BufferOptions): PdfKitDocument; // minimal version 0.1.41
    open(options?: BufferOptions, win?: Window | null): void;
    print(options?: BufferOptions, win?: Window | null): void;
}

export interface PdfMakeBrowser {
    createPdf(
        documentDefinitions: TDocumentDefinitions,
        tableLayouts?: { [name: string]: CustomTableLayout },
        fonts?: TFontDictionary,
        vfs?: { [file: string]: string }
    ): TCreatedPdf;
}

export interface PdfMakeNode {
    createPdfKitDocument(docDefinition: TDocumentDefinitions, options?: BufferOptions): PdfKitDocument;
}

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
