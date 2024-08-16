import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { getValueOfCatalog } from '#src/catalogs/catalogs_source';
import useImplocal10Complement from '#src/templates/complements/implocal10_complement';
import { type CatalogsData } from '#src/types';
import { formatCurrency, toNumber } from '#src/utils/currency';

const fillCfdiImpuestos = (
  comprobante: XmlNodeInterface,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
  totalesSubContent: TableCell[],
): void => {
  const elementImpuestos = 'cfdi:Impuestos';
  const traslados = comprobante
    .searchNodes(elementImpuestos, 'cfdi:Traslados', 'cfdi:Traslado')
    .filter(
      (value) =>
        value.getAttribute('TipoFactor') !== 'Exento' &&
        toNumber(value.getAttribute('TasaOCuota')) > 0,
    );
  const retenciones = comprobante.searchNodes(
    elementImpuestos,
    'cfdi:Retenciones',
    'cfdi:Retencion',
  );

  const retencionesTable: TableCell = {
    table: {
      widths: ['40%', 'auto'],
      body: [
        [
          {
            text: 'Impuestos Retenidos',
            style: ['tableSubtitleHeader'],
            color: primaryColor,
            colSpan: 2,
          },
          '',
        ],
        ...retenciones.map((retencion) => {
          return [
            {
              text: getValueOfCatalog(
                'cfdi40Impuestos',
                retencion.getAttribute('Impuesto'),
                catalogs,
              ),
              fillColor: bgGrayColor,
            },
            {
              text: [
                { text: 'Importe: ' },
                { text: formatCurrency(retencion.getAttribute('Importe')) },
              ],
              alignment: 'right',
              fillColor: bgGrayColor,
            },
          ];
        }),
      ],
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  };
  const trasladosTable: TableCell = {
    table: {
      widths: ['10%', '10%', '20%', '18%', 'auto'],
      body: [
        [
          {
            text: 'Impuestos Trasladados',
            style: ['tableSubtitleHeader'],
            color: primaryColor,
            colSpan: 5,
          },
          '',
          '',
          '',
          '',
        ],
        ...traslados.map((traslado) => {
          const isTasa = traslado.getAttribute('TipoFactor') === 'Tasa';
          const tasaOCuota = traslado.getAttribute('TasaOCuota');

          return [
            {
              text: getValueOfCatalog(
                'cfdi40Impuestos',
                traslado.getAttribute('Impuesto'),
                catalogs,
              ),
              fillColor: bgGrayColor,
            },
            {
              text: traslado.getAttribute('TipoFactor'),
              alignment: 'center',
              fillColor: bgGrayColor,
            },
            {
              text: isTasa ? `${(Number(tasaOCuota) * 100).toString()} %` : tasaOCuota,
              alignment: 'center',
              fillColor: bgGrayColor,
            },
            { text: 'Importe: ', alignment: 'left', fillColor: bgGrayColor },
            {
              text: formatCurrency(traslado.getAttribute('Importe')),
              alignment: 'right',
              fillColor: bgGrayColor,
            },
          ];
        }),
      ],
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  };

  if (traslados.length === 0 && retenciones.length === 0) {
    totalesSubContent.push('', '');
  }

  if (traslados.length === 0 && retenciones.length > 0) {
    totalesSubContent.push(
      {
        ...retencionesTable,
        colSpan: 2,
      },
      '',
    );
  }

  if (traslados.length > 0 && retenciones.length === 0) {
    totalesSubContent.push(
      {
        ...trasladosTable,
        colSpan: 2,
      },
      '',
    );
  }

  if (traslados.length > 0 && retenciones.length > 0) {
    totalesSubContent.push(trasladosTable, retencionesTable);
  }
};

const genericCfdiTotalesContent = (
  comprobante: XmlNodeInterface,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content => {
  const elementImpuestos = 'cfdi:Impuestos';
  const totalesContent: TableCell[][] = [];

  const totalImpuestosTrasladados = comprobante.searchAttribute(
    elementImpuestos,
    'TotalImpuestosTrasladados',
  );
  const totalImpuestosRetenidos = comprobante.searchAttribute(
    elementImpuestos,
    'TotalImpuestosRetenidos',
  );

  const totalesSubContent: TableCell[] = [];
  fillCfdiImpuestos(comprobante, catalogs, primaryColor, bgGrayColor, totalesSubContent);

  const tableTotales: TableCell[][] = [
    [
      { text: 'Subtotal', alignment: 'right' },
      { text: '$', color: primaryColor, alignment: 'center' },
      {
        text: formatCurrency(comprobante.getAttribute('SubTotal'), 'code'),
        alignment: 'right',
      },
    ],
    [
      { text: 'Descuento', alignment: 'right' },
      { text: '$', color: primaryColor, alignment: 'center' },
      {
        text: `- ${formatCurrency(comprobante.getAttribute('Descuento'), 'code')}`,
        alignment: 'right',
      },
    ],
    [
      { text: 'Traslados', alignment: 'right' },
      { text: '$', color: primaryColor, alignment: 'center' },
      { text: formatCurrency(totalImpuestosTrasladados, 'code'), alignment: 'right' },
    ],
    [
      { text: 'Retenciones', alignment: 'right' },
      { text: '$', color: primaryColor, alignment: 'center' },
      { text: `- ${formatCurrency(totalImpuestosRetenidos, 'code')}`, alignment: 'right' },
    ],
  ];

  const impLocal10 = comprobante.searchNode('cfdi:Complemento', 'implocal:ImpuestosLocales');
  if (impLocal10) {
    totalesSubContent.push('');
    totalesContent.push(totalesSubContent);
    useImplocal10Complement(impLocal10, primaryColor, bgGrayColor, tableTotales, totalesContent);
  } else {
    totalesSubContent.push({
      table: {
        widths: ['*', '10%', 'auto'],
        body: tableTotales,
        dontBreakRows: true,
      },
      layout: 'tableLayout',
    });
    totalesContent.push(totalesSubContent);
  }

  totalesContent.push([
    '',
    {
      style: 'tableHeader',
      text: `Total ${comprobante.getAttribute('Moneda')} ${formatCurrency(comprobante.getAttribute('Total'))}`,
      alignment: 'right',
      margin: [2, 5, 2, 2],
      fillColor: primaryColor,
      fontSize: 14,
      colSpan: 2,
    },
    '',
  ]);

  return {
    table: {
      widths: ['38%', '28%', '34%'],
      body: totalesContent,
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  };
};

export default genericCfdiTotalesContent;
