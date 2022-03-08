import { CfdiDataBuilder } from '../../src';
import { XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { TestCase } from '../test-case';

describe('CfdiDataBuilder', () => {
    test('create tfd source string without timbre fiscal digital', async () => {
        const comprobante = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('cfdi33-valid.xml'));
        const complemento = comprobante.searchNode('cfdi:Complemento');
        if (complemento) {
            complemento.children().removeAll();
        }

        let builder = new CfdiDataBuilder();
        builder = builder.withXmlResolver(TestCase.createXmlResolver());

        const tfdGenerated = await builder.createTfdSourceString(comprobante);
        expect(tfdGenerated).toBe('');
    });

    test('create tfd source string with tfd11', async () => {
        const comprobante = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('cfdi33-valid.xml'));
        let builder = new CfdiDataBuilder();
        builder = builder.withXmlResolver(TestCase.createXmlResolver());

        const tfdGenerated = await builder.createTfdSourceString(comprobante);
        expect(tfdGenerated.startsWith('||1.1|9FB6ED1A-5F37-4FEF-980A-7F8C83B51894|')).toBeTruthy();
    });

    test('create tfd source string with tfd10', async () => {
        const comprobante = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('cfdi33-valid.xml'));
        const complemento = comprobante.searchNode('cfdi:Complemento');
        if (complemento) {
            const tfd = complemento.children().firstNodeWithName('tfd:TimbreFiscalDigital');
            tfd?.addAttributes({
                Version: null,
                version: '1.0',
            });
        }

        let builder = new CfdiDataBuilder();
        builder = builder.withXmlResolver(TestCase.createXmlResolver());

        const tfdGenerated = await builder.createTfdSourceString(comprobante);
        expect(tfdGenerated.startsWith('||1.0|9FB6ED1A-5F37-4FEF-980A-7F8C83B51894|')).toBeTruthy();
    });

    test('create qr url', () => {
        const comprobante = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('cfdi33-valid.xml'));
        const builder = new CfdiDataBuilder();
        const expectedQr =
            'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx' +
            '?id=9FB6ED1A-5F37-4FEF-980A-7F8C83B51894&re=AAA010101AAA&rr=COSC8001137NA&tt=2382870.0&fe=osRJ2Q==';

        expect(builder.createQrUrl(comprobante)).toBe(expectedQr);
    });
});
