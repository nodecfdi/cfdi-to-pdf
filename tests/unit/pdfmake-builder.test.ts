import PdfPrinter from 'pdfmake';
import { PdfmakeNotFound } from 'src/exceptions/pdfmake-not-found';
import { getPdfMake, installPdfMake, type PdfMakeNode } from 'src/pdfmake-builder';
import { useTestCase } from '../test-case.js';

describe('Pdfmake-builder', () => {
  const { filePath } = useTestCase();

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
          normal: filePath('fonts/Roboto-Regular.ttf'),
          bold: filePath('fonts/Roboto-Medium.ttf'),
          italics: filePath('fonts/Roboto-Italic.ttf'),
          bolditalics: filePath('fonts/Roboto-MediumItalic.ttf'),
        },
      }),
    );

    const pdfMake = getPdfMake<PdfMakeNode>();

    expect(pdfMake).not.toBeUndefined();
    expect(pdfMake).toBeInstanceOf(PdfPrinter);
  });
});
