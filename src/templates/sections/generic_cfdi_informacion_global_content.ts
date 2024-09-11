import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content } from 'pdfmake/interfaces.js';
import { getKeyValueOfCatalog } from '#src/catalogs/catalogs_source';
import { type CatalogsData } from '#src/types';

const genericCfdiInformacionGlobalContent = (
  informacionGlobal: XmlNodeInterface,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content => {
  return {
    table: {
      widths: ['*', '*', '*'],
      body: [
        [
          {
            text: 'Información Global',
            style: ['tableSubtitleHeader'],
            color: primaryColor,
            colSpan: 3,
          },
          '',
          '',
        ],
        [
          {
            fillColor: bgGrayColor,
            text: [
              { text: 'Periodicidad: ', color: primaryColor, bold: true },
              {
                text: getKeyValueOfCatalog(
                  'cfdi40Periodicidades',
                  informacionGlobal.getAttribute('Periodicidad'),
                  catalogs,
                ),
              },
            ],
          },
          {
            fillColor: bgGrayColor,
            text: [
              { text: 'Meses: ', color: primaryColor, bold: true },
              {
                text: getKeyValueOfCatalog(
                  'cfdi40Meses',
                  informacionGlobal.getAttribute('Meses'),
                  catalogs,
                ),
              },
            ],
          },
          {
            fillColor: bgGrayColor,
            text: [
              { text: 'Año: ', color: primaryColor, bold: true },
              { text: informacionGlobal.getAttribute('Año') },
            ],
          },
        ],
        [
          { fillColor: bgGrayColor, text: '', border: [false, false, false, true] },
          { fillColor: bgGrayColor, text: '', border: [false, false, false, true] },
          { fillColor: bgGrayColor, text: '', border: [false, false, false, true] },
        ],
      ],
    },
    layout: 'tableLayout',
  };
};

export default genericCfdiInformacionGlobalContent;
