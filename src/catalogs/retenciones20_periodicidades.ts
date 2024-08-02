import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const retenciones20Periodicidades = defineCatalog([
  buildItem('01', 'Semanal'),
  buildItem('02', 'Mensual'),
  buildItem('03', 'Diario'),
  buildItem('04', 'Quincenal'),
  buildItem('05', 'Otro'),
]);

export default retenciones20Periodicidades;
