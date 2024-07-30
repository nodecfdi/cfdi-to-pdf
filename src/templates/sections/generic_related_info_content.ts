import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content } from 'pdfmake/interfaces.js';
import { getValueOfCatalog } from '#src/catalogs/catalogs_source';
import { type CatalogsData } from '#src/types';
import { formatCurrency, toCurrency } from '#src/utils/currency';

const genericRelatedInfoContent = (
  comprobante: XmlNodeInterface,
  catalogs: CatalogsData,
  primaryColor: string,
): Content => {
  const totalImpuestosTrasladados = comprobante.searchAttribute(
    'cfdi:Impuestos',
    'TotalImpuestosTrasladados',
  );
  const totalImpuestosRetenidos = comprobante.searchAttribute(
    'cfdi:Impuestos',
    'TotalImpuestosRetenidos',
  );

  return {
    table: {
      widths: ['*', 'auto', 'auto'],
      body: [
        [
          { text: 'Método de pago', alignment: 'left', color: primaryColor, bold: true },
          'Subtotal:',
          { text: formatCurrency(comprobante.getAttribute('SubTotal')) },
        ],
        [
          {
            text: getValueOfCatalog(
              'cfdi40MetodosPago',
              comprobante.getAttribute('MetodoPago'),
              catalogs,
            ),
            alignment: 'left',
          },
          'Descuento:',
          formatCurrency(comprobante.getAttribute('Descuento')),
        ],
        [
          { text: 'Forma de Pago', alignment: 'left', color: primaryColor, bold: true },
          'IVA Trasladado:',
          formatCurrency(totalImpuestosTrasladados),
        ],
        [
          {
            text: getValueOfCatalog(
              'cfdi40FormasPago',
              comprobante.getAttribute('FormaPago'),
              catalogs,
            ),
            alignment: 'left',
          },
          'ISR Retenido:',
          formatCurrency(totalImpuestosRetenidos),
        ],
        [
          {
            text: `Importe con letra: ${toCurrency(
              Number.parseFloat(comprobante.getAttribute('Total') || '0'),
              comprobante.getAttribute('Moneda'),
            )}`,
            fontSize: 7.5,
            alignment: 'center',
            margin: [0, 4, 0, 0],
            style: 'tableSubtitleHeader',
          },
          {
            text: `Total: ${formatCurrency(comprobante.getAttribute('Total'))}`,
            fontSize: 11,
            style: 'tableHeader',
            fillColor: primaryColor,
            colSpan: 2,
            alignment: 'center',
            margin: [0, 2, 0, 0],
          },
        ],
      ],
    },
    layout: 'tableLayout',
  };
};

export default genericRelatedInfoContent;
