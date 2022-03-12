import { XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { TestCase } from '../test-case';
import {
    Converter,
    CfdiDataBuilder,
    GenericCfdiTranslator,
    GenericRetencionesTranslator,
    PdfMakerBuilder,
    RetencionesDataBuilder,
} from '../../src';
import { existsSync, unlinkSync } from 'fs';

describe('Converter', () => {
    test('converter to base64 cfdi', async () => {
        const cfdi = TestCase.fileContents('cfdi33-valid.xml');
        const cfdiData = await new CfdiDataBuilder()
            .withXmlResolver(TestCase.createXmlResolver())
            .buildFromString(cfdi);

        const builder = new PdfMakerBuilder(new GenericCfdiTranslator());
        const converter = new Converter(builder);

        const base64 = await converter.createPdfOnBase64(cfdiData);
        expect(typeof base64).toBe('string');
    }, 30000);

    test('convert to file cfdi', async () => {
        const cfdi = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('cfdi33-valid.xml'));
        const cfdiData = await new CfdiDataBuilder()
            .withXmlResolver(TestCase.createXmlResolver())
            .build(cfdi, TestCase.nodeCfdiLogo());

        const builder = new PdfMakerBuilder(new GenericCfdiTranslator());
        const converter = new Converter(builder);

        const created = TestCase.filePath('cfdi33-valid.pdf');
        await converter.createPdfOnPath(cfdiData, created);
        expect(existsSync(created)).toBeTruthy();
        unlinkSync(created);
    }, 30000);

    test('converter to base64 retenciones', async () => {
        const retenciones = TestCase.fileContents('retenciones-valid.xml');
        const retencionesData = await new RetencionesDataBuilder()
            .withXmlResolver(TestCase.createXmlResolver())
            .buildFromString(retenciones);

        const builder = new PdfMakerBuilder(new GenericRetencionesTranslator());
        const converter = new Converter(builder);

        const base64 = await converter.createPdfOnBase64(retencionesData);
        expect(typeof base64).toBe('string');
    }, 30000);

    test('convert to file retenciones', async () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        const retencionesData = await new RetencionesDataBuilder()
            .withXmlResolver(TestCase.createXmlResolver())
            .build(retenciones, TestCase.nodeCfdiLogo());

        const builder = new PdfMakerBuilder(new GenericRetencionesTranslator());
        const converter = new Converter(builder);

        const created = TestCase.filePath('retenciones-valid.pdf');
        await converter.createPdfOnPath(retencionesData, created);
        expect(existsSync(created)).toBeTruthy();
        unlinkSync(created);
    });
});
