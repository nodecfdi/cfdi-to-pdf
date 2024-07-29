import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const cfdi40Periodicidades = defineCatalog([
  buildItem('01', 'Diario'),
  buildItem('02', 'Semanal'),
  buildItem('03', 'Quincenal'),
  buildItem('04', 'Mensual'),
  buildItem('05', 'Bimestral'),
]);

export default cfdi40Periodicidades;
