import { buildItem, defineCatalog } from '#src/catalogs/define_catalog';

const cfdi40FormasPago = defineCatalog([
  buildItem('01', 'Efectivo'),
  buildItem('02', 'Cheque nominativo'),
  buildItem('03', 'Transferencia electrónica de fondos'),
  buildItem('04', 'Tarjeta de crédito'),
  buildItem('05', 'Monedero electrónico'),
  buildItem('06', 'Dinero electrónico'),
  buildItem('08', 'Vales de despensa'),
  buildItem('12', 'Dación en pago'),
  buildItem('13', 'Pago por subrogación'),
  buildItem('14', 'Pago por consignación'),
  buildItem('15', 'Condonación'),
  buildItem('17', 'Compensación'),
  buildItem('23', 'Novación'),
  buildItem('24', 'Confusión'),
  buildItem('25', 'Remisión de deuda'),
  buildItem('26', 'Prescripción o caducidad'),
  buildItem('27', 'A satisfacción del acreedor'),
  buildItem('28', 'Tarjeta de débito'),
  buildItem('29', 'Tarjeta de servicios'),
  buildItem('30', 'Aplicación de anticipos'),
  buildItem('31', 'Intermediario pagos'),
  buildItem('99', 'Por definir'),
]);

export default cfdi40FormasPago;
