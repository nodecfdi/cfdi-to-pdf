import PdfPrinter from 'pdfmake';
import { TestCase } from '../test-case';
import { PdfmakeNotFound } from '~/exceptions/pdfmake-not-found';
import { getPdfMake, installPdfMake, PdfMakeNode } from '~/pdfmake-builder';

describe('Pdfmake-builder', () => {
    test('if not install pdfmake is undefined and throw error', () => {
        const t = (): void => {
            getPdfMake();
        };

        expect(t).toThrow(PdfmakeNotFound);
        expect(t).toThrow('No pdfmake was provided.');
    });

    test('on install retrieve instance requested', () => {
        installPdfMake(
            new PdfPrinter({
                Roboto: {
                    normal: TestCase.filePath('fonts/Roboto-Regular.ttf'),
                    bold: TestCase.filePath('fonts/Roboto-Medium.ttf'),
                    italics: TestCase.filePath('fonts/Roboto-Italic.ttf'),
                    bolditalics: TestCase.filePath('fonts/Roboto-MediumItalic.ttf')
                }
            })
        );

        const pdfMake = getPdfMake<PdfMakeNode>();

        expect(pdfMake).not.toBeUndefined();
        expect(pdfMake).toBeInstanceOf(PdfPrinter);
    });
});
