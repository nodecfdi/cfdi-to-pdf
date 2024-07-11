import { buildItem, defineCatalog } from './define_catalog.js';

export default defineCatalog([
  buildItem('01', 'No aplica'),
  buildItem('02', 'Definitiva con clave A1'),
  buildItem('03', 'Temporal'),
  buildItem(
    '04',
    'Definitiva con clave distinta a A1 o cuando no existe enajenación en términos del CFF',
  ),
]);
