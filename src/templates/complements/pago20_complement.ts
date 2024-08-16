import { type XmlNodes } from '@nodecfdi/cfdi-core';
import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { getValueOfCatalog } from '#src/catalogs/catalogs_source';
import { type CatalogsData } from '#src/types';
import breakCharacters from '#src/utils/break_characters';
import { formatCurrency } from '#src/utils/currency';

const generateRelatedDocsContent = (
  doctoRelacionados: XmlNodes,
  primaryColor: string,
): TableCell[][] => {
  const relatedDocsCells = doctoRelacionados.map<TableCell[]>((doc) => {
    return [
      doc.getAttribute('IdDocumento'),
      `${doc.getAttribute('Serie')} ${doc.getAttribute('Folio')}`,
      doc.getAttribute('MonedaDR'),
      doc.getAttribute('EquivalenciaDR'),
      doc.getAttribute('NumParcialidad'),
      { text: formatCurrency(doc.getAttribute('ImpSaldoAnt')), alignment: 'right' },
      { text: formatCurrency(doc.getAttribute('ImpPagado')), alignment: 'right' },
      { text: formatCurrency(doc.getAttribute('ImpSaldoInsoluto')), alignment: 'right' },
    ];
  });
  relatedDocsCells.unshift(
    [
      'UUID',
      'Serie | Folio',
      'Moneda',
      'Tipo de Cambio',
      'Num. Parcialidad',
      'Importe Saldo Anterior',
      'Importe Pagado',
      'Importe Saldo Insoluto',
    ].map((cell) => {
      return {
        text: cell,
        border: [false, false, false, true],
      };
    }),
  );
  relatedDocsCells.unshift([
    {
      text: 'DOCUMENTOS RELACIONADOS',
      color: primaryColor,
      colSpan: 8,
      alignment: 'center',
      border: [false, false, false, true],
    },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ]);

  return relatedDocsCells;
};

const fillTableTotales = (
  totales: XmlNodeInterface,
  primaryColor: string,
  bgGrayColor: string,
): TableCell => {
  return {
    table: {
      widths: ['*', '*', '*', '*', '*', '*'],
      body: [
        [{ text: 'Totales', color: primaryColor, bold: true, colSpan: 6 }, '', '', '', '', ''],
        [
          {
            table: {
              widths: ['*', '*', '*', '*'],
              body: [
                [
                  {
                    text: 'Monto Total Pagos:',
                    color: primaryColor,
                  },
                  {
                    text: formatCurrency(totales.getAttribute('MontoTotalPagos')),
                    alignment: 'center',
                  },
                  {
                    text: 'Traslados Base IVA Exento:',
                    color: primaryColor,
                  },
                  {
                    text: formatCurrency(totales.getAttribute('TotalTrasladosBaseIVAExento')),
                    alignment: 'center',
                  },
                ],
              ],
              dontBreakRows: true,
            },
            layout: 'tableLayout',
            colSpan: 6,
            fillColor: bgGrayColor,
          },
          '',
          '',
          '',
          '',
          '',
        ],
        [
          {
            text: 'Traslados Base IVA 16:',
            color: primaryColor,
            fillColor: bgGrayColor,
          },
          {
            text: formatCurrency(totales.getAttribute('TotalTrasladosBaseIVA16')),
            alignment: 'center',
            fillColor: bgGrayColor,
          },
          {
            text: 'Traslados Base IVA 8:',
            color: primaryColor,
            fillColor: bgGrayColor,
          },
          {
            text: formatCurrency(totales.getAttribute('TotalTrasladosBaseIVA8')),
            alignment: 'center',
            fillColor: bgGrayColor,
          },
          {
            text: 'Traslados Base IVA 0:',
            color: primaryColor,
            fillColor: bgGrayColor,
          },
          {
            text: formatCurrency(totales.getAttribute('TotalTrasladosBaseIVA0')),
            alignment: 'center',
            fillColor: bgGrayColor,
          },
        ],
        [
          {
            text: 'Traslados IVA 16:',
            color: primaryColor,
            fillColor: bgGrayColor,
          },
          {
            text: formatCurrency(totales.getAttribute('TotalTrasladosImpuestoIVA16')),
            alignment: 'center',
            fillColor: bgGrayColor,
          },
          {
            text: 'Traslados IVA 8',
            color: primaryColor,
            fillColor: bgGrayColor,
          },
          {
            text: formatCurrency(totales.getAttribute('TotalTrasladosImpuestoIVA8')),
            alignment: 'center',
            fillColor: bgGrayColor,
          },
          {
            text: 'Traslados IVA 0',
            color: primaryColor,
            fillColor: bgGrayColor,
          },
          {
            text: formatCurrency(totales.getAttribute('TotalTrasladosImpuestoIVA0')),
            alignment: 'center',
            fillColor: bgGrayColor,
          },
        ],
        [
          {
            text: 'Retenciones IVA',
            color: primaryColor,
            fillColor: bgGrayColor,
          },
          {
            text: formatCurrency(totales.getAttribute('TotalRetencionesIVA')),
            alignment: 'center',
            fillColor: bgGrayColor,
          },
          {
            text: 'Retenciones ISR',
            color: primaryColor,
            fillColor: bgGrayColor,
          },
          {
            text: formatCurrency(totales.getAttribute('TotalRetencionesISR')),
            alignment: 'center',
            fillColor: bgGrayColor,
          },
          {
            text: 'Retenciones IEPS',
            color: primaryColor,
            fillColor: bgGrayColor,
          },
          {
            text: formatCurrency(totales.getAttribute('TotalRetencionesIEPS')),
            alignment: 'center',
            fillColor: bgGrayColor,
          },
        ],
      ],
      dontBreakRows: true,
    },
    layout: 'tableLayout',
    border: [false, false, false, true],
  };
};

