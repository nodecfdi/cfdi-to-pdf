import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { getKeyValueOfCatalog } from '#src/catalogs/catalogs_source';
import { type CatalogsData } from '#src/types';
import { toCurrency } from '#src/utils/currency';

const genericCfdiDetailsInfoContent = (
  comprobante: XmlNodeInterface,
  catalogs: CatalogsData,
  primaryColor: string,
): Content => {
  const detailsInfo: TableCell[][] = [];
  const total = comprobante.getAttribute('Total');
  const moneda = comprobante.getAttribute('Moneda');

  detailsInfo.push([
    {
      text: ['Importe con letra: ', toCurrency(total === '' ? 0 : Number(total), moneda)],
      alignment: 'center',
      colSpan: 4,
      style: ['tableSubtitleHeader'],
    },
    '',
    '',
    '',
  ]);

  const comprobanteInfo: TableCell[] = [
    {
      text: [
        { text: 'Método de Pago: ', color: primaryColor, bold: true },
        {
          text: getKeyValueOfCatalog(
            'cfdi40MetodosPago',
            comprobante.getAttribute('MetodoPago'),
            catalogs,
          ),
        },
      ],
      alignment: 'center',
    },
    {
      text: [
        { text: 'Forma de Pago: ', color: primaryColor, bold: true },
        {
          text: getKeyValueOfCatalog(
            'cfdi40FormasPago',
            comprobante.getAttribute('FormaPago'),
            catalogs,
          ),
        },
      ],
      alignment: 'center',
    },
  ];

  if (moneda === 'MXN') {
    comprobanteInfo.push(
      {
        text: [{ text: 'Moneda: ', color: primaryColor, bold: true }, { text: moneda }],
        colSpan: 2,
        alignment: 'center',
      },
      '',
    );
  } else {
    comprobanteInfo.push(
      {
        text: [{ text: 'Moneda: ', color: primaryColor, bold: true }, { text: moneda }],
        alignment: 'center',
      },
      {
        text: [
          { text: 'Tipo cambio: ', color: primaryColor, bold: true },
          { text: comprobante.getAttribute('TipoCambio') },
        ],
        alignment: 'center',
      },
    );
  }

  detailsInfo.push(comprobanteInfo);

  return {
    table: {
      widths: ['38%', '38%', '12%', '12%'],
      body: detailsInfo,
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  };
};

export default genericCfdiDetailsInfoContent;
