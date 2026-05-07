import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { type CatalogsData } from '../../src/types.js';
import { formatCurrency, toNumber } from '../../src/utils/currency.js';

const nomina12OtrosPagosContent = (
  otrosPagos: XmlNodeInterface,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content[] => {
  const otroPagoList = otrosPagos.searchNodes('nomina12:OtroPago');

  const headerCells = ['Tipo otro pago', 'Clave', 'Concepto', 'Importe'].map((cell) => ({
    text: cell,
    style: 'tableHeader',
    fillColor: primaryColor,
    margin: [0, 3, 0, 3] as [number, number, number, number],
  }));

  const rows: TableCell[][] = [headerCells];

  let totalOtrosPagos = 0;
  let subsidioCausado: string | undefined;
  const compensaciones: { saldoAFavor: string; anio: string; remanente: string }[] = [];

  for (const otroPago of otroPagoList) {
    const importe = toNumber(otroPago.getAttribute('Importe'));
    totalOtrosPagos += importe;
    rows.push([
      {
        text: catalogs.nominaTiposOtrosPagos.findAndReturnTexto(otroPago.getAttribute('TipoOtroPago')),
        fillColor: bgGrayColor,
      },
      { text: otroPago.getAttribute('Clave'), alignment: 'center', fillColor: bgGrayColor },
      { text: otroPago.getAttribute('Concepto'), fillColor: bgGrayColor },
      { text: formatCurrency(otroPago.getAttribute('Importe')), alignment: 'right', fillColor: bgGrayColor },
    ]);

    const subsidio = otroPago.searchNode('nomina12:SubsidioAlEmpleo');
    if (subsidio?.hasAttribute('SubsidioCausado')) {
      subsidioCausado = subsidio.getAttribute('SubsidioCausado');
    }

    const compensacion = otroPago.searchNode('nomina12:CompensacionSaldosAFavor');
    if (compensacion) {
      compensaciones.push({
        saldoAFavor: compensacion.getAttribute('SaldoAFavor'),
        anio: compensacion.getAttribute('Año'),
        remanente: compensacion.getAttribute('RemanenteSalFav'),
      });
    }
  }

  rows.push([
    {
      text: 'Total Otros Pagos',
      colSpan: 3,
      alignment: 'right',
      bold: true,
      color: primaryColor,
      border: [false, true, false, false],
    },
    {},
    {},
    {
      text: formatCurrency(totalOtrosPagos),
      alignment: 'right',
      bold: true,
      border: [false, true, false, false],
    },
  ]);

  const otrosPagosTable: Content = {
    table: {
      widths: ['*', '8%', '30%', '15%'],
      body: rows,
      dontBreakRows: true,
      headerRows: 1,
    },
    layout: 'conceptosLayout',
  };

  const blocks: Content[] = [
    {
      stack: [{ text: 'Otros pagos', style: ['tableSubtitleHeader'], color: primaryColor }, otrosPagosTable],
      unbreakable: true,
    },
  ];

  if (subsidioCausado !== undefined) {
    const subsidioTable: Content = {
      table: {
        widths: ['*'],
        body: [
          [{ text: 'Subsidio causado', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' }],
          [{ text: formatCurrency(subsidioCausado), alignment: 'right', fillColor: bgGrayColor }],
        ],
        dontBreakRows: true,
      },
      layout: 'tableLayout',
    };

    blocks.push({
      stack: [
        {
          text: 'Subsidio al empleo',
          style: ['tableSubtitleHeader'],
          color: primaryColor,
          margin: [0, 4, 0, 0] as [number, number, number, number],
        },
        subsidioTable,
      ],
      unbreakable: true,
    });
  }

  if (compensaciones.length > 0) {
    const compensacionRows: TableCell[][] = [
      [
        { text: 'Saldo a favor', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
        { text: 'Año', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
        { text: 'Remanente saldo a favor', style: 'tableHeader', fillColor: primaryColor, alignment: 'center' },
      ],
      ...compensaciones.map<TableCell[]>((c) => [
        { text: formatCurrency(c.saldoAFavor), alignment: 'right', fillColor: bgGrayColor },
        { text: c.anio, alignment: 'center', fillColor: bgGrayColor },
        { text: formatCurrency(c.remanente), alignment: 'right', fillColor: bgGrayColor },
      ]),
    ];

    const compensacionTable: Content = {
      table: {
        widths: ['*', '*', '*'],
        body: compensacionRows,
        dontBreakRows: true,
      },
      layout: 'tableLayout',
    };

    blocks.push({
      stack: [
        {
          text: 'Compensación saldos a favor',
          style: ['tableSubtitleHeader'],
          color: primaryColor,
          margin: [0, 4, 0, 0] as [number, number, number, number],
        },
        compensacionTable,
      ],
      unbreakable: true,
    });
  }

  return blocks;
};

export default nomina12OtrosPagosContent;
