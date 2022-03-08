import { XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { TestCase } from '../test-case';
import { CfdiDataBuilder, PdfMakerBuilder } from '../../src';
import { Converter } from '../../src';
import { existsSync, unlinkSync } from 'fs';

describe('Converter', () => {
    test('converter to base64', async () => {
        const cfdi = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('cfdi33-valid.xml'));
        const cfdiData = await new CfdiDataBuilder().withXmlResolver(TestCase.createXmlResolver()).build(cfdi);

        const builder = new PdfMakerBuilder();
        const converter = new Converter(builder);

        const base64 = await converter.createPdfOnBase64(cfdiData);
        expect(typeof base64).toBe('string');
    }, 30000);

    test('convert to file', async () => {
        const cfdi = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('cfdi33-valid.xml'));
        const cfdiData = await new CfdiDataBuilder().withXmlResolver(TestCase.createXmlResolver()).build(cfdi);

        const builder = new PdfMakerBuilder();
        const converter = new Converter(builder);

        const created = TestCase.filePath('cfdi33-valid.pdf');
        await converter.createPdfOnPath(cfdiData, created);
        expect(existsSync(created)).toBeTruthy();
        unlinkSync(created);
    }, 30000);
});
