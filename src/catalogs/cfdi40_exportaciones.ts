import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const cfdi40Exportaciones = defineCatalog([
  buildItem('01', 'No aplica'),
  buildItem('02', 'Definitiva con clave A1'),
  buildItem('03', 'Temporal'),
  buildItem(
    '04',
    'Definitiva con clave distinta a A1 o cuando no existe enajenación en términos del CFF',
  ),
]);

export default cfdi40Exportaciones;
