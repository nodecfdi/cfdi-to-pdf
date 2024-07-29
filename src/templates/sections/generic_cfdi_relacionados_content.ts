import { type Content } from 'pdfmake/interfaces.js';
import { getKeyValueOfCatalog } from '#src/catalogs/catalogs_source';
import type CfdiData from '#src/cfdi_data';
import { type CatalogsData } from '#src/types';

const genericCfdiRelacionadosContent = (
  data: CfdiData,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content => {
  const relatedInfoAndImport: Content[] = [];

  const createTable = (tipoRelacion: string, uuids: string[]): Content => {
    return {
      fontSize: 7,
      margin: [0, 5, 0, 0],
      table: {
        widths: ['*', '*'],
        body: [
          [
            {
              text: 'CFDI relacionados',
              colSpan: 2,
              alignment: 'left',
              color: primaryColor,
              style: 'tableSubtitleHeader',
            },
            {},
          ],
          [
            {
              text: 'Tipo de relación',
              alignment: 'left',
              fillColor: bgGrayColor,
              color: primaryColor,
            },
            {
              text: 'UUID',
              alignment: 'left',
              fillColor: bgGrayColor,
              color: primaryColor,
            },
          ],
          [
            {
              text: tipoRelacion,
              alignment: 'left',
              fillColor: bgGrayColor,
            },
            {
              text: uuids.join('\n'),
              alignment: 'left',
              fillColor: bgGrayColor,
            },
          ],
          [
            {
              text: '',
              fillColor: primaryColor,
              colSpan: 2,
            },
          ],
        ],
      },
      layout: 'tableLayout',
    };
  };

  if (data.comprobante().getAttribute('Version') === '3.3') {
    const relacionados = data.comprobante().searchNode('cfdi:CfdiRelacionados');
    if (relacionados) {
      const uuidsArray = relacionados.searchNodes('cfdi:CfdiRelacionado').map((relacionado) => {
        return relacionado.getAttribute('UUID');
      });

      const tipoRelacion = getKeyValueOfCatalog(
        'cfdi40TiposRelaciones',
        relacionados.getAttribute('TipoRelacion'),
        catalogs,
      );

      relatedInfoAndImport.push(createTable(tipoRelacion, uuidsArray));
    }
  } else {
    const relacionados = data.comprobante().searchNodes('cfdi:CfdiRelacionados');
    if (relacionados.length > 0) {
      for (const relacionadosNode of relacionados) {
        const uuidsArray = relacionadosNode
          .searchNodes('cfdi:CfdiRelacionado')
          .map((relacionado) => {
            return relacionado.getAttribute('UUID');
          });

        const tipoRelacion = getKeyValueOfCatalog(
          'cfdi40TiposRelaciones',
          relacionadosNode.getAttribute('TipoRelacion'),
          catalogs,
        );

        relatedInfoAndImport.push(createTable(tipoRelacion, uuidsArray));
      }
    }
  }

  if (relatedInfoAndImport.length === 0) {
    return {
      text: '',
    };
  }

  return {
    table: {
      widths: ['*'],
      body: relatedInfoAndImport.map((content) => [content]),
    },
    layout: 'tableLayout',
  };
};

export default genericCfdiRelacionadosContent;
