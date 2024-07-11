import { buildItem, defineCatalog } from './define_catalog.js';

export default defineCatalog([
  buildItem('PUE', 'Pago en una sola exhibición'),
  buildItem('PPD', 'Pago en parcialidades o diferido'),
]);
