import { XmlNodes } from '@nodecfdi/cfdi-core';
import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content } from 'pdfmake/interfaces.js';
import { getKeyValueOfCatalog } from '#src/catalogs/catalogs_source';
import { type CatalogsData } from '#src/types';

const genericCfdiRelacionadosContent = (
  relacionados: XmlNodeInterface | XmlNodes,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content => {
  const relatedInfoAndImport: { tipoRelacion: string; uuids: string[] }[] = [];

  const pushElementFromRelatedNode = (relatedNode: XmlNodeInterface): void => {
    const uuidsArray = relatedNode.searchNodes('cfdi:CfdiRelacionado').map((relacionado) => {
      return relacionado.getAttribute('UUID');
    });

    const tipoRelacion = getKeyValueOfCatalog(
      'cfdi40TiposRelaciones',
      relatedNode.getAttribute('TipoRelacion'),
      catalogs,
    );

    relatedInfoAndImport.push({ tipoRelacion, uuids: uuidsArray });
  };

  if (relacionados instanceof XmlNodes) {
    for (const relacionadosNode of relacionados) {
      pushElementFromRelatedNode(relacionadosNode);
    }
  } else {
    pushElementFromRelatedNode(relacionados);
  }

  return {
    table: {
      widths: ['auto', '5%', '*'],
      body: [
        [
          {
            text: 'CFDI relacionados',
            colSpan: 3,
            alignment: 'left',
            color: primaryColor,
            style: 'tableSubtitleHeader',
          },
          '',
          '',
        ],
        [
          {
            text: 'Tipo de relación',
            alignment: 'left',
            fillColor: bgGrayColor,
            color: primaryColor,
            bold: true,
          },
          {
            text: '',
            fillColor: bgGrayColor,
          },
          {
            text: 'UUID',
            alignment: 'left',
            fillColor: bgGrayColor,
            color: primaryColor,
            bold: true,
          },
        ],
        ...relatedInfoAndImport.map((related) => {
          return [
            {
              text: related.tipoRelacion,
              alignment: 'left',
              fillColor: bgGrayColor,
            },
            {
              text: '',
              fillColor: bgGrayColor,
            },
            {
              text: related.uuids.join(' | '),
              alignment: 'left',
              fillColor: bgGrayColor,
            },
          ];
        }),
        [
          {
            text: '',
            colSpan: 3,
            border: [false, true, false, false],
          },
          '',
          '',
        ],
      ],
    },
    layout: 'tableLayout',
  };
};

export default genericCfdiRelacionadosContent;
