import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import genericCfdiConceptoImpuestosContent from '#src/templates/sections/generic_cfdi_concepto_impuestos_content';
import { type CatalogsData } from '#src/types';
import { formatCurrency } from '#src/utils/currency';

const genericCfdiConceptosContent = (
  comprobante: XmlNodeInterface,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content => {
  const conceptos = comprobante.searchNodes('cfdi:Conceptos', 'cfdi:Concepto');
  const rowsConceptos: TableCell[][] = [];
  const headerCells = [
    'No. Identificación',
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
    fillColor: primaryColor,
    margin: [0, 3, 0, 3],
  }));
  rowsConceptos.push(styledHeaderCells);

  for (const concepto of conceptos) {
    const id = concepto.getAttribute('NoIdentificacion');

    rowsConceptos.push([
      {
        table: {
          widths: ['11%', '10%', '*', '11%', '11%', '11%', '11%'],
          body: [
            [
              { text: id === '' ? '---' : id },
              { text: concepto.getAttribute('ClaveUnidad') },
              { text: concepto.getAttribute('Descripcion') },
              {
                text: formatCurrency(concepto.getAttribute('ValorUnitario')),
                alignment: 'right',
              },
              { text: concepto.getAttribute('Cantidad'), alignment: 'center' },
              { text: formatCurrency(concepto.getAttribute('Importe')), alignment: 'right' },
              {
                text: formatCurrency(concepto.getAttribute('Descuento')),
                alignment: 'right',
              },
            ],
            [
              {
                ...genericCfdiConceptoImpuestosContent(
                  concepto,
                  catalogs,
                  primaryColor,
                  bgGrayColor,
                ),
                colSpan: 7,
              },
            ],
          ],
        },
        layout: 'conceptosLayout',
        colSpan: 7,
        border: [false, false, false, true],
      },
    ]);
  }

  return {
    table: {
      widths: ['11%', '10%', '*', '11%', '11%', '11%', '11%'],
      body: rowsConceptos,
      dontBreakRows: true,
      headerRows: 1,
    },
    layout: 'conceptosLayout',
  };
};

export default genericCfdiConceptosContent;
