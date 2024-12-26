import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type ContentTable, type TableCell } from 'pdfmake/interfaces.js';
import { formatCurrency } from '../../src/utils/currency.js';

const impuestosTrasladadosPlataformasComplementTable = (
  servicio: XmlNodeInterface,
  primaryColor: string,
  bgGrayColor: string,
): ContentTable | null => {
  const impuestosTableBody: TableCell[][] = [];

  const impuestosTrasladadosDelServicio = servicio.searchNode(
    'plataformasTecnologicas:ImpuestosTrasladadosdelServicio',
  );
  const contribucionGubernamental = servicio.searchNode('plataformasTecnologicas:ContribucionGubernamental');
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
                text: comisionDelServicio === undefined ? '' : comisionDelServicio.getAttribute('Porcentaje') || '---',
                alignment: 'left',
              },
              {
                text: comisionDelServicio === undefined ? '' : 'Importe:',
                color: primaryColor,
                alignment: 'right',
              },
              {
                text:
                  comisionDelServicio === undefined ? '' : formatCurrency(comisionDelServicio.getAttribute('Importe')),
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

const usePlataformasTecnologicas10Complement = (
  plataformasTecnologicas: XmlNodeInterface,
  primaryColor: string,
  bgGrayColor: string,
): TableCell[][] | null => {
  const bodyPlataformasTecnologicas: TableCell[][] = [];

  bodyPlataformasTecnologicas.push(
    [
      {
        text: 'Servicio Mediante Plataformas Tecnológicas',
        style: 'tableSubtitleHeader',
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
        text: 'Versión',
        style: 'tableHeader',
        fontSize: 6,
        alignment: 'center',
        fillColor: primaryColor,
        margin: [0, 3, 0, 3],
      },
      {
        text: 'Periodicidad',
        style: 'tableHeader',
        fontSize: 6,
        alignment: 'center',
        fillColor: primaryColor,
        margin: [0, 3, 0, 3],
      },
      {
        text: 'Número Servicios',
        fontSize: 5.5,
        style: 'tableHeader',
        alignment: 'center',
        fillColor: primaryColor,
        margin: [0, 3, 0, 3],
      },
      {
        text: 'Subtotal Operaciones',
        style: 'tableHeader',
        fontSize: 5.4,
        alignment: 'center',
        fillColor: primaryColor,
        margin: [0, 3, 0, 3],
      },
      {
        text: 'Total IVA',
        style: 'tableHeader',
        fontSize: 6,
        alignment: 'center',
        fillColor: primaryColor,
        margin: [0, 3, 0, 3],
      },
      {
        text: 'Total IVA Retenido',
        style: 'tableHeader',
        fontSize: 5.4,
        alignment: 'center',
        fillColor: primaryColor,
        margin: [0, 3, 0, 3],
      },
      {
        text: 'Total ISR Retenido',
        style: 'tableHeader',
        fontSize: 5.4,
        alignment: 'center',
        fillColor: primaryColor,
        margin: [0, 3, 0, 3],
      },
      {
        text: 'Diferencia IVA',
        style: 'tableHeader',
        fontSize: 6,
        alignment: 'center',
        fillColor: primaryColor,
        margin: [0, 3, 0, 3],
      },
      {
        text: 'Total Uso de Plataforma',
        style: 'tableHeader',
        fontSize: 5.2,
        alignment: 'center',
        fillColor: primaryColor,
        margin: [0, 3, 0, 3],
      },
      {
        text: 'Total Contribución Gubernamental',
        style: 'tableHeader',
        fontSize: 5.2,
        alignment: 'center',
        fillColor: primaryColor,
        margin: [0, 3, 0, 3],
      },
    ],
    [
      { text: plataformasTecnologicas.getAttribute('Version'), alignment: 'center' },
      { text: plataformasTecnologicas.getAttribute('Periodicidad'), alignment: 'center' },
      { text: plataformasTecnologicas.getAttribute('NumServ'), alignment: 'center' },
      {
        text: formatCurrency(plataformasTecnologicas.getAttribute('MonTotServSIVA')),
        alignment: 'center',
      },
      {
        text: formatCurrency(plataformasTecnologicas.getAttribute('TotalIVATrasladado')),
        alignment: 'center',
      },
      {
        text: formatCurrency(plataformasTecnologicas.getAttribute('TotalIVARetenido')),
        alignment: 'center',
      },
      {
        text: formatCurrency(plataformasTecnologicas.getAttribute('TotalISRRetenido')),
        alignment: 'center',
      },
      {
        text: formatCurrency(plataformasTecnologicas.getAttribute('DifIVAEntregadoPrestServ')),
        alignment: 'center',
      },
      {
        text: formatCurrency(plataformasTecnologicas.getAttribute('MonTotalporUsoPlataforma')),
        alignment: 'center',
      },
      {
        text:
          plataformasTecnologicas.getAttribute('MonTotalContribucionGubernamental') === ''
            ? '---'
            : formatCurrency(plataformasTecnologicas.getAttribute('MonTotalContribucionGubernamental')),
        alignment: 'center',
      },
    ],
  );

  const servicios = plataformasTecnologicas.searchNodes(
    'plataformasTecnologicas:Servicios',
    'plataformasTecnologicas:DetallesDelServicio',
  );
  if (servicios.length > 0) {
    bodyPlataformasTecnologicas.push(
      [
        {
          text: 'Detalles del Servicio',
          style: 'tableSubtitleHeader',
          fontSize: 8,
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
          text: 'Forma de Pago',
          style: 'tableHeader',
          alignment: 'center',
          fillColor: primaryColor,
          margin: [0, 3, 0, 3],
        },
        {
          text: 'Tipo de Servicio',
          style: 'tableHeader',
          alignment: 'center',
          fillColor: primaryColor,
          margin: [0, 3, 0, 3],
        },
        {
          text: 'Subtipo de Servicio',
          style: 'tableHeader',
          alignment: 'center',
          fillColor: primaryColor,
          margin: [0, 3, 0, 3],
          colSpan: 2,
        },
        {},
        {
          text: 'RFC Tercero Autorizado',
          style: 'tableHeader',
          alignment: 'center',
          fillColor: primaryColor,
          margin: [0, 3, 0, 3],
          colSpan: 2,
        },
        {},
        {
          text: 'Fecha del Servicio',
          style: 'tableHeader',
          alignment: 'center',
          fillColor: primaryColor,
          margin: [0, 3, 0, 3],
          colSpan: 2,
        },
        {},
        {
          text: 'Precio Sin IVA',
          style: 'tableHeader',
          alignment: 'center',
          fillColor: primaryColor,
          margin: [0, 3, 0, 3],
          colSpan: 2,
        },
        {},
      ],
    );

    for (const servicio of servicios) {
      const impuestosTable = impuestosTrasladadosPlataformasComplementTable(servicio, primaryColor, bgGrayColor);

      const impuestosContent = impuestosTable ? [{ ...impuestosTable, colSpan: 10 }] : [{ text: '', colSpan: 10 }];

      const formaPago = servicio.getAttribute('FormaPagoServ');
      const tipoServicio = servicio.getAttribute('TipoDeServ');
      const subTipServicio = servicio.getAttribute('SubTipServ');
      const rfcTerceroAut = servicio.getAttribute('RFCTerceroAutorizado');
      const fechaServicio = servicio.getAttribute('FechaServ');
      const precioSinIVA = servicio.getAttribute('PrecioServSinIVA');

      bodyPlataformasTecnologicas.push(
        [
          { text: formaPago, alignment: 'center' },
          { text: tipoServicio, alignment: 'center' },
          { text: subTipServicio || '---', alignment: 'center', colSpan: 2 },
          {},
          { text: rfcTerceroAut || '---', alignment: 'center', colSpan: 2 },
          {},
          { text: fechaServicio, alignment: 'center', colSpan: 2 },
          {},
          { text: formatCurrency(precioSinIVA), alignment: 'center', colSpan: 2 },
          {},
        ],
        [...impuestosContent],
      );
    }
  }

  return bodyPlataformasTecnologicas;
};

export default usePlataformasTecnologicas10Complement;
