import {
  catalogsSource,
  getKeyValueOfCatalog,
  getValueOfCatalog,
} from '#src/catalogs/catalogs_source';

describe('catalog source', () => {
  test('get key value using valid data', () => {
    expect(getKeyValueOfCatalog('cfdi40TiposComprobantes', 'I', catalogsSource)).toBe(
      'I - Ingreso',
    );
    expect(getKeyValueOfCatalog('cfdi40FormasPago', '01', catalogsSource)).toBe('01 - Efectivo');
    expect(getKeyValueOfCatalog('cfdi40MetodosPago', 'PUE', catalogsSource)).toBe(
      'PUE - Pago en una sola exhibición',
    );
    expect(getKeyValueOfCatalog('cfdi40Exportaciones', '01', catalogsSource)).toBe(
      '01 - No aplica',
    );
    expect(getKeyValueOfCatalog('cfdi40RegimenesFiscales', '601', catalogsSource)).toBe(
      '601 - General de Ley Personas Morales',
    );
    expect(getKeyValueOfCatalog('cfdi40UsosCfdi', 'G01', catalogsSource)).toBe(
      'G01 - Adquisición de mercancías',
    );
    expect(getKeyValueOfCatalog('cfdi40ObjetosImpuestos', '01', catalogsSource)).toBe(
      '01 - No objeto de impuesto',
    );
    expect(getKeyValueOfCatalog('cfdi40Meses', '01', catalogsSource)).toBe('01 - Enero');
    expect(getKeyValueOfCatalog('cfdi40Periodicidades', '01', catalogsSource)).toBe('01 - Diario');
  });

  test('get value using valid key input', () => {
    expect(getValueOfCatalog('cfdi40TiposComprobantes', 'I', catalogsSource)).toBe('Ingreso');
    expect(getValueOfCatalog('cfdi40FormasPago', '01', catalogsSource)).toBe('Efectivo');
    expect(getValueOfCatalog('cfdi40MetodosPago', 'PUE', catalogsSource)).toBe(
      'Pago en una sola exhibición',
    );
    expect(getValueOfCatalog('cfdi40Exportaciones', '01', catalogsSource)).toBe('No aplica');
    expect(getValueOfCatalog('cfdi40RegimenesFiscales', '601', catalogsSource)).toBe(
      'General de Ley Personas Morales',
    );
  });

  test('get key value using not value key on catalog return key', () => {
    expect(getKeyValueOfCatalog('cfdi40Impuestos', '004', catalogsSource)).toBe('004');
  });
});
