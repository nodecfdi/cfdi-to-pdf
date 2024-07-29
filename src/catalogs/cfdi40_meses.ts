import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const cfdi40Meses = defineCatalog([
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
  buildItem('13', 'Enero-Febrero'),
  buildItem('14', 'Marzo-Abril'),
  buildItem('15', 'Mayo-Junio'),
  buildItem('16', 'Julio-Agosto'),
  buildItem('17', 'Septiembre-Octubre'),
  buildItem('18', 'Noviembre-Diciembre'),
]);

export default cfdi40Meses;
