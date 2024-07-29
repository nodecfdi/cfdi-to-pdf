import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const cfdi40TiposRelaciones = defineCatalog([
  buildItem('01', 'Nota de crédito de los documentos relacionados'),
  buildItem('02', 'Nota de débito de los documentos relacionados'),
  buildItem('03', 'Devolución de mercancía sobre facturas o traslados previos'),
  buildItem('04', 'Sustitución de los CFDI previos'),
  buildItem('05', 'Traslados de mercancías facturados previamente'),
  buildItem('06', 'Factura generada por los traslados previos'),
  buildItem('07', 'CFDI por aplicación de anticipo'),
]);

export default cfdi40TiposRelaciones;
