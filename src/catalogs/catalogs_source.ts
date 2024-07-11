import { type CatalogsData } from '../types.js';
import cfdi40Exportaciones from './cfdi40_exportaciones.js';
import cfdi40FormasPago from './cfdi40_formas_pago.js';
import cfdi40Impuestos from './cfdi40_impuestos.js';
import cfdi40Meses from './cfdi40_meses.js';
import cfdi40MetodosPago from './cfdi40_metodos_pago.js';
import cfdi40ObjetosImpuestos from './cfdi40_objetos_impuestos.js';
import cfdi40Periodicidades from './cfdi40_periodicidades.js';
import cfdi40RegimenesFiscales from './cfdi40_regimenes_fiscales.js';
import cfdi40TiposComprobantes from './cfdi40_tipos_comprobantes.js';
import cfdi40TiposRelaciones from './cfdi40_tipos_relaciones.js';
import cfdi40UsosCfdi from './cfdi40_usos_cfdi.js';
import retenciones20ClavesRetencion from './retenciones20_claves_retencion.js';

export const catalogsSource: CatalogsData = {
  cfdi40Impuestos,
  cfdi40ObjetosImpuestos,
  cfdi40UsosCfdi,
  cfdi40RegimenesFiscales,
  cfdi40TiposRelaciones,
  cfdi40Meses,
  cfdi40Periodicidades,
  cfdi40Exportaciones,
  cfdi40MetodosPago,
  cfdi40FormasPago,
  cfdi40TiposComprobantes,
  retenciones20ClavesRetencion,
};

export const getKeyValueOfCatalog = (
  catalog: keyof CatalogsData,
  value: string,
  source = catalogsSource,
): string => {
  const model = source[catalog].find((raw) => raw.id === value);

  return model ? `${model.id} - ${model.texto}` : value;
};

export const getValueOfCatalog = (
  catalog: keyof CatalogsData,
  value: string,
  source = catalogsSource,
): string => source[catalog].find((raw) => raw.id === value)?.texto ?? value;
