import { nodeFromXmlString } from '@nodecfdi/cfdi-core';
import CfdiData from '../../src/cfdi_data.js';
import { fileContents } from '../test_utils.js';

describe('cfdi data', () => {
  test('construct using valid content', () => {
    const comprobante = nodeFromXmlString(fileContents('cfdi33-valid.xml'));
    const cfdiData = new CfdiData(comprobante, 'qr', 'tfd');

    expect(cfdiData.comprobante()).toBe(comprobante);
    expect(cfdiData.qrUrl()).toBe('qr');
    expect(cfdiData.tfdSourceString()).toBe('tfd');
    expect(cfdiData.emisor().getAttribute('Rfc')).toBe('AAA010101AAA');
    expect(cfdiData.receptor().getAttribute('Rfc')).toBe('COSC8001137NA');
    expect(cfdiData.timbreFiscalDigital().getAttribute('UUID')).toBe('9FB6ED1A-5F37-4FEF-980A-7F8C83B51894');
  });

  test('construct using empty qrUrl', () => {
    const comprobante = nodeFromXmlString(fileContents('cfdi33-valid.xml'));
    const cfdiData = new CfdiData(comprobante, '', 'tfd');

    expect(cfdiData.qrUrl()).toBe(
      'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=9FB6ED1A-5F37-4FEF-980A-7F8C83B51894&re=AAA010101AAA&rr=COSC8001137NA&tt=2382870.0&fe=osRJ2Q==',
    );
  });

  test('construct without emisor', () => {
    const comprobante = nodeFromXmlString(fileContents('cfdi33-valid.xml'));
    const emisor = comprobante.searchNode('cfdi:Emisor');
    if (emisor) {
      comprobante.children().delete(emisor);
    }

    const t = (): CfdiData => new CfdiData(comprobante, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('El CFDI no contiene nodo emisor');
  });

  test('construct without receptor', () => {
    const comprobante = nodeFromXmlString(fileContents('cfdi33-valid.xml'));
    const receptor = comprobante.searchNode('cfdi:Receptor');
    if (receptor) {
      comprobante.children().delete(receptor);
    }

    const t = (): CfdiData => new CfdiData(comprobante, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('El CFDI no contiene nodo receptor');
  });

  test('constuct without complemento', () => {
    const comprobante = nodeFromXmlString(fileContents('cfdi33-valid.xml'));
    const complemento = comprobante.searchNode('cfdi:Complemento');
    if (complemento) {
      complemento.children().clear();
    }

    const t = (): CfdiData => new CfdiData(comprobante, 'qr', 'tfd');

    expect(t).toThrow(Error);
    expect(t).toThrow('El CFDI no contiene complemento de timbre fiscal digital');
  });
});
