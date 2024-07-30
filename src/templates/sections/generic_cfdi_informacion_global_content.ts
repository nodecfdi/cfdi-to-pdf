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
          { text: 'Información Global', style: ['tableSubtitleHeader'], color: primaryColor },
          '',
          '',
        ],
        [
          {
            fillColor: bgGrayColor,
            text: [
              { text: 'Periodicidad: ', color: primaryColor },
              {
                text: getKeyValueOfCatalog(
                  'cfdi40Periodicidades',
                  informacionGlobal.getAttribute('Periodicidad'),
                  catalogs,
                ),
              },
            ],
            border: [false, false, false, true],
          },
          {
            fillColor: bgGrayColor,
            text: [
              { text: 'Meses: ', color: primaryColor },
              {
                text: getKeyValueOfCatalog(
                  'cfdi40Meses',
                  informacionGlobal.getAttribute('Meses'),
                  catalogs,
                ),
              },
            ],
            border: [false, false, false, true],
          },
          {
            fillColor: bgGrayColor,
            text: [
              { text: 'Año: ', color: primaryColor },
              { text: informacionGlobal.getAttribute('Año') },
            ],
            border: [false, false, false, true],
          },
        ],
      ],
    },
    layout: 'tableLayout',
  };
};

export default genericCfdiInformacionGlobalContent;
