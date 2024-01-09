import { XmlNodeUtils, install } from '@nodecfdi/cfdiutils-common';
import { XMLSerializer, DOMParser, DOMImplementation } from '@xmldom/xmldom';
import { RetencionesData } from 'src/retenciones-data';
import { useTestCase } from '../test-case.js';

describe('RetencionesData', () => {
  const { fileContents } = useTestCase();

  beforeAll(() => {
    install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
  });

  test('construct using valid content', () => {
    const retenciones = XmlNodeUtils.nodeFromXmlString(fileContents('retenciones-valid.xml'));
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
    const retenciones = XmlNodeUtils.nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const retencionesData = new RetencionesData(retenciones, '', 'tfd');

    expect(retencionesData.qrUrl()).toBe(
      '?re=EKU9003173C9&rr=AAA010101AAA&tt=0000008092.240000&id=F25F9852-6F4C-4782-9D47-3119EB3FAD3A',
    );
  });

  test('construct without emisor', () => {
    const retenciones = XmlNodeUtils.nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const emisor = retenciones.searchNode('retenciones:Emisor');
    if (emisor) {
      retenciones.children().remove(emisor);
    }

    const t = (): RetencionesData => new RetencionesData(retenciones, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('La factura de retenciones no contiene nodo emisor');
  });

  test('construct without receptor', () => {
    const retenciones = XmlNodeUtils.nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const receptor = retenciones.searchNode('retenciones:Receptor');
    if (receptor) {
      retenciones.children().remove(receptor);
    }

    const t = (): RetencionesData => new RetencionesData(retenciones, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('La factura de retenciones no contiene nodo receptor');
  });

  test('construct without periodo', () => {
    const retenciones = XmlNodeUtils.nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const periodo = retenciones.searchNode('retenciones:Periodo');
    if (periodo) {
      retenciones.children().remove(periodo);
    }

    const t = (): RetencionesData => new RetencionesData(retenciones, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('La factura de retenciones no contiene nodo periodo');
  });

  test('construct without totales', () => {
    const retenciones = XmlNodeUtils.nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const totales = retenciones.searchNode('retenciones:Totales');
    if (totales) {
      retenciones.children().remove(totales);
    }

    const t = (): RetencionesData => new RetencionesData(retenciones, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('La factura de retenciones no contiene nodo totales');
  });

  test('construct without complemento', () => {
    const retenciones = XmlNodeUtils.nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const complemento = retenciones.searchNode('retenciones:Complemento');
    if (complemento) {
      complemento.children().removeAll();
    }

    const t = (): RetencionesData => new RetencionesData(retenciones, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('La factura de retenciones no contiene complemento de timbre fiscal digital');
  });
});
