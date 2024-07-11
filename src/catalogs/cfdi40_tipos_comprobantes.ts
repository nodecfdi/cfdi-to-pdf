import { buildItem, defineCatalog } from './define_catalog.js';

export default defineCatalog([
  buildItem('I', 'Ingreso'),
  buildItem('E', 'Egreso'),
  buildItem('T', 'Traslado'),
  buildItem('N', 'Nómina'),
  buildItem('P', 'Pago'),
]);
