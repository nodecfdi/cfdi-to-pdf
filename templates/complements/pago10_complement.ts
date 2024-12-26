import { type XmlNodes } from '@nodecfdi/cfdi-core';
import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { type CatalogsData } from '../../src/types.js';
import { formatCurrency } from '../../src/utils/currency.js';

const fillDoctoRelacionados = (doctoRelacionados: XmlNodes, primaryColor: string): Content => {
  const rowsDoctoRelacionados: TableCell[][] = [
    [
      {
        text: 'Documentos Relacionados',
        colSpan: 8,
        style: ['tableSubtitleHeader'],
        color: primaryColor,
      },
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  ];
  const headerCells = [
    'UUID',
    'Método de Pago',
    'Moneda',
    'Tipo de Cambio',
    'Num. Parcialidad',
    'Importe Saldo Anterior',
    'Importe Pagado',
    'Importe Saldo Insoluto',
  ];
  const styledHeaderCells = headerCells.map((cell) => ({
    text: cell,
    style: 'tableHeader',
    fillColor: primaryColor,
    margin: [0, 3, 0, 3],
  }));
  rowsDoctoRelacionados.push(styledHeaderCells);

  for (const doctoRelacionado of doctoRelacionados) {
    const values = [
      doctoRelacionado.getAttribute('IdDocumento'),
      doctoRelacionado.getAttribute('MetodoDePagoDR'),
      doctoRelacionado.getAttribute('MonedaDR'),
      doctoRelacionado.getAttribute('TipoCambioDR'),
      doctoRelacionado.getAttribute('NumParcialidad'),
      formatCurrency(doctoRelacionado.getAttribute('ImpSaldoAnt')),
      formatCurrency(doctoRelacionado.getAttribute('ImpPagado')),
      formatCurrency(doctoRelacionado.getAttribute('ImpSaldoInsoluto')),
    ];
    rowsDoctoRelacionados.push(
      values.map((cell) => {
        return {
          style: 'tableSmall',
          text: cell,
          alignment: 'center',
          border: [false, false, false, true],
        };
      }),
    );
  }

  return {
    table: {
      widths: ['30%', 'auto', '10%', '10%', '10%', 'auto', 'auto', 'auto'],
      body: rowsDoctoRelacionados,
      dontBreakRows: true,
    },
    layout: 'conceptosLayout',
  };
};

const usePago10Complement = (
  pago10: XmlNodeInterface,
  currentContent: Content[],
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): void => {
  const pagos = pago10.searchNodes('pago10:Pago');
  if (pagos.length > 0) {
    for (const pago of pagos) {
      const doctoRelacionados = pago.searchNodes('pago10:DoctoRelacionado');
      currentContent.push(
        {
          table: {
            widths: ['10%', '*', '10%', '*'],
            body: [
              [
                {
                  text: 'Información de Pago',
                  style: ['tableSubtitleHeader'],
                  color: primaryColor,
                  colSpan: 4,
                },
                '',
                '',
                '',
              ],
              [
                {
                  style: 'tableSmall',
                  text: 'Fecha:',
                  color: primaryColor,
                  fillColor: bgGrayColor,
                },
                {
                  style: 'tableSmall',
                  text: pago.getAttribute('FechaPago'),
                  fillColor: bgGrayColor,
                },
                {
                  style: 'tableSmall',
                  text: 'Forma Pago:',
                  color: primaryColor,
                  fillColor: bgGrayColor,
                },
                {
                  style: 'tableSmall',
                  text: catalogs.cfdi40FormasPago.findAndReturnTexto(pago.getAttribute('FormaDePagoP')),
                  fillColor: bgGrayColor,
                },
              ],
              [
                {
                  style: 'tableSmall',
                  text: 'Moneda:',
                  color: primaryColor,
                  fillColor: bgGrayColor,
                },
                { style: 'tableSmall', text: pago.getAttribute('MonedaP'), fillColor: bgGrayColor },
                {
                  style: 'tableSmall',
                  text: 'Monto:',
                  color: primaryColor,
                  fillColor: bgGrayColor,
                },
                {
                  style: 'tableSmall',
                  text: formatCurrency(pago.getAttribute('Monto')),
                  fillColor: bgGrayColor,
                },
              ],
              ...(pago.hasAttribute('TipoCambioP')
                ? [
                    [
                      {
                        style: 'tableSmall',
                        text: 'Tipo de Cambio:',
                        color: primaryColor,
                        fillColor: bgGrayColor,
                      },
                      {
                        style: 'tableSmall',
                        text: pago.getAttribute('TipoCambioP'),
                        fillColor: bgGrayColor,
                      },
                      { style: 'tableSmall', text: '', fillColor: bgGrayColor },
                      { style: 'tableSmall', text: '', fillColor: bgGrayColor },
                    ],
                  ]
                : []),
            ],
            dontBreakRows: true,
          },
          layout: 'tableLayout',
        },
        '\n',
        fillDoctoRelacionados(doctoRelacionados, primaryColor),
        '\n',
        '\n',
      );
    }
  }
};

export default usePago10Complement;
