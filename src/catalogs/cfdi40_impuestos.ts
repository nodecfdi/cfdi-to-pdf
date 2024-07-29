import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const cfdi40Impuestos = defineCatalog([
  buildItem('001', 'ISR'),
  buildItem('002', 'IVA'),
  buildItem('003', 'IEPS'),
]);

export default cfdi40Impuestos;
