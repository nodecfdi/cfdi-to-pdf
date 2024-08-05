import cfdi40Exportaciones from '#src/catalogs/cfdi40_exportaciones';
import cfdi40FormasPago from '#src/catalogs/cfdi40_formas_pago';
import cfdi40Impuestos from '#src/catalogs/cfdi40_impuestos';
import cfdi40Meses from '#src/catalogs/cfdi40_meses';
import cfdi40MetodosPago from '#src/catalogs/cfdi40_metodos_pago';
import cfdi40ObjetosImpuestos from '#src/catalogs/cfdi40_objetos_impuestos';
import cfdi40Periodicidades from '#src/catalogs/cfdi40_periodicidades';
import cfdi40RegimenesFiscales from '#src/catalogs/cfdi40_regimenes_fiscales';
import cfdi40TiposComprobantes from '#src/catalogs/cfdi40_tipos_comprobantes';
import cfdi40TiposRelaciones from '#src/catalogs/cfdi40_tipos_relaciones';
import cfdi40UsosCfdi from '#src/catalogs/cfdi40_usos_cfdi';
import pagosTiposCadenaPago from '#src/catalogs/pagos_tipos_cadena_pago';
import retenciones20ClavesRetencion from '#src/catalogs/retenciones20_claves_retencion';
import retenciones20Periodicidades from '#src/catalogs/retenciones20_periodicidades';
import retenciones20Periodos from '#src/catalogs/retenciones20_periodos';
import retenciones20TiposPago from '#src/catalogs/retenciones20_tipos_pago';
import { type CatalogsData } from '#src/types';

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
  pagosTiposCadenaPago,
  retenciones20ClavesRetencion,
  retenciones20Periodicidades,
  retenciones20Periodos,
  retenciones20TiposPago,
};

export const getKeyValueOfCatalog = (
  catalog: keyof CatalogsData,
  value: string,
  source: CatalogsData,
): string => {
  const model = source[catalog].find((raw) => raw.id === value);

  return model ? `${model.id} - ${model.texto}` : value;
};

export const getValueOfCatalog = (
  catalog: keyof CatalogsData,
  value: string,
  source: CatalogsData,
): string => source[catalog].find((raw) => raw.id === value)?.texto ?? value;
