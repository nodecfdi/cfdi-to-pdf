import { StaticCatalogs } from 'src/catalogs/static-catalogs';

describe('StaticCatalog', () => {
  test('get value using valid data', () => {
    const catalogs = new StaticCatalogs();

    expect(catalogs.catTipoComprobante('I')).toBe('I - Ingreso');
    expect(catalogs.catFormaPago('01')).toBe('01 - Efectivo');
    expect(catalogs.catMetodoPago('PUE')).toBe('PUE - Pago en una sola exhibición');
    expect(catalogs.catExportacion('01')).toBe('01 - No aplica');
    expect(catalogs.catRegimenFiscal('601')).toBe('601 - General de Ley Personas Morales');
    expect(catalogs.catUsoCFDI('G01')).toBe('G01 - Adquisición de mercancías');
    expect(catalogs.catObjetoImp('01')).toBe('01 - No objeto de impuesto');
    expect(catalogs.catMeses('01')).toBe('01 - Enero');
    expect(catalogs.catPeriodicidad('01')).toBe('01 - Diario');
  });

  test('get value using not value key on catalog', () => {
    const catalogs = new StaticCatalogs();

    expect(catalogs.catImpuesto('004')).toBe('004');
  });
});
