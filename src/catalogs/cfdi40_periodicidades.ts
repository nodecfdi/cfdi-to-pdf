import { buildItem, defineCatalog } from './define_catalog.js';

export default defineCatalog([
  buildItem('01', 'Diario'),
  buildItem('02', 'Semanal'),
  buildItem('03', 'Quincenal'),
  buildItem('04', 'Mensual'),
  buildItem('05', 'Bimestral'),
]);
