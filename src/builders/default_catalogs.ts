import { wrapCatalog } from '@nodecfdi/sat-micro-catalogs';
import cfdi40ExportacionesRaw from '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_exportaciones' assert { type: 'json' };
import cfdi40FormasPagoRaw from '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_formas_pago' assert { type: 'json' };
import cfdi40ImpuestosRaw from '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_impuestos' assert { type: 'json' };
import cfdi40MesesRaw from '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_meses' assert { type: 'json' };
import cfdi40MetodosPagoRaw from '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_metodos_pago' assert { type: 'json' };
import cfdi40ObjetosImpuestosRaw from '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_objetos_impuestos' assert { type: 'json' };
import cfdi40PeriodicidadesRaw from '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_periodicidades' assert { type: 'json' };
import cfdi40RegimenesFiscalesRaw from '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_regimenes_fiscales' assert { type: 'json' };
import cfdi40TiposComprobantesRaw from '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_tipos_comprobantes' assert { type: 'json' };
import cfdi40TiposRelacionesRaw from '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_tipos_relaciones' assert { type: 'json' };
import cfdi40UsosCfdiRaw from '@nodecfdi/sat-micro-catalogs/raw/cfdi_40_usos_cfdi' assert { type: 'json' };
import pagosTiposCadenaPagoRaw from '@nodecfdi/sat-micro-catalogs/raw/pagos_tipos_cadena_pago' assert { type: 'json' };
import retenciones20ClavesRetencionRaw from '@nodecfdi/sat-micro-catalogs/raw/ret_20_claves_retencion' assert { type: 'json' };
import retenciones20PeriodicidadesRaw from '@nodecfdi/sat-micro-catalogs/raw/ret_20_periodicidades' assert { type: 'json' };
import retenciones20PeriodosRaw from '@nodecfdi/sat-micro-catalogs/raw/ret_20_periodos' assert { type: 'json' };
import retenciones20TiposPagoRaw from '@nodecfdi/sat-micro-catalogs/raw/ret_20_tipos_pago_retencion' assert { type: 'json' };
import { type CatalogsData } from '../types.js';

const catalogs: CatalogsData = {
  cfdi40Impuestos: wrapCatalog(cfdi40ImpuestosRaw),
  cfdi40ObjetosImpuestos: wrapCatalog(cfdi40ObjetosImpuestosRaw),
  cfdi40UsosCfdi: wrapCatalog(cfdi40UsosCfdiRaw),
  cfdi40RegimenesFiscales: wrapCatalog(cfdi40RegimenesFiscalesRaw),
  cfdi40TiposRelaciones: wrapCatalog(cfdi40TiposRelacionesRaw),
  cfdi40Meses: wrapCatalog(cfdi40MesesRaw),
  cfdi40Periodicidades: wrapCatalog(cfdi40PeriodicidadesRaw),
  cfdi40Exportaciones: wrapCatalog(cfdi40ExportacionesRaw),
  cfdi40MetodosPago: wrapCatalog(cfdi40MetodosPagoRaw),
  cfdi40FormasPago: wrapCatalog(cfdi40FormasPagoRaw),
  cfdi40TiposComprobantes: wrapCatalog(cfdi40TiposComprobantesRaw),
  pagosTiposCadenaPago: wrapCatalog(pagosTiposCadenaPagoRaw),
  retenciones20ClavesRetencion: wrapCatalog(retenciones20ClavesRetencionRaw),
  retenciones20Periodicidades: wrapCatalog(retenciones20PeriodicidadesRaw),
  retenciones20Periodos: wrapCatalog(retenciones20PeriodosRaw),
  retenciones20TiposPago: wrapCatalog(retenciones20TiposPagoRaw),
};

export default catalogs;
