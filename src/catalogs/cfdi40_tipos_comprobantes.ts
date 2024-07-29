import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const cfdi40TiposComprobantes = defineCatalog([
  buildItem('I', 'Ingreso'),
  buildItem('E', 'Egreso'),
  buildItem('T', 'Traslado'),
  buildItem('N', 'Nómina'),
  buildItem('P', 'Pago'),
]);

export default cfdi40TiposComprobantes;
