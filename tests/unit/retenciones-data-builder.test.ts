import { XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { TestCase } from '../test-case';
import { RetencionesDataBuilder } from '../../src/retenciones-data-builder';

describe('RetencionesDataBuilder', () => {
    test('create tfd source string without timbre fiscal digital', async () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        const complemento = retenciones.searchNode('retenciones:Complemento');
        if (complemento) {
            complemento.children().removeAll();
        }

        let builder = new RetencionesDataBuilder();
        builder = builder.withXmlResolver(TestCase.createXmlResolver());

        const tfdGenerated = await builder.createTfdSourceString(retenciones);
        expect(tfdGenerated).toBe('');
    });

    test('create tfd source string with tfd11', async () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        let builder = new RetencionesDataBuilder();
        builder = builder.withXmlResolver(TestCase.createXmlResolver());

        const tfdGenerated = await builder.createTfdSourceString(retenciones);
        expect(tfdGenerated.startsWith('||1.0|F25F9852-6F4C-4782-9D47-3119EB3FAD3A|')).toBeTruthy();
    });

    test('create tfd source string with tfd10', async () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        const complemento = retenciones.searchNode('retenciones:Complemento');
        if (complemento) {
            const tfd = complemento.children().firstNodeWithName('tfd:TimbreFiscalDigital');
            tfd?.addAttributes({
                Version: null,
                version: '1.0',
            });
        }

        let builder = new RetencionesDataBuilder();
        builder = builder.withXmlResolver(TestCase.createXmlResolver());

        const tfdGenerated = await builder.createTfdSourceString(retenciones);
        expect(tfdGenerated.startsWith('||1.0|F25F9852-6F4C-4782-9D47-3119EB3FAD3A|')).toBeTruthy();
    });

    test('create qrl url', () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        const builder = new RetencionesDataBuilder();

        const expectedQr =
            'https://prodretencionverificacion.clouda.sat.gob.mx/' +
            '?re=EKU9003173C9&rr=AAA010101AAA&tt=0000008092.240000&id=F25F9852-6F4C-4782-9D47-3119EB3FAD3A';

        expect(builder.createQrUrl(retenciones)).toBe(expectedQr);
    });
});
