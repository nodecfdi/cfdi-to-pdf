import { XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { TestCase } from '../test-case';
import { RetencionesData } from '../../src';

describe('RetencionesData', () => {
    test('construct using valid content', () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        const retencionesData = new RetencionesData(retenciones, 'qr', 'tfd');

        expect(retencionesData.retenciones()).toBe(retenciones);
        expect(retencionesData.qrUrl()).toBe('qr');
        expect(retencionesData.tfdSourceString()).toBe('tfd');
        expect(retencionesData.emisor().get('RFCEmisor')).toBe('EKU9003173C9');
        expect(retencionesData.receptor().get('Nacionalidad')).toBe('Nacional');
        expect(retencionesData.periodo().get('MesIni')).toBe('08');
        expect(retencionesData.totales().get('montoTotOperacion')).toBe('8092.24');
        expect(retencionesData.timbreFiscalDigital().get('UUID')).toBe('F25F9852-6F4C-4782-9D47-3119EB3FAD3A');
    });

    test('construct using empty qrUrl', () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        const retencionesData = new RetencionesData(retenciones, '', 'tfd');

        expect(retencionesData.qrUrl()).toBe(
            'https://prodretencionverificacion.clouda.sat.gob.mx/?re=EKU9003173C9&rr=AAA010101AAA&tt=0000008092.240000&id=F25F9852-6F4C-4782-9D47-3119EB3FAD3A'
        );
    });

    test('construct without emisor', () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        const emisor = retenciones.searchNode('retenciones:Emisor');
        if (emisor) {
            retenciones.children().remove(emisor);
        }

        expect.hasAssertions();
        try {
            new RetencionesData(retenciones, 'qr', 'tfd');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain('La factura de retenciones no contiene nodo emisor');
        }
    });

    test('construct without receptor', () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        const receptor = retenciones.searchNode('retenciones:Receptor');
        if (receptor) {
            retenciones.children().remove(receptor);
        }

        expect.hasAssertions();
        try {
            new RetencionesData(retenciones, 'qr', 'tfd');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain('La factura de retenciones no contiene nodo receptor');
        }
    });

    test('construct without periodo', () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        const periodo = retenciones.searchNode('retenciones:Periodo');
        if (periodo) {
            retenciones.children().remove(periodo);
        }

        expect.hasAssertions();
        try {
            new RetencionesData(retenciones, 'qr', 'tfd');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain('La factura de retenciones no contiene nodo periodo');
        }
    });

    test('construct without totales', () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        const totales = retenciones.searchNode('retenciones:Totales');
        if (totales) {
            retenciones.children().remove(totales);
        }

        expect.hasAssertions();
        try {
            new RetencionesData(retenciones, 'qr', 'tfd');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain('La factura de retenciones no contiene nodo totales');
        }
    });

    test('construct without complemento', () => {
        const retenciones = XmlNodeUtils.nodeFromXmlString(TestCase.fileContents('retenciones-valid.xml'));
        const complemento = retenciones.searchNode('retenciones:Complemento');
        if (complemento) {
            complemento.children().removeAll();
        }

        expect.hasAssertions();
        try {
            new RetencionesData(retenciones, 'qr', 'tfd');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain(
                'La factura de retenciones no contiene complemento de timbre fiscal digital'
            );
        }
    });
});
