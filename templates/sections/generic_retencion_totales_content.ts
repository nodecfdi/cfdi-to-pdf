import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { type CatalogsData } from '../../src/types.js';
import { formatCurrency } from '../../src/utils/currency.js';

const genericRetencionTotalesContent = (
  totales: XmlNodeInterface,
  isVersionOne: boolean,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content[] => {
  const retencionTotalesContent: Content[] = [];
  const tableTotalesBody: TableCell[][] = [
    [
      {
        text: 'Totales (montos)',
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
        text: [
          { text: 'Total operación: ', color: primaryColor },
          {
            text: formatCurrency(totales.getAttribute(isVersionOne ? 'montoTotOperacion' : 'MontoTotOperacion')),
          },
        ],
        alignment: 'center',
        fillColor: bgGrayColor,
      },
      {
        text: [
          { text: 'Total gravado: ', color: primaryColor },
          {
            text: formatCurrency(totales.getAttribute(isVersionOne ? 'montoTotGrav' : 'MontoTotGrav')),
          },
        ],
        alignment: 'center',
        fillColor: bgGrayColor,
      },
      {
        text: [
          { text: 'Total exento: ', color: primaryColor },
          {
            text: formatCurrency(totales.getAttribute(isVersionOne ? 'montoTotExent' : 'MontoTotExent')),
          },
        ],
        alignment: 'center',
        fillColor: bgGrayColor,
      },
      {
        text: [
          { text: 'Total retenido: ', color: primaryColor },
          {
            text: formatCurrency(totales.getAttribute(isVersionOne ? 'montoTotRet' : 'MontoTotRet')),
          },
        ],
        alignment: 'center',
        fillColor: bgGrayColor,
      },
    ],
  ];

  const utilidadBimestral = totales.getAttribute('UtilidadBimestral');
  const isrCorrespondiente = totales.getAttribute('ISRCorrespondiente');
  if (!isVersionOne && (utilidadBimestral !== '' || isrCorrespondiente !== '')) {
    tableTotalesBody.push([
      {
        text: [
          { text: 'Utilidad Bimestral: ', color: primaryColor },
          {
            text: formatCurrency(totales.getAttribute('UtilidadBimestral')),
          },
        ],
        alignment: 'center',
        fillColor: bgGrayColor,
      },
      {
        text: [
          { text: 'ISR Correspondiente: ', color: primaryColor },
          {
            text: formatCurrency(totales.getAttribute('ISRCorrespondiente')),
          },
        ],
        alignment: 'center',
        fillColor: bgGrayColor,
      },
      '',
      '',
    ]);
  }

  tableTotalesBody.push([
    {
      text: '',
      color: primaryColor,
      colSpan: 4,
      border: [false, true, false, false],
    },
    '',
    '',
    '',
  ]);

  retencionTotalesContent.push({
    table: {
      widths: ['*', '*', '*', '*'],
      body: tableTotalesBody,
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  });

  const impuestosRetenidos = totales.searchNodes('retenciones:ImpRetenidos');
  if (impuestosRetenidos.length > 0) {
    retencionTotalesContent.push(
      { text: '\n' },
      {
        table: {
          widths: ['20%', '20%', '*', '*'],
          body: [
            [
              {
                text: 'Impuestos Retenidos',
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
                text: 'Impuesto',
                style: 'tableHeader',
                alignment: 'center',
                fillColor: primaryColor,
                margin: [0, 3, 0, 3],
              },
              {
                text: 'Base',
                style: 'tableHeader',
                alignment: 'center',
                fillColor: primaryColor,
                margin: [0, 3, 0, 3],
              },
              {
                text: 'Tipo Pago',
                style: 'tableHeader',
                alignment: 'center',
                fillColor: primaryColor,
                margin: [0, 3, 0, 3],
              },
              {
                text: 'Monto',
                style: 'tableHeader',
                alignment: 'center',
                fillColor: primaryColor,
                margin: [0, 3, 0, 3],
              },
            ],
            ...impuestosRetenidos.map((impRetenido) => {
              const baseRet = impRetenido.getAttribute('BaseRet');
              let impuesto = impRetenido.getAttribute(isVersionOne ? 'Impuesto' : 'ImpuestoRet');
              const tipoPago = impRetenido.getAttribute('TipoPagoRet');
              const monto = impRetenido.getAttribute(isVersionOne ? 'montoRet' : 'MontoRet');

              if (isVersionOne && impuesto.length < 3) {
                impuesto = `0${impuesto}`;
              }

              return [
                {
                  text: impuesto === '' ? '---' : catalogs.cfdi40Impuestos.findAndReturnTexto(impuesto),
                  alignment: 'center',
                },
                {
                  text: baseRet === '' ? '---' : formatCurrency(baseRet),
                  alignment: 'center',
                },
                {
                  text: isVersionOne ? tipoPago : catalogs.retenciones20TiposPago.findAndReturnTexto(tipoPago),
                  alignment: 'center',
                },
                {
                  text: formatCurrency(monto),
                  alignment: 'center',
                },
              ];
            }),
          ],
          dontBreakRows: true,
          headerRows: 1,
        },
        layout: 'conceptosLayout',
      },
    );
  }

  return retencionTotalesContent;
};

export default genericRetencionTotalesContent;
