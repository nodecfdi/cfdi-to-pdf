import { type Column, type Content} from 'pdfmake/interfaces.js';
import { getValueOfCatalog } from '#src/catalogs/catalogs_source';
import type CfdiData from '#src/cfdi_data';
import { type CatalogsData } from '#src/types';
import { formatCurrency, toCurrency } from '#src/utils';

const genericRelatedInfoContent = (
  data: CfdiData,
  _catalogs: CatalogsData,
  primaryColor: string,
): Content => {
  const totalImpuestosTrasladados = data.comprobante().searchAttribute(
    'cfdi:Impuestos',
    'TotalImpuestosTrasladados',
  );
  const totalImpuestosRetenidos = data.comprobante().searchAttribute(
    'cfdi:Impuestos',
    'TotalImpuestosRetenidos',
  );
  const contentColumns: Column[] = [];


  if (data.comprobante().getAttribute('TipoDeComprobante') !== 'P') {
    contentColumns.push({
      width: '*',
      alignment: 'right',
      style: 'tableContent',
      table: {
        widths: ['*', 'auto', 'auto'],
        body: [
          [{text: 'Método de pago', alignment:'left', color: primaryColor, bold: true}, 'Subtotal:', { text: formatCurrency(data.comprobante().getAttribute('SubTotal'))}],
          [{
            text: getValueOfCatalog('cfdi40MetodosPago', data.comprobante().getAttribute('MetodoPago'), _catalogs), alignment: 'left'
          }, 'Descuento:', formatCurrency(data.comprobante().getAttribute('Descuento'))],
          [{text: 'Forma de Pago', alignment: 'left', color: primaryColor, bold: true}, 'IVA Trasladado:', formatCurrency(totalImpuestosTrasladados)],
          [{
            text: getValueOfCatalog('cfdi40FormasPago', data.comprobante().getAttribute('FormaPago'), _catalogs), alignment: 'left'
          }
            , 'ISR Retenido:', formatCurrency(totalImpuestosRetenidos)],
          [{text: `Importe con letra: ${  toCurrency(
            Number.parseFloat(data.comprobante().getAttribute('Total') || '0'),
            data.comprobante().getAttribute('Moneda'),
          )}`, fontSize: 7.5, alignment: 'center', margin: [ 0, 4, 0, 0 ], style: 'tableSubtitleHeader'},
            {
              text: `Total: ${  formatCurrency(data.comprobante().getAttribute('Total'))}`,
              fontSize: 11,
              style: 'tableHeader',
              fillColor: primaryColor,
              colSpan: 2,
              alignment: 'center',
              margin: [ 0, 2, 0, 0 ]
            },
          ],
        ],
      },
      layout: 'noBorders',
    });
  }

  return {
    columns: contentColumns,
  };
};

export default genericRelatedInfoContent;
