import { XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { TestCase } from '../test-case';
import {
    CfdiData,
    GenericCfdiTranslator,
    GenericRetencionesTranslator,
    PdfMakerBuilder,
    RetencionesData,
} from '../../src';
import { existsSync, unlinkSync } from 'fs';

describe('Converter', () => {
    test('converter to base64 cfdi', async () => {
        const cfdi = TestCase.fileContents('cfdi33-valid.xml');
        const comprobante = XmlNodeUtils.nodeFromXmlString(cfdi);
        const cfdiData = new CfdiData(comprobante, 'urlCode', 'cadenaOrigen', TestCase.nodeCfdiLogo());

        const builder = new PdfMakerBuilder(new GenericCfdiTranslator());
        const base64 = await builder.buildBase64(cfdiData);
        expect(typeof base64).toBe('string');
    }, 30000);

    test('convert to file cfdi', async () => {
        const cfdi = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('cfdi33-valid.xml'));
        const cfdiData = new CfdiData(cfdi, 'urlCode', 'cadenaOrigen', TestCase.nodeCfdiLogo());

        const builder = new PdfMakerBuilder(new GenericCfdiTranslator());
        const created = TestCase.filePath('cfdi33-valid.pdf');
        await builder.build(cfdiData, created);
        expect(existsSync(created)).toBeTruthy();
        unlinkSync(created);
    }, 30000);

    test('converter to base64 retenciones', async () => {
        const retenciones = TestCase.fileContents('retenciones-valid.xml');
        const comprobante = XmlNodeUtils.nodeFromXmlString(retenciones);
        const retencionesData = new RetencionesData(comprobante, 'urlCode', 'cadenaOrigen', TestCase.nodeCfdiLogo());

        const builder = new PdfMakerBuilder(new GenericRetencionesTranslator());
        const base64 = await builder.buildBase64(retencionesData);
        expect(typeof base64).toBe('string');
    }, 30000);

    test('convert to file retenciones', async () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        const retencionesData = new RetencionesData(retenciones, 'urlCode', 'cadenaOrigen', TestCase.nodeCfdiLogo());

        const builder = new PdfMakerBuilder(new GenericRetencionesTranslator());
        const created = TestCase.filePath('retenciones-valid.pdf');
        await builder.build(retencionesData, created);
        expect(existsSync(created)).toBeTruthy();
        unlinkSync(created);
    });
});
