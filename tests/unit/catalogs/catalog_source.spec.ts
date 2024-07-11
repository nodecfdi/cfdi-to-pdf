import { getKeyValueOfCatalog, getValueOfCatalog } from '#src/catalogs/catalogs_source';

describe('catalog source', () => {
  test('get key value using valid data', () => {
    expect(getKeyValueOfCatalog('cfdi40TiposComprobantes', 'I')).toBe('I - Ingreso');
    expect(getKeyValueOfCatalog('cfdi40FormasPago', '01')).toBe('01 - Efectivo');
    expect(getKeyValueOfCatalog('cfdi40MetodosPago', 'PUE')).toBe(
      'PUE - Pago en una sola exhibición',
    );
    expect(getKeyValueOfCatalog('cfdi40Exportaciones', '01')).toBe('01 - No aplica');
    expect(getKeyValueOfCatalog('cfdi40RegimenesFiscales', '601')).toBe(
      '601 - General de Ley Personas Morales',
    );
    expect(getKeyValueOfCatalog('cfdi40UsosCfdi', 'G01')).toBe('G01 - Adquisición de mercancías');
    expect(getKeyValueOfCatalog('cfdi40ObjetosImpuestos', '01')).toBe('01 - No objeto de impuesto');
    expect(getKeyValueOfCatalog('cfdi40Meses', '01')).toBe('01 - Enero');
    expect(getKeyValueOfCatalog('cfdi40Periodicidades', '01')).toBe('01 - Diario');
  });

  test('get value using valid key input', () => {
    expect(getValueOfCatalog('cfdi40TiposComprobantes', 'I')).toBe('Ingreso');
    expect(getValueOfCatalog('cfdi40FormasPago', '01')).toBe('Efectivo');
    expect(getValueOfCatalog('cfdi40MetodosPago', 'PUE')).toBe('Pago en una sola exhibición');
    expect(getValueOfCatalog('cfdi40Exportaciones', '01')).toBe('No aplica');
    expect(getValueOfCatalog('cfdi40RegimenesFiscales', '601')).toBe(
      'General de Ley Personas Morales',
    );
  });

  test('get key value using not value key on catalog return key', () => {
    expect(getKeyValueOfCatalog('cfdi40Impuestos', '004')).toBe('004');
  });
});
