import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { formatCurrency, toNumber } from '../../src/utils/currency.js';
import { findTipoDeduccionTexto } from '../../src/utils/nomina_tipos_deducciones.js';

const nomina12DeduccionesContent = (
  deducciones: XmlNodeInterface,
  primaryColor: string,
  bgGrayColor: string,
): Content[] => {
  const deduccionList = deducciones.searchNodes('nomina12:Deduccion');

  const headerCells = ['Tipo de deducción', 'Clave', 'Concepto', 'Importe'].map((cell) => ({
    text: cell,
    style: 'tableHeader',
    fillColor: primaryColor,
    margin: [0, 3, 0, 3] as [number, number, number, number],
  }));

  const rows: TableCell[][] = [headerCells];

  let totalDeducciones = 0;
  for (const deduccion of deduccionList) {
    const importe = toNumber(deduccion.getAttribute('Importe'));
    totalDeducciones += importe;
    rows.push([
      { text: findTipoDeduccionTexto(deduccion.getAttribute('TipoDeduccion')), fillColor: bgGrayColor },
      { text: deduccion.getAttribute('Clave'), alignment: 'center', fillColor: bgGrayColor },
      { text: deduccion.getAttribute('Concepto'), fillColor: bgGrayColor },
      { text: formatCurrency(deduccion.getAttribute('Importe')), alignment: 'right', fillColor: bgGrayColor },
    ]);
  }

  rows.push([
    {
      text: 'Total Deducciones',
      colSpan: 3,
      alignment: 'right',
      bold: true,
      color: primaryColor,
      border: [false, true, false, false],
    },
    {},
    {},
    {
      text: formatCurrency(totalDeducciones),
      alignment: 'right',
      bold: true,
      border: [false, true, false, false],
    },
  ]);

  const deduccionesTable: Content = {
    table: {
      widths: ['*', '8%', '30%', '15%'],
      body: rows,
      dontBreakRows: true,
      headerRows: 1,
    },
    layout: 'conceptosLayout',
  };

  const totalRows: TableCell[][] = [
    [
      { text: 'Total otras deducciones', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
      { text: 'Total impuestos retenidos', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
    ],
    [
      {
        text: formatCurrency(deducciones.getAttribute('TotalOtrasDeducciones')),
        alignment: 'right',
        fillColor: bgGrayColor,
      },
      {
        text: formatCurrency(deducciones.getAttribute('TotalImpuestosRetenidos')),
        alignment: 'right',
        fillColor: bgGrayColor,
      },
    ],
  ];

  const totalsTable: Content = {
    table: {
      widths: ['50%', '50%'],
      body: totalRows,
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  };

  return [
    {
      stack: [{ text: 'Deducciones', style: ['tableSubtitleHeader'], color: primaryColor }, deduccionesTable],
      unbreakable: true,
    },
    {
      stack: [
        {
          text: 'Total deducciones',
          style: ['tableSubtitleHeader'],
          color: primaryColor,
          margin: [0, 4, 0, 0] as [number, number, number, number],
        },
        totalsTable,
      ],
      unbreakable: true,
    },
  ];
};

export default nomina12DeduccionesContent;
