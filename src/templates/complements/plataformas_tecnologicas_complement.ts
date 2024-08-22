import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type TableCell } from 'pdfmake/interfaces.js';
import impuestosTrasladadosPlataformasComplement from '#src/templates/complements/impuestos_trasladados_plataformas_complement';
import { formatCurrency } from '#src/utils/currency';

const usePlataformasTecnologicasComplement = (
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
            : formatCurrency(
              plataformasTecnologicas.getAttribute('MonTotalContribucionGubernamental'),
              ),
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
          colSpan: 2
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
      const impuestosTable = impuestosTrasladadosPlataformasComplement(servicio, primaryColor, bgGrayColor);

// Verificar si `impuestosTable` tiene contenido
const impuestosContent = impuestosTable ? [{ ...impuestosTable, colSpan: 10 }] : [{ text: '', colSpan: 10 }];

      const formaPago = servicio.getAttribute('FormaPagoServ');
      const tipoServicio = servicio.getAttribute('TipoDeServ');
      const subTipServicio = servicio.getAttribute('SubTipServ');
      const rfcTerceroAut = servicio.getAttribute('RFCTerceroAutorizado');
      const fechaServicio = servicio.getAttribute('FechaServ');
      const precioSinIVA = servicio.getAttribute('PrecioServSinIVA');

      bodyPlataformasTecnologicas.push([
        { text: formaPago, alignment: 'center'  },
        { text: tipoServicio, alignment: 'center'},
        {text: subTipServicio || '---', alignment: 'center', colSpan: 2},
        {},
        {text: rfcTerceroAut || '---', alignment: 'center', colSpan: 2},
        {},
        { text: fechaServicio, alignment: 'center', colSpan: 2},
        {},
        { text: formatCurrency(precioSinIVA), alignment: 'center', colSpan: 2 },
        {},
      ],
      [
        ...impuestosContent,
      ]
    );
    }
  }

  return bodyPlataformasTecnologicas;
};

export default usePlataformasTecnologicasComplement;
