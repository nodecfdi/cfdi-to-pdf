import { TestCase } from '../test-case';
import { XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { CfdiData } from '../../src';

describe('CfdiData', () => {
    test('construct using valid content', () => {
        const comprobante = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('cfdi33-valid.xml'));
        const cfdiData = new CfdiData(comprobante, 'qr', 'tfd');

        expect(cfdiData.comprobante()).toBe(comprobante);
        expect(cfdiData.qrUrl()).toBe('qr');
        expect(cfdiData.tfdSourceString()).toBe('tfd');
        expect(cfdiData.emisor().get('Rfc')).toBe('AAA010101AAA');
        expect(cfdiData.receptor().get('Rfc')).toBe('COSC8001137NA');
        expect(cfdiData.timbreFiscalDigital().get('UUID')).toBe('9FB6ED1A-5F37-4FEF-980A-7F8C83B51894');
    });

    test('construct without emisor', () => {
        const comprobante = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('cfdi33-valid.xml'));
        const emisor = comprobante.searchNode('cfdi:Emisor');
        if (emisor) {
            comprobante.children().remove(emisor);
        }

        expect.hasAssertions();
        try {
            new CfdiData(comprobante, 'qr', 'tfd');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain('El CFDI no contiene nodo emisor');
        }
    });

    test('construct without receptor', () => {
        const comprobante = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('cfdi33-valid.xml'));
        const receptor = comprobante.searchNode('cfdi:Receptor');
        if (receptor) {
            comprobante.children().remove(receptor);
        }

        expect.hasAssertions();
        try {
            new CfdiData(comprobante, 'qr', 'tfd');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain('El CFDI no contiene nodo receptor');
        }
    });

    test('constuct without complemento', () => {
        const comprobante = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('cfdi33-valid.xml'));
        const complemento = comprobante.searchNode('cfdi:Complemento');
        if (complemento) {
            complemento.children().removeAll();
        }

        expect.hasAssertions();
        try {
            new CfdiData(comprobante, 'qr', 'tfd');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain('El CFDI no contiene complemento de timbre fiscal digital');
        }
    });
});
