import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { getKeyValueOfCatalog } from '#src/catalogs/catalogs_source';
import type CfdiData from '#src/cfdi_data';
import { type CatalogsData } from '#src/types';
import { formatCurrency, toNumber } from '#src/utils/currency';

const calcularImpuestos = (
  concepto: XmlNodeInterface,
  _catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content[] => {
  const impuestosContent: Content[] = [];

  const traslados = concepto.searchNodes('cfdi:Impuestos', 'cfdi:Traslados', 'cfdi:Traslado');
  const retenciones = concepto.searchNodes('cfdi:Impuestos', 'cfdi:Retenciones', 'cfdi:Retencion');

  if (traslados.length === 0 && retenciones.length === 0) {
    return [];
  }

  const uniqueTraslados = new Map<string, { impuesto: string; importe: string | number }>();
  const uniqueRetenciones = new Map<string, { impuesto: string; importe: string | number }>();

  if (traslados.length > 0) {
    for (const traslado of traslados) {
      const key = `${traslado.getAttribute('Impuesto')}}`;
      if (traslado.getAttribute('TipoFactor') === 'Exento') {
        uniqueTraslados.set(key, {
          impuesto: traslado.getAttribute('Impuesto'),
          importe: 'EXENTO',
        });
        continue;
      }

      if (uniqueTraslados.has(key)) {
        const importe =
          toNumber(uniqueTraslados.get(key)!.importe) + toNumber(traslado.getAttribute('Importe'));
        uniqueTraslados.set(key, {
          impuesto: traslado.getAttribute('Impuesto'),
          importe,
        });
        continue;
      }

      uniqueTraslados.set(key, {
        impuesto: traslado.getAttribute('Impuesto'),
        importe: toNumber(traslado.getAttribute('Importe')),
      });
    }
  }

  if (retenciones.length > 0) {
    for (const retencion of retenciones) {
      const key = `${retencion.getAttribute('Impuesto')}}`;
      if (uniqueRetenciones.has(key)) {
        const importe =
          toNumber(uniqueRetenciones.get(key)!.importe) +
          toNumber(retencion.getAttribute('Importe'));
        uniqueRetenciones.set(key, {
          impuesto: retencion.getAttribute('Impuesto'),
          importe,
        });
        continue;
      }

      uniqueRetenciones.set(key, {
        impuesto: retencion.getAttribute('Impuesto'),
        importe: toNumber(retencion.getAttribute('Importe')),
      });
    }
  }

  const contentTable: TableCell[][] = [
    [{}, {}, {}],
    ...[...uniqueTraslados.values()].map((traslado) => [
      { text: 'Traslado', color: primaryColor },
      { text: getKeyValueOfCatalog('cfdi40Impuestos', traslado.impuesto, _catalogs) },
      {
        text:
          typeof traslado.importe === 'string'
            ? traslado.importe
            : formatCurrency(traslado.importe),
      },
    ]),
    [{}, {}, {}],
    ...[...uniqueRetenciones.values()].map((retencion) => [
      { text: 'Retención', color: primaryColor },
      { text: getKeyValueOfCatalog('cfdi40Impuestos', retencion.impuesto, _catalogs) },
      { text: formatCurrency(retencion.importe) },
    ]),
  ];

  impuestosContent.push({
    table: {
      widths: ['auto', '10%', '15%'],
      body: contentTable,
    },
    layout: 'noBorders',
    fillColor: bgGrayColor,
  });

  return impuestosContent;
};

const genericCfdiConceptosContent = (
  data: CfdiData,
  _catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content => {
  const conceptos = data.comprobante().searchNodes('cfdi:Conceptos', 'cfdi:Concepto');

  const rowsConceptos: TableCell[][] = [];

  const headerCells = [
    'Código',
    'Clave Unidad',
    'Descripción',
    'Valor Unitario',
    'Cantidad',
    { text: 'Importe', alignment: 'center' },
    'Descuento',
  ];
  const styledHeaderCells = headerCells.map((cell) => ({
    text: cell,
    style: 'tableHeader',
    margin: [0, 3, 0, 3],
  }));
  rowsConceptos.push(styledHeaderCells);

  const cellStyle = {
    margin: [0, 2.5, 0, 2.5],
  };

  for (const concepto of conceptos) {
    const rowContent: TableCell[] = [
      { text: concepto.getAttribute('ClaveProdServ'), ...cellStyle },
      { text: concepto.getAttribute('ClaveUnidad'), ...cellStyle },
      { text: concepto.getAttribute('Descripcion'), ...cellStyle },
      {
        text: formatCurrency(concepto.getAttribute('ValorUnitario')),
        alignment: 'right',
        ...cellStyle,
      },
      { text: concepto.getAttribute('Cantidad'), alignment: 'center', ...cellStyle },
      { text: formatCurrency(concepto.getAttribute('Importe')), alignment: 'right', ...cellStyle },
      {
        text: formatCurrency(concepto.getAttribute('Descuento')),
        alignment: 'right',
        ...cellStyle,
      },
    ];
    rowsConceptos.push(rowContent);

    const impuestosRow: TableCell[] = [
      {
        stack: calcularImpuestos(concepto, _catalogs, primaryColor, bgGrayColor),
        alignment: 'left',
        colSpan: 7,
      },
    ];
    rowsConceptos.push(impuestosRow);
    const linesRow: TableCell[] = [{ fillColor: primaryColor, text: '', colSpan: 7 }];
    rowsConceptos.push(linesRow);
  }

  return {
    table: {
      widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
      body: rowsConceptos,
    },
    layout: {
      fillColor(i): string | null {
        return i === 0 ? primaryColor : null;
      },
      hLineWidth: () => 0,
      vLineWidth: () => 0,
    },
  };
};

export default genericCfdiConceptosContent;
