import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const retenciones20TiposPago = defineCatalog([
  buildItem('01', 'Pago definitivo IVA'),
  buildItem('02', 'Pago definitivo IEPS'),
  buildItem('03', 'Pago definitivo ISR'),
  buildItem('04', 'Pago provisional ISR'),
]);

export default retenciones20TiposPago;
