import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const cfdi40RegimenesFiscales = defineCatalog([
  buildItem('601', 'General de Ley Personas Morales'),
  buildItem('603', 'Personas Morales con Fines no Lucrativos'),
  buildItem('605', 'Sueldos y Salarios e Ingresos Asimilados a Salarios'),
  buildItem('606', 'Arrendamiento'),
  buildItem('607', 'Régimen de Enajenación o Adquisición de Bienes'),
  buildItem('608', 'Demás ingresos'),
  buildItem('610', 'Residentes en el Extranjero sin Establecimiento Permanente en México'),
  buildItem('611', 'Ingresos por Dividendos (socios y accionistas)'),
  buildItem('612', 'Personas Físicas con Actividades Empresariales y Profesionales'),
  buildItem('614', 'Ingresos por intereses'),
  buildItem('615', 'Régimen de los ingresos por obtención de premios'),
  buildItem('616', 'Sin obligaciones fiscales'),
  buildItem('620', 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos'),
  buildItem('621', 'Incorporación Fiscal'),
  buildItem('622', 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras'),
  buildItem('623', 'Opcional para Grupos de Sociedades'),
  buildItem('624', 'Coordinados'),
  buildItem(
    '625',
    'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
  ),
  buildItem('626', 'Régimen Simplificado de Confianza'),
]);

export default cfdi40RegimenesFiscales;
