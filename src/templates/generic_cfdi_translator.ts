import { XmlNodes } from '@nodecfdi/cfdi-core';
import { type TDocumentDefinitions } from 'pdfmake/interfaces.js';
import type CfdiData from '#src/cfdi_data';
import AbstractGenericTraslator from '#src/templates/abstract_generic_translator';
import useDonat11Complement from '#src/templates/complements/donat11_complement';
import usePago10Complement from '#src/templates/complements/pago10_complement';
import usePago20Complement from '#src/templates/complements/pago20_complement';
import genericCfdiConceptosContent from '#src/templates/sections/generic_cfdi_conceptos_contents';
import genericCfdiDetailsInfoContent from '#src/templates/sections/generic_cfdi_details_info_content';
import genericCfdiInformacionGlobalContent from '#src/templates/sections/generic_cfdi_informacion_global_content';
import genericCfdiRelacionadosContent from '#src/templates/sections/generic_cfdi_relacionados_content';
import genericCfdiTotalesContent from '#src/templates/sections/generic_cfdi_totales_content';
import genericEmisorContent from '#src/templates/sections/generic_emisor_content';
import genericFooter from '#src/templates/sections/generic_footer';
import genericReceptorContent from '#src/templates/sections/generic_receptor_content';
import genericStampContent from '#src/templates/sections/generic_stamp_content';
import genericTopContent from '#src/templates/sections/generic_top_content';
import {
  type CatalogsData,
  type DocumentOptions,
  type DocumentTranslatorInterface,
} from '#src/types';

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
      ((relacionados instanceof XmlNodes && relacionados.length > 0) ||
        !(relacionados instanceof XmlNodes))
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
              body: [
                [{ text: element.title, style: ['tableSubtitleHeader'], color: primaryColor }],
                [element.value],
              ],
            },
            layout: 'tableLayout',
          },
          this.genericSpace(),
        );
      }
    }

    cfdiContent.push(
      genericStampContent(
        data.timbreFiscalDigital(),
        data.tfdSourceString(),
        data.qrUrl(),
        primaryColor,
      ),
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
