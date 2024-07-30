import { type TDocumentDefinitions } from 'pdfmake/interfaces.js';
import type CfdiData from '#src/cfdi_data';
import AbstractGenericTraslator from '#src/templates/abstract_generic_translator';
import genericCfdiConceptosContent from '#src/templates/sections/generic_cfdi_conceptos_contents';
import genericCfdiRelacionadosContent from '#src/templates/sections/generic_cfdi_relacionados_content';
import genericEmisorContent from '#src/templates/sections/generic_emisor_content';
import genericFooter from '#src/templates/sections/generic_footer';
import genericReceptorContent from '#src/templates/sections/generic_receptor_content';
import genericRelatedInfoContent from '#src/templates/sections/generic_related_info_content';
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
  ): TDocumentDefinitions {
    return {
      ...documentOptions,
      content: [
        genericTopContent(data, catalogs, primaryColor),
        this.genericSpace(2),
        genericEmisorContent(data, catalogs, primaryColor, this._bgGrayColor),
        this.genericSpace(2),
        genericReceptorContent(data, catalogs, primaryColor, this._bgGrayColor),
        this.genericSpace(2),
        genericCfdiConceptosContent(data, catalogs, primaryColor, this._bgGrayColor),
        this.genericSpace(2),
        genericRelatedInfoContent(data, catalogs, primaryColor),
        this.genericSpace(2),
        genericCfdiRelacionadosContent(data, catalogs, primaryColor, this._bgGrayColor),
        this.genericSpace(2),
        genericStampContent(data),
      ],
      footer: (currentPage, pageCount, _) => {
        return genericFooter(currentPage, pageCount, data);
      },
    };
  }
}
