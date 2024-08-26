import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type ContentTable, type TableCell } from 'pdfmake/interfaces.js';
import { formatCurrency } from '#src/utils/currency';

const impuestosTrasladadosPlataformasComplementTable = (
  servicio: XmlNodeInterface,
  primaryColor: string,
  bgGrayColor: string,
): ContentTable | null => {
  const impuestosTableBody: TableCell[][] = [];

  const impuestosTrasladadosDelServicio = servicio.searchNode(
    'plataformasTecnologicas:ImpuestosTrasladadosdelServicio',
  );
  const contribucionGubernamental = servicio.searchNode(
    'plataformasTecnologicas:ContribucionGubernamental',
  );
  const comisionDelServicio = servicio.searchNode('plataformasTecnologicas:ComisionDelServicio');

  if (impuestosTrasladadosDelServicio) {
    impuestosTableBody.push([
      {
        table: {
          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
          body: [
            [
              {
                text: 'Impuestos Trasladados del Servicio',
                colSpan: 10,
                alignment: 'left',
                color: primaryColor,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: 'Impuesto base:',
                color: primaryColor,
              },
              {
                text: formatCurrency(impuestosTrasladadosDelServicio.getAttribute('Base')),
                alignment: 'left',
              },
              {
                text: 'Impuesto',
                color: primaryColor,
              },
              {
                text: impuestosTrasladadosDelServicio.getAttribute('Impuesto'),
                alignment: 'left',
              },
              {
                text: 'Tipo factor:',
                color: primaryColor,
              },
              {
                text: impuestosTrasladadosDelServicio.getAttribute('TipoFactor'),
                alignment: 'left',
              },
              {
                text: 'Tasa o cuota:',
                color: primaryColor,
              },
              {
                text: impuestosTrasladadosDelServicio.getAttribute('TasaCuota'),
                alignment: 'left',
              },
              {
                text: 'Importe',
                color: primaryColor,
              },
              {
                text: formatCurrency(impuestosTrasladadosDelServicio.getAttribute('Importe')),
                alignment: 'left',
              },
            ],
          ],
        },
        layout: 'conceptosLayout',
        colSpan: 10,
        fillColor: bgGrayColor,
      },
    ]);
  }

  if (comisionDelServicio !== undefined || contribucionGubernamental !== undefined) {
    impuestosTableBody.push([
      {
        table: {
          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto'],
          body: [
            [
              {
                text: comisionDelServicio === undefined ? '' : 'Comisión del Servicio',
                colSpan: 6,
                alignment: 'left',
                color: primaryColor,
              },
              {},
              {},
              {},
              {},
              {},
              {
                text: contribucionGubernamental === undefined ? '' : 'Contribución Gubernamental',
                colSpan: 4,
                alignment: 'right',
                color: primaryColor,
              },
              {},
              {},
              {},
            ],
            [
              {
                text: comisionDelServicio === undefined ? '' : 'Base:',
                color: primaryColor,
                alignment: 'right',
              },
              {
                text:
                  comisionDelServicio === undefined
                    ? ''
                    : formatCurrency(comisionDelServicio.getAttribute('Base')) || '---',
                alignment: 'left',
              },
              {
                text: comisionDelServicio === undefined ? '' : 'Porcentaje:',
                color: primaryColor,
                alignment: 'right',
              },
              {
                text:
                  comisionDelServicio === undefined
                    ? ''
                    : comisionDelServicio.getAttribute('Porcentaje') || '---',
                alignment: 'left',
              },
              {
                text: comisionDelServicio === undefined ? '' : 'Importe:',
                color: primaryColor,
                alignment: 'right',
              },
              {
                text:
                  comisionDelServicio === undefined
                    ? ''
                    : formatCurrency(comisionDelServicio.getAttribute('Importe')),
                alignment: 'left',
              },
              {
                text: contribucionGubernamental === undefined ? '' : 'Estado:',
                color: primaryColor,
                alignment: 'right',
              },
              {
                text:
                  contribucionGubernamental === undefined
                    ? ''
                    : contribucionGubernamental.getAttribute('EntidadDondePagaLaContribucion'),
                alignment: 'left',
              },
              {
                text: contribucionGubernamental === undefined ? '' : 'Importe:',
                color: primaryColor,
                alignment: 'right',
              },
              {
                text:
                  contribucionGubernamental === undefined
                    ? ''
                    : formatCurrency(contribucionGubernamental.getAttribute('ImpContrib')),
                alignment: 'left',
              },
            ],
          ],
        },
        layout: 'conceptosLayout',
        colSpan: 10,
        fillColor: bgGrayColor,
      },
    ]);
  }

  if (
    impuestosTrasladadosDelServicio !== undefined ||
    contribucionGubernamental !== undefined ||
    comisionDelServicio !== undefined
  ) {
    impuestosTableBody.push([
      {
        text: '',
        color: primaryColor,
        colSpan: 10,
        border: [false, true, false, false],
      },
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
  }

  if (impuestosTableBody.length === 0) {
    return null;
  }

  return {
    table: {
      widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
      body: impuestosTableBody,
    },
    layout: 'conceptosLayout',
  };
};

export default impuestosTrasladadosPlataformasComplementTable;
