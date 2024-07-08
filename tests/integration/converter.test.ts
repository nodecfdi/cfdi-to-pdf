import { existsSync, unlinkSync } from 'node:fs';
import { XmlNodeUtils, install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import PdfPrinter from 'pdfmake';
import {
  CfdiData,
  GenericCfdiTranslator,
  GenericRetencionesTranslator,
  PdfMakerBuilder,
  RetencionesData,
  installPdfMake,
} from 'src/index';
import { useTestCase } from '../test-case.js';

describe('Converter', () => {
  const { filePath, fileContents, nodeCfdiLogo } = useTestCase();

  beforeAll(() => {
    install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
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
  });

  test('converter to base64 cfdi', async () => {
    const cfdi = fileContents('cfdi33-valid.xml');
    const comprobante = XmlNodeUtils.nodeFromXmlString(cfdi);
    const cfdiData = new CfdiData(comprobante, null, null, nodeCfdiLogo());

    const builder = new PdfMakerBuilder(new GenericCfdiTranslator());
    const base64 = await builder.buildBase64(cfdiData);
    expect(typeof base64).toBe('string');
  }, 30_000);

  test('convert to file cfdi', async () => {
    const cfdi = XmlNodeUtils.nodeFromXmlString(fileContents('cfdi33-valid.xml'));
    const cfdiData = new CfdiData(cfdi, null, null, nodeCfdiLogo());

    const builder = new PdfMakerBuilder(new GenericCfdiTranslator());
    const created = filePath('cfdi33-valid.pdf');
    await builder.build(cfdiData, created);
    expect(existsSync(created)).toBeTruthy();
    unlinkSync(created);
  }, 30_000);

  test('converter to base64 retenciones', async () => {
    const retenciones = fileContents('retenciones-valid.xml');
    const comprobante = XmlNodeUtils.nodeFromXmlString(retenciones);
    const retencionesData = new RetencionesData(comprobante, null, null, nodeCfdiLogo());

    const builder = new PdfMakerBuilder(new GenericRetencionesTranslator());
    const base64 = await builder.buildBase64(retencionesData);
    expect(typeof base64).toBe('string');
  }, 30_000);

  test('convert to file retenciones', async () => {
    const retenciones = XmlNodeUtils.nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const retencionesData = new RetencionesData(retenciones, null, null, nodeCfdiLogo());

    const builder = new PdfMakerBuilder(new GenericRetencionesTranslator());
    const created = filePath('retenciones-valid.pdf');
    await builder.build(retencionesData, created);
    expect(existsSync(created)).toBeTruthy();
    unlinkSync(created);
  });

  test('convert thrown error on not write file', async () => {
    const cfdi = XmlNodeUtils.nodeFromXmlString(fileContents('cfdi33-valid.xml'));
    const cfdiData = new CfdiData(cfdi, null, null, nodeCfdiLogo());
    const builder = new PdfMakerBuilder(new GenericCfdiTranslator());

    await expect(builder.build(cfdiData, '/usr/bin/cfdi33.pdf')).rejects.toHaveProperty(
      'code',
      'EACCES',
    );
    expect(existsSync('/usr/bin/cfdi33.pdf')).toBeFalsy();
  }, 5000);

  test('convert thrown error on bad styles', async () => {
    const cfdi = XmlNodeUtils.nodeFromXmlString(fileContents('cfdi33-valid.xml'));
    const cfdiData = new CfdiData(cfdi, null, null, nodeCfdiLogo());

    const builder = new PdfMakerBuilder(new GenericCfdiTranslator(), { font: 'Calibri' });

    await expect(builder.build(cfdiData, 'retenciones-valid.pdf')).rejects.toEqual(
      new Error(
        "Font 'Calibri' in style 'normal' is not defined in the font section of the document definition.",
      ),
    );
    expect(existsSync('retenciones-valid.pdf')).toBeFalsy();
  }, 5000);
});