const usePago20Complement = (
  pago20: XmlNodeInterface,
  currentContent: Content[],
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): void => {
  const totales = pago20.searchNode('pago20:Totales');
  const pagos = pago20.searchNodes('pago20:Pago');

  if (pagos.length > 0 && totales !== undefined) {
    currentContent.push(
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: 'Complemento pago',
                style: 'tableSubtitleHeader',
                color: primaryColor,
                border: [false, true, false, false],
              },
            ],
            [
              {
                table: {
                  widths: ['*'],
                  body: pagos.flatMap((pago) => {
                    const doctoRelacionados = pago.searchNodes('pago20:DoctoRelacionado');

                    const tablePagosBody: TableCell[] = [];
                    tablePagosBody.push(
                      [{ text: '', border: [false, true, false, false] }],
                      [
                        {
                          table: {
                            widths: ['12%', '16%', '12%', '*', '12%', '18%'],
                            body: [
                              [
                                { text: 'Fecha pago:', color: primaryColor, alignment: 'center' },
                                {
                                  text: pago.getAttribute('FechaPago'),
                                  alignment: 'center',
                                },
                                {
                                  text: 'Forma de pago:',
                                  color: primaryColor,
                                  alignment: 'center',
                                },
                                {
                                  text: getValueOfCatalog(
                                    'cfdi40FormasPago',
                                    pago.getAttribute('FormaDePagoP'),
                                    catalogs,
                                  ),
                                  alignment: 'center',
                                },
                                { text: 'Monto:', color: primaryColor, alignment: 'center' },
                                {
                                  text: formatCurrency(pago.getAttribute('Monto')),
                                  alignment: 'center',
                                },
                              ],
                              [
                                { text: 'Moneda:', color: primaryColor, alignment: 'center' },
                                { text: pago.getAttribute('MonedaP'), alignment: 'center' },
                                { text: 'Tipo cambio:', color: primaryColor, alignment: 'center' },
                                { text: pago.getAttribute('TipoCambioP'), alignment: 'center' },
                                {
                                  text: pago.hasAttribute('NumOperacion') ? 'Num. Operación:' : '',
                                  color: primaryColor,
                                  alignment: 'center',
                                },
                                {
                                  text: pago.hasAttribute('NumOperacion')
                                    ? pago.getAttribute('NumOperacion')
                                    : '',
                                  alignment: 'center',
                                },
                              ],
                              ...(pago.hasAttribute('NomBancoOrdExt')
                                ? [
                                    [
                                      {
                                        text: [
                                          { text: 'Nombre Banco Ordenante: ', color: primaryColor },
                                          { text: pago.getAttribute('NomBancoOrdExt') },
                                        ],
                                        alignment: 'center',
                                        colSpan: 6,
                                      },
                                      '',
                                      '',
                                      '',
                                      '',
                                      '',
                                    ],
                                  ]
                                : []),
                              ...(pago.hasAttribute('TipoCadPago')
                                ? [
                                    [
                                      {
                                        table: {
                                          widths: ['*', '*'],
                                          body: [
                                            [
                                              {
                                                text: [
                                                  {
                                                    text: 'Tipo cadena pago: ',
                                                    color: primaryColor,
                                                  },
                                                  {
                                                    text: getValueOfCatalog(
                                                      'pagosTiposCadenaPago',
                                                      pago.getAttribute('TipoCadPago'),
                                                      catalogs,
                                                    ),
                                                  },
                                                ],
                                              },
                                              {
                                                text: [
                                                  { text: 'Cadena pago', color: primaryColor },
                                                  {
                                                    text: breakCharacters(
                                                      pago.getAttribute('CadPago'),
                                                    ),
                                                  },
                                                ],
                                              },
                                            ],
                                            [
                                              { text: 'Certificado Pago', color: primaryColor },
                                              { text: 'Sello Pago', color: primaryColor },
                                            ],
                                            [
                                              {
                                                text: breakCharacters(
                                                  pago.getAttribute('CertPago'),
                                                ),
                                              },
                                              {
                                                text: breakCharacters(
                                                  pago.getAttribute('SelloPago'),
                                                ),
                                              },
                                            ],
                                          ],
                                          dontBreaksRows: true,
                                        },
                                        layout: 'tableLayout',
                                        colSpan: 6,
                                      },
                                      '',
                                      '',
                                      '',
                                      '',
                                      '',
                                    ],
                                  ]
                                : []),
                              [
                                {
                                  style: 'tableSmall',
                                  table: {
                                    widths: ['32%', '8%', '8%', '8%', '8%', '12%', '12%', '12%'],
                                    body: generateRelatedDocsContent(
                                      doctoRelacionados,
                                      primaryColor,
                                    ),
                                    dontBreakRows: true,
                                  },
                                  layout: 'conceptosLayout',
                                  fillColor: bgGrayColor,
                                  colSpan: 6,
                                },
                                '',
                                '',
                                '',
                                '',
                                '',
                              ],
                            ],
                          },
                          layout: 'tableLayout',
                        },
                      ],
                      [{ text: '', border: [false, false, false, true] }],
                    );

                    return tablePagosBody;
                  }),
                  dontBreakRows: true,
                },
                layout: 'conceptosLayout',
              },
            ],
            [fillTableTotales(totales, primaryColor, bgGrayColor)],
          ],
        },
        layout: 'tableLayout',
      },
      '\n',
      '\n',
    );
  }
};

export default usePago20Complement;
