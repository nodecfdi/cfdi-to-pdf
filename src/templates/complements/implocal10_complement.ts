import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type TableCell } from 'pdfmake/interfaces.js';
import { formatCurrency, toNumber } from '#src/utils/currency';

const useImplocal10Complement = (
  impLocal10: XmlNodeInterface,
  primaryColor: string,
  bgGrayColor: string,
  tableTotales: TableCell[][],
  totalesContent: TableCell[],
): void => {
  const totalesSubContent: TableCell[] = [];
  const totalRetencionesLocales = impLocal10.getAttribute('TotaldeRetenciones');
  const totalTrasladosLocales = impLocal10.getAttribute('TotaldeTraslados');

  if (toNumber(totalTrasladosLocales) > 0) {
    tableTotales.push([
      { text: 'Traslados Locales', alignment: 'right' },
      { text: '$', color: primaryColor, alignment: 'center' },
      { text: formatCurrency(totalTrasladosLocales, 'code'), alignment: 'right' },
    ]);
  }

  if (toNumber(totalRetencionesLocales) > 0) {
    tableTotales.push([
      { text: 'Retenciones Locales', alignment: 'right' },
      { text: '$', color: primaryColor, alignment: 'center' },
      { text: `- ${formatCurrency(totalRetencionesLocales, 'code')}`, alignment: 'right' },
    ]);
  }

  const trasladosLocales = impLocal10.searchNodes('implocal:TrasladosLocales');
  const retencionesLocales = impLocal10.searchNodes('implocal:RetencionesLocales');

  const retencionesLocalesTable: TableCell = {
    table: {
      widths: ['40%', '20%', 'auto'],
      body: [
        [
          {
            text: 'Impuestos Locales Retenidos',
            style: ['tableSubtitleHeader'],
            color: primaryColor,
            colSpan: 3,
          },
          '',
          '',
        ],
        ...retencionesLocales.map((retencionLocal) => {
          return [
            {
              text: retencionLocal.getAttribute('ImpLocRetenido'),
              fillColor: bgGrayColor,
            },
            {
              text: [
                {
                  text: 'Tasa: ',
                },
                {
                  text: `${(Number(retencionLocal.getAttribute('TasadeRetencion')) * 1).toString()} %`,
                },
              ],
              fillColor: bgGrayColor,
            },
            {
              text: [{ text: 'Importe: ' }, { text: formatCurrency(retencionLocal.getAttribute('Importe')) }],
              alignment: 'right',
              fillColor: bgGrayColor,
            },
          ];
        }),
      ],
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  };
  const trasladosLocalesTable: TableCell = {
    table: {
      widths: ['40%', '20%', 'auto'],
      body: [
        [
          {
            text: 'Impuestos Locales Trasladados',
            style: ['tableSubtitleHeader'],
            color: primaryColor,
            colSpan: 3,
          },
          '',
          '',
        ],
        ...trasladosLocales.map((trasladoLocal) => {
          return [
            {
              text: trasladoLocal.getAttribute('ImpLocTrasladado'),
              fillColor: bgGrayColor,
            },
            {
              text: [
                {
                  text: 'Tasa: ',
                },
                {
                  text: `${(Number(trasladoLocal.getAttribute('TasadeTraslado')) * 1).toString()} %`,
                },
              ],
              fillColor: bgGrayColor,
            },
            {
              text: [{ text: 'Importe: ' }, { text: formatCurrency(trasladoLocal.getAttribute('Importe')) }],
              alignment: 'right',
              fillColor: bgGrayColor,
            },
          ];
        }),
      ],
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  };

  if (trasladosLocales.length === 0 && retencionesLocales.length === 0) {
    totalesSubContent.push('', '');
  }

  if (trasladosLocales.length === 0 && retencionesLocales.length > 0) {
    totalesSubContent.push(
      {
        ...retencionesLocalesTable,
        colSpan: 2,
      },
      '',
    );
  }

  if (trasladosLocales.length > 0 && retencionesLocales.length === 0) {
    totalesSubContent.push(
      {
        ...trasladosLocalesTable,
        colSpan: 2,
      },
      '',
    );
  }

  if (trasladosLocales.length > 0 && retencionesLocales.length > 0) {
    totalesSubContent.push(trasladosLocalesTable, retencionesLocalesTable);
  }

  totalesSubContent.push({
    table: {
      widths: ['*', '10%', 'auto'],
      body: tableTotales,
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  });

  totalesContent.push(totalesSubContent);
};

export default useImplocal10Complement;
