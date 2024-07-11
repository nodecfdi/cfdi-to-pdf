import { buildItem, defineCatalog } from './define_catalog.js';

export default defineCatalog([
  buildItem('G01', 'Adquisición de mercancías'),
  buildItem('G02', 'Devoluciones, descuentos o bonificaciones'),
  buildItem('G03', 'Gastos en general'),
  buildItem('I01', 'Construcciones'),
  buildItem('I02', 'Mobiliario y equipo de oficina por inversiones'),
  buildItem('I03', 'Equipo de transporte'),
  buildItem('I04', 'Equipo de computo y accesorios'),
  buildItem('I05', 'Dados, troqueles, moldes, matrices y herramental'),
  buildItem('I06', 'Comunicaciones telefónicas'),
  buildItem('I07', 'Comunicaciones satelitales'),
  buildItem('I08', 'Otra maquinaria y equipo'),
  buildItem('D01', 'Honorarios médicos, dentales y gastos hospitalarios'),
  buildItem('D02', 'Gastos médicos por incapacidad o discapacidad'),
  buildItem('D03', 'Gastos funerales'),
  buildItem('D04', 'Donativos'),
  buildItem(
    'D05',
    'Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)',
  ),
  buildItem('D06', 'Aportaciones voluntarias al SAR'),
  buildItem('D07', 'Primas por seguros de gastos médicos'),
  buildItem('D08', 'Gastos de transportación escolar obligatoria'),
  buildItem(
    'D09',
    'Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones',
  ),
  buildItem('D10', 'Pagos por servicios educativos (colegiaturas)'),
  buildItem('S01', 'Sin efectos fiscales'),
  buildItem('CP01', 'Pagos'),
  buildItem('CN01', 'Nómina'),
]);
