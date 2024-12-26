import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content } from 'pdfmake/interfaces.js';
import { type CatalogsData } from '../../src/types.js';

const genericRetencionPeriodoContent = (
  periodo: XmlNodeInterface,
  isVersionOne: boolean,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content => {
  return {
    table: {
      widths: ['*', '*', '*'],
      body: [
        [{ text: 'Periodo', style: ['tableSubtitleHeader'], color: primaryColor, colSpan: 3 }, '', ''],
        [
          {
            text: [
              { text: 'Mes Inicial: ', color: primaryColor },
              {
                text: catalogs.retenciones20Periodos.findAndReturnEtiqueta(periodo.getAttribute('MesIni')),
              },
            ],
            alignment: 'center',
            fillColor: bgGrayColor,
          },
          {
            text: [
              { text: 'Mes Final: ', color: primaryColor },
              {
                text: catalogs.retenciones20Periodos.findAndReturnEtiqueta(periodo.getAttribute('MesFin')),
              },
            ],
            alignment: 'center',
            fillColor: bgGrayColor,
          },
          {
            text: [
              { text: 'Ejercicio: ', color: primaryColor },
              { text: periodo.getAttribute(isVersionOne ? 'Ejerc' : 'Ejercicio') },
            ],
            alignment: 'center',
            fillColor: bgGrayColor,
          },
        ],
        [
          { fillColor: bgGrayColor, text: '', border: [false, false, false, true] },
          { fillColor: bgGrayColor, text: '', border: [false, false, false, true] },
          { fillColor: bgGrayColor, text: '', border: [false, false, false, true] },
        ],
      ],
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  };
};

export default genericRetencionPeriodoContent;
