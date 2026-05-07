import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { type CatalogsData } from '../../src/types.js';
import { formatCurrency } from '../../src/utils/currency.js';

const nomina12PercepcionesContent = (
  percepciones: XmlNodeInterface,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content[] => {
  const percepcionList = percepciones.searchNodes('nomina12:Percepcion');

  const headerCells = ['Tipo de percepción', 'Clave', 'Concepto', 'Importe gravado', 'Importe exento'].map((cell) => ({
    text: cell,
    style: 'tableHeader',
    fillColor: primaryColor,
    margin: [0, 3, 0, 3] as [number, number, number, number],
  }));

  const rows: TableCell[][] = [headerCells];

  for (const percepcion of percepcionList) {
    rows.push([
      {
        text: catalogs.nominaTiposPercepciones.findAndReturnTexto(percepcion.getAttribute('TipoPercepcion')),
        fillColor: bgGrayColor,
      },
      { text: percepcion.getAttribute('Clave'), alignment: 'center', fillColor: bgGrayColor },
      { text: percepcion.getAttribute('Concepto'), fillColor: bgGrayColor },
      { text: formatCurrency(percepcion.getAttribute('ImporteGravado')), alignment: 'right', fillColor: bgGrayColor },
      { text: formatCurrency(percepcion.getAttribute('ImporteExento')), alignment: 'right', fillColor: bgGrayColor },
    ]);
  }

  rows.push([
    {
      text: 'Total Percepciones',
      colSpan: 3,
      alignment: 'right',
      bold: true,
      color: primaryColor,
      border: [false, true, false, false],
    },
    {},
    {},
    {
      text: formatCurrency(percepciones.getAttribute('TotalGravado')),
      alignment: 'right',
      bold: true,
      border: [false, true, false, false],
    },
    {
      text: formatCurrency(percepciones.getAttribute('TotalExento')),
      alignment: 'right',
      bold: true,
      border: [false, true, false, false],
    },
  ]);

  const percepcionesTable: Content = {
    table: {
      widths: ['*', '8%', '30%', '15%', '15%'],
      body: rows,
      dontBreakRows: true,
      headerRows: 1,
    },
    layout: 'conceptosLayout',
  };

  const totalRows: TableCell[][] = [
    [
      { text: 'Total sueldos', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
      { text: 'Total separación indemnización', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
      { text: 'Total jubilación pensión retiro', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
      { text: 'Total gravado', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
      { text: 'Total exento', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
    ],
    [
      { text: formatCurrency(percepciones.getAttribute('TotalSueldos')), alignment: 'right', fillColor: bgGrayColor },
      {
        text: formatCurrency(percepciones.getAttribute('TotalSeparacionIndemnizacion')),
        alignment: 'right',
        fillColor: bgGrayColor,
      },
      {
        text: formatCurrency(percepciones.getAttribute('TotalJubilacionPensionRetiro')),
        alignment: 'right',
        fillColor: bgGrayColor,
      },
      { text: formatCurrency(percepciones.getAttribute('TotalGravado')), alignment: 'right', fillColor: bgGrayColor },
      { text: formatCurrency(percepciones.getAttribute('TotalExento')), alignment: 'right', fillColor: bgGrayColor },
    ],
  ];

  const totalsTable: Content = {
    table: {
      widths: ['20%', '20%', '20%', '20%', '20%'],
      body: totalRows,
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  };

  return [
    {
      stack: [{ text: 'Percepciones', style: ['tableSubtitleHeader'], color: primaryColor }, percepcionesTable],
      unbreakable: true,
    },
    {
      stack: [
        {
          text: 'Total percepciones',
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

export default nomina12PercepcionesContent;
