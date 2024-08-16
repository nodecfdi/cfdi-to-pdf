import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const retenciones20Periodos = defineCatalog([
  buildItem('01', 'Enero'),
  buildItem('02', 'Febrero'),
  buildItem('03', 'Marzo'),
  buildItem('04', 'Abril'),
  buildItem('05', 'Mayo'),
  buildItem('06', 'Junio'),
  buildItem('07', 'Julio'),
  buildItem('08', 'Agosto'),
  buildItem('09', 'Septiembre'),
  buildItem('10', 'Octubre'),
  buildItem('11', 'Noviembre'),
  buildItem('12', 'Diciembre'),
]);

export default retenciones20Periodos;
