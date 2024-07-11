import { nodeFromXmlString } from '@nodecfdi/cfdi-core';
import RetencionesData from '#src/retenciones_data';
import { fileContents } from '#tests/test_utils';

describe('retenciones data', () => {
  test('construct using valid content', () => {
    const retenciones = nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const retencionesData = new RetencionesData(retenciones, 'qr', 'tfd');

    expect(retencionesData.retenciones()).toBe(retenciones);
    expect(retencionesData.qrUrl()).toBe('qr');
    expect(retencionesData.tfdSourceString()).toBe('tfd');
    expect(retencionesData.emisor().getAttribute('RFCEmisor')).toBe('EKU9003173C9');
    expect(retencionesData.receptor().getAttribute('Nacionalidad')).toBe('Nacional');
    expect(retencionesData.periodo().getAttribute('MesIni')).toBe('08');
    expect(retencionesData.totales().getAttribute('montoTotOperacion')).toBe('8092.24');
    expect(retencionesData.timbreFiscalDigital().getAttribute('UUID')).toBe(
      'F25F9852-6F4C-4782-9D47-3119EB3FAD3A',
    );
  });

  test('construct using empty qrUrl', () => {
    const retenciones = nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const retencionesData = new RetencionesData(retenciones, '', 'tfd');

    expect(retencionesData.qrUrl()).toBe(
      '?re=EKU9003173C9&rr=AAA010101AAA&tt=0000008092.240000&id=F25F9852-6F4C-4782-9D47-3119EB3FAD3A',
    );
  });

  test('construct without emisor', () => {
    const retenciones = nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const emisor = retenciones.searchNode('retenciones:Emisor');
    if (emisor) {
      retenciones.children().delete(emisor);
    }

    const t = (): RetencionesData => new RetencionesData(retenciones, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('La factura de retenciones no contiene nodo emisor');
  });

  test('construct without receptor', () => {
    const retenciones = nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const receptor = retenciones.searchNode('retenciones:Receptor');
    if (receptor) {
      retenciones.children().delete(receptor);
    }

    const t = (): RetencionesData => new RetencionesData(retenciones, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('La factura de retenciones no contiene nodo receptor');
  });

  test('construct without periodo', () => {
    const retenciones = nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const periodo = retenciones.searchNode('retenciones:Periodo');
    if (periodo) {
      retenciones.children().delete(periodo);
    }

    const t = (): RetencionesData => new RetencionesData(retenciones, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('La factura de retenciones no contiene nodo periodo');
  });

  test('construct without totales', () => {
    const retenciones = nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const totales = retenciones.searchNode('retenciones:Totales');
    if (totales) {
      retenciones.children().delete(totales);
    }

    const t = (): RetencionesData => new RetencionesData(retenciones, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('La factura de retenciones no contiene nodo totales');
  });

  test('construct without complemento', () => {
    const retenciones = nodeFromXmlString(fileContents('retenciones-valid.xml'));
    const complemento = retenciones.searchNode('retenciones:Complemento');
    if (complemento) {
      complemento.children().clear();
    }

    const t = (): RetencionesData => new RetencionesData(retenciones, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('La factura de retenciones no contiene complemento de timbre fiscal digital');
  });
});
