import { existsSync, unlinkSync } from 'node:fs';
import { nodeFromXmlString } from '@nodecfdi/cfdi-core';
import { PdfMakerBuilder } from '#src/builders/node/pdf_maker_builder';
import CfdiData from '#src/cfdi_data';
import RetencionesData from '#src/retenciones_data';
import GenericCfdiTranslator from '#src/templates/generic_cfdi_translator';
import GenericRetencionesTranslator from '#src/templates/generic_retenciones_translator';
import { fileContents, filePath, nodeCfdiLogo } from '../test_utils.js';

describe('converter', () => {
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
    const created = filePath('cfdi33_valid.pdf');
    await builder.build(cfdiData, created);
    expect(existsSync(created)).toBeTruthy();
    unlinkSync(created);
  }, 30000);

  test('converter to base64 retenciones', async () => {
    const retenciones = fileContents('retenciones-valid.xml');
    const comprobante = nodeFromXmlString(retenciones);
    const retencionesData = new RetencionesData(comprobante, null, null, nodeCfdiLogo());

    const builder = new PdfMakerBuilder(new GenericRetencionesTranslator());
    const base64 = await builder.buildBase64(retencionesData);
    expect(typeof base64).toBe('string');
  }, 30000);

  test('convert to file retenciones', async () => {
    const retenciones = nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const retencionesData = new RetencionesData(retenciones, null, null, nodeCfdiLogo());

    const builder = new PdfMakerBuilder(new GenericRetencionesTranslator());
    const created = filePath('retenciones-valid.pdf');
    await builder.build(retencionesData, created);
    expect(existsSync(created)).toBeTruthy();
    unlinkSync(created);
  });

  test('convert thrown error on not write file', async () => {
    const cfdi = nodeFromXmlString(fileContents('cfdi33-valid.xml'));
    const cfdiData = new CfdiData(cfdi, null, null, nodeCfdiLogo());
    const builder = new PdfMakerBuilder(new GenericCfdiTranslator());

    await expect(builder.build(cfdiData, '/usr/bin/cfdi33.pdf')).rejects.toHaveProperty(
      'code',
      'EACCES',
    );
    expect(existsSync('/usr/bin/cfdi33.pdf')).toBeFalsy();
  }, 30000);

  test('convert thrown error on bad styles', async () => {
    const cfdi = nodeFromXmlString(fileContents('cfdi33-valid.xml'));
    const cfdiData = new CfdiData(cfdi, null, null, nodeCfdiLogo());
    const builder = new PdfMakerBuilder(new GenericCfdiTranslator(), {
      defaultStyle: { font: 'Calibri' },
    });
    await expect(builder.build(cfdiData, 'retenciones-valid.pdf')).rejects.toStrictEqual(
      new Error(
        "Font 'Calibri' in style 'bold' is not defined in the font section of the document definition.",
      ),
    );
    expect(existsSync('retenciones-valid.pdf')).toBeFalsy();
  }, 30000);
});
