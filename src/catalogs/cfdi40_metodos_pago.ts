import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const cfdi40MetodosPago = defineCatalog([
  buildItem('PUE', 'Pago en una sola exhibición'),
  buildItem('PPD', 'Pago en parcialidades o diferido'),
]);

export default cfdi40MetodosPago;
