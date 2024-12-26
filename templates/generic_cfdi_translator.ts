import { XmlNodes } from '@nodecfdi/cfdi-core';
import { type TDocumentDefinitions } from 'pdfmake/interfaces.js';
import type CfdiData from '../src/cfdi_data.js';
import { type CatalogsData, type DocumentOptions, type DocumentTranslatorInterface } from '../src/types.js';
import AbstractGenericTraslator from './abstract_generic_translator.js';
import useDonat11Complement from './complements/donat11_complement.js';
import usePago10Complement from './complements/pago10_complement.js';
import usePago20Complement from './complements/pago20_complement.js';
import genericCfdiConceptosContent from './sections/generic_cfdi_conceptos_contents.js';
import genericCfdiDetailsInfoContent from './sections/generic_cfdi_details_info_content.js';
import genericCfdiInformacionGlobalContent from './sections/generic_cfdi_informacion_global_content.js';
import genericCfdiRelacionadosContent from './sections/generic_cfdi_relacionados_content.js';
import genericCfdiTotalesContent from './sections/generic_cfdi_totales_content.js';
import genericEmisorContent from './sections/generic_emisor_content.js';
import genericFooter from './sections/generic_footer.js';
import genericReceptorContent from './sections/generic_receptor_content.js';
import genericStampContent from './sections/generic_stamp_content.js';
import genericTopContent from './sections/generic_top_content.js';

export default class GenericCfdiTranslator
  extends AbstractGenericTraslator
  implements DocumentTranslatorInterface<CfdiData>
{
  public translate(
    data: CfdiData,
    documentOptions: DocumentOptions,
    catalogs: CatalogsData,
    primaryColor: string,
    bgGrayColor: string,
  ): TDocumentDefinitions {
    const comprobante = data.comprobante();

    const cfdiContent = [
      genericTopContent(data, catalogs, primaryColor),
      this.genericSpace(2),
      genericEmisorContent(data, catalogs, primaryColor, bgGrayColor),
      this.genericSpace(2),
      genericReceptorContent(data, catalogs, primaryColor, bgGrayColor),
      this.genericSpace(2),
    ];

    const globalInformation = comprobante.searchNode('cfdi:InformacionGlobal');
    if (globalInformation) {
      cfdiContent.push(
        genericCfdiInformacionGlobalContent(globalInformation, catalogs, primaryColor, bgGrayColor),
        this.genericSpace(2),
      );
    }

    cfdiContent.push(
      genericCfdiConceptosContent(comprobante, catalogs, primaryColor, bgGrayColor),
      this.genericSpace(2),
    );

    if (comprobante.getAttribute('TipoDeComprobante') !== 'P') {
      cfdiContent.push(
        genericCfdiTotalesContent(comprobante, catalogs, primaryColor, bgGrayColor),
        this.genericSpace(),
        genericCfdiDetailsInfoContent(comprobante, catalogs, primaryColor),
        this.genericSpace(2),
      );
    }

    const relacionados =
      comprobante.getAttribute('Version') === '3.3'
        ? comprobante.searchNode('cfdi:CfdiRelacionados')
        : comprobante.searchNodes('cfdi:CfdiRelacionados');

    if (
      relacionados !== undefined &&
      ((relacionados instanceof XmlNodes && relacionados.length > 0) || !(relacionados instanceof XmlNodes))
    ) {
      cfdiContent.push(
        genericCfdiRelacionadosContent(relacionados, catalogs, primaryColor, bgGrayColor),
        this.genericSpace(2),
      );
    }

    // Complements
    const pago10 = comprobante.searchNode('cfdi:Complemento', 'pago10:Pagos');
    if (pago10) {
      usePago10Complement(pago10, cfdiContent, catalogs, primaryColor, bgGrayColor);
    }

    const pago20 = comprobante.searchNode('cfdi:Complemento', 'pago20:Pagos');
    if (pago20) {
      usePago20Complement(pago20, cfdiContent, catalogs, primaryColor, bgGrayColor);
    }

    const donat11 = comprobante.searchNode('cfdi:Complemento', 'donat:Donatarias');
    if (donat11) {
      useDonat11Complement(donat11, cfdiContent, primaryColor, bgGrayColor);
    }

    // AdditionalFields
    const additionalFields = data.additionalFields();
    if (additionalFields) {
      for (const element of additionalFields) {
        cfdiContent.push(
          {
            table: {
              widths: ['*'],
              body: [[{ text: element.title, style: ['tableSubtitleHeader'], color: primaryColor }], [element.value]],
            },
            layout: 'tableLayout',
          },
          this.genericSpace(),
        );
      }
    }

    cfdiContent.push(
      genericStampContent(data.timbreFiscalDigital(), data.tfdSourceString(), data.qrUrl(), primaryColor),
    );

    return {
      ...documentOptions,
      content: cfdiContent,
      footer: (currentPage, pageCount, _) => {
        return genericFooter(currentPage, pageCount, data);
      },
    };
  }
}
