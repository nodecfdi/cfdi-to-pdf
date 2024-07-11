import { buildItem, defineCatalog } from './define_catalog.js';

export default defineCatalog([
  buildItem('01', 'Nota de crédito de los documentos relacionados'),
  buildItem('02', 'Nota de débito de los documentos relacionados'),
  buildItem('03', 'Devolución de mercancía sobre facturas o traslados previos'),
  buildItem('04', 'Sustitución de los CFDI previos'),
  buildItem('05', 'Traslados de mercancías facturados previamente'),
  buildItem('06', 'Factura generada por los traslados previos'),
  buildItem('07', 'CFDI por aplicación de anticipo'),
]);
