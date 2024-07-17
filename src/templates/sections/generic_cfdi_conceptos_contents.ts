import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import type CfdiData from '#src/cfdi_data';
import { type CatalogsData } from '#src/types';
import { formatCurrency } from '#src/utils';

const genericCfdiConceptosContent = (
  data: CfdiData,
  _catalogs: CatalogsData,
  primaryColor: string,
): Content => {
  const conceptos = data.comprobante().searchNodes('cfdi:Conceptos', 'cfdi:Concepto');

  const rowsConceptos: TableCell[][] = [];

  const headerCells = [
    'Código',
    'Clave Unidad',
    'Descripción',
    'Valor Unitario',
    'Cantidad',
    'Importe',
    'Descuento',
  ];
   const styledHeaderCells = headerCells.map(cell => ({
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
      { text: formatCurrency(concepto.getAttribute('ValorUnitario')), alignment: 'right', ...cellStyle },
      { text: concepto.getAttribute('Cantidad'), alignment: 'center', ...cellStyle },
      { text: formatCurrency(concepto.getAttribute('Importe')), alignment: 'right', ...cellStyle },
      { text: formatCurrency(concepto.getAttribute('Descuento')), alignment: 'right', ...cellStyle },
    ];
    rowsConceptos.push(rowContent);

    const impuestosRow: TableCell[] = [
      {text: '', colSpan: 7 },
      '',
      '',
      '',
      '',
      '',
      '',
    ];
    rowsConceptos.push(impuestosRow);

  }

  return {
    table: {
      widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
      body: rowsConceptos,
    },
    layout: {
      fillColor(i): string | null {
        return i === 0 ? primaryColor : null; // Color de fondo para la fila de encabezados
      },
      hLineWidth: () => 0,
      vLineWidth: () => 0,
    },
  };
};

export default genericCfdiConceptosContent;
