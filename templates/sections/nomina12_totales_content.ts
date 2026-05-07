import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { formatCurrency } from '../../src/utils/currency.js';

const nomina12TotalesContent = (
  nomina: XmlNodeInterface,
  comprobante: XmlNodeInterface,
  primaryColor: string,
  bgGrayColor: string,
): Content[] => {
  const totalRows: TableCell[][] = [
    [
      { text: 'Total percepciones', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
      { text: 'Total otros pagos', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
      { text: 'Total deducciones', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
    ],
    [
      {
        text: formatCurrency(nomina.getAttribute('TotalPercepciones')),
        alignment: 'right',
        fillColor: bgGrayColor,
      },
      {
        text: formatCurrency(nomina.getAttribute('TotalOtrosPagos')),
        alignment: 'right',
        fillColor: bgGrayColor,
      },
      {
        text: formatCurrency(nomina.getAttribute('TotalDeducciones')),
        alignment: 'right',
        fillColor: bgGrayColor,
      },
    ],
  ];

  const totalsTable: Content = {
    table: {
      widths: ['33%', '33%', '*'],
      body: totalRows,
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  };

  const importeNeto: Content = {
    table: {
      widths: ['*', 120],
      body: [
        [
          {
            text: 'IMPORTE NETO',
            alignment: 'right',
            bold: true,
            color: primaryColor,
            fontSize: 12,
            margin: [0, 6, 8, 6] as [number, number, number, number],
          },
          {
            text: formatCurrency(comprobante.getAttribute('Total')),
            alignment: 'right',
            bold: true,
            color: 'white',
            fillColor: primaryColor,
            fontSize: 14,
            margin: [8, 6, 8, 6] as [number, number, number, number],
          },
        ],
      ],
    },
    layout: 'tableLayout',
  };

  return [
    {
      stack: [
        { text: 'Totales Nómina', style: ['tableSubtitleHeader'], color: primaryColor },
        totalsTable,
        importeNeto,
      ],
      unbreakable: true,
    },
  ];
};

export default nomina12TotalesContent;
