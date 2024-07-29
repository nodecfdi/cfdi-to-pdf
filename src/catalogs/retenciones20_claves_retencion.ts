import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const retenciones20ClavesRetencion = defineCatalog([
  buildItem('01', 'Servicios profesionales'),
  buildItem('02', 'Regalías por derechos de autor'),
  buildItem('03', 'Autotransporte terrestre de carga'),
  buildItem('04', 'Servicios prestados por comisionistas'),
  buildItem('05', 'Arrendamiento'),
  buildItem('06', 'Enajenación de acciones'),
  buildItem(
    '07',
    'Enajenación de bienes objeto de la LIEPS, a través de mediadores, agentes, representantes, corredores, consignatarios o distribuidores',
  ),
  buildItem('08', 'Enajenación de bienes inmuebles consignada en escritura pública'),
  buildItem('09', 'Enajenación de otros bienes, no consignada en escritura pública'),
  buildItem('10', 'Adquisición de desperdicios industriales'),
  buildItem('11', 'Adquisición de bienes consignada en escritura pública'),
  buildItem('12', 'Adquisición de otros bienes, no consignada en escritura pública'),
  buildItem('13', 'Otros retiros de AFORE'),
  buildItem('14', 'Dividendos o utilidades distribuidas'),
  buildItem('15', 'Remanente distribuible'),
  buildItem('16', 'Intereses'),
  buildItem('17', 'Arrendamiento en fideicomiso'),
  buildItem('18', 'Pagos realizados a favor de residentes en el extranjero'),
  buildItem('19', 'Enajenación de acciones u operaciones en bolsa de valores'),
  buildItem('20', 'Obtención de premios'),
  buildItem('21', 'Fideicomisos que no realizan actividades empresariales'),
  buildItem('22', 'Planes personales de retiro'),
  buildItem('23', 'Intereses reales deducibles por créditos hipotecarios'),
  buildItem('24', 'Operaciones Financieras Derivadas de Capital'),
  buildItem('25', 'Otro tipo de retenciones'),
  buildItem('26', 'Servicios mediante Plataformas Tecnológicas'),
  buildItem('27', 'Sector Financiero'),
  buildItem('28', 'Pagos y retenciones a Contribuyentes del RIF'),
]);

export default retenciones20ClavesRetencion;
