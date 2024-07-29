import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const cfdi40ObjetosImpuestos = defineCatalog([
  buildItem('01', 'No objeto de impuesto'),
  buildItem('02', 'Sí objeto de impuesto'),
  buildItem('03', 'Sí objeto del impuesto y no obligado al desglose'),
  buildItem('04', 'Sí objeto del impuesto y no causa impuesto'),
  buildItem('05', 'Sí objeto del impuesto, IVA crédito PODEBI'),
]);

export default cfdi40ObjetosImpuestos;
