import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { nodeFromXmlString } from '@nodecfdi/cfdi-core';
import { PdfMakerBuilder } from '#src/builders/browser/pdf_maker_builder';
import CfdiData from '#src/cfdi_data';
import RetencionesData from '#src/retenciones_data';
import GenericCfdiTranslator from '#src/templates/generic_cfdi_translator';
import GenericRetencionesTranslator from '#src/templates/generic_retenciones_translator';
import { fileContents, filePath, nodeCfdiLogo } from '#tests/test_utils';

describe('converter browser version', () => {
  test('converter to base64 cfdi', async () => {
    const cfdi = fileContents('cfdi33-valid.xml');
    const comprobante = nodeFromXmlString(cfdi);
    const cfdiData = new CfdiData(comprobante, null, null, nodeCfdiLogo());

    const builder = new PdfMakerBuilder(new GenericCfdiTranslator());
    const base64 = await builder.buildBase64(cfdiData);
    expect(typeof base64).toBe('string');
  }, 30000);

  test('convert to file cfdi', async () => {
    const cfdi = nodeFromXmlString(fileContents('cfdi33-valid.xml'));
    const cfdiData = new CfdiData(cfdi, null, null, nodeCfdiLogo());

    const builder = new PdfMakerBuilder(new GenericCfdiTranslator());
    const targetPath = filePath('cfdi33_valid_browser.pdf');
    const contentBase64 = await builder.buildBase64(cfdiData);
    writeFileSync(targetPath, contentBase64, 'base64');

    expect(existsSync(targetPath)).toBeTruthy();
    unlinkSync(targetPath);
  }, 30000);

  test('converter to base64 retenciones', async () => {
    const retenciones = fileContents('retenciones-valid.xml');
    const comprobante = nodeFromXmlString(retenciones);
    const retencionesData = new RetencionesData(comprobante, null, null, nodeCfdiLogo());

    const builder = new PdfMakerBuilder(new GenericRetencionesTranslator());
    const base64 = await builder.buildBase64(retencionesData);
    expect(typeof base64).toBe('string');
  }, 30000);

  // Actually pdfmake have a bug with reject promise check https://github.com/bpampuch/pdfmake/issues/2066#issue-696306408
  // eslint-disable-next-line vitest/no-disabled-tests
  test.skip('convert thrown error on bad styles', async () => {
    const cfdi = nodeFromXmlString(fileContents('cfdi33-valid.xml'));
    const cfdiData = new CfdiData(cfdi, null, null, nodeCfdiLogo());
    const builder = new PdfMakerBuilder(new GenericCfdiTranslator(), {
      defaultStyle: { font: 'Calibri' },
    });
    await expect(builder.buildBase64(cfdiData)).rejects.toStrictEqual(
      new Error(
        "Font 'Calibri' in style 'bold' is not defined in the font section of the document definition.",
      ),
    );
  }, 30000);
});
