import { type TDocumentDefinitions } from 'pdfmake/interfaces.js';
import type CfdiData from '../cfdi_data.js';
import {
  type CatalogsData,
  type DocumentOptions,
  type DocumentTranslatorInterface,
} from '../types.js';
import AbstractGenericTraslator from './abstract_generic_translator.js';
import genericEmisorContent from './sections/generic_emisor_content.js';
import genericFooter from './sections/generic_footer.js';
import genericReceptorContent from './sections/generic_receptor_content.js';
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
  ): TDocumentDefinitions {
    return {
      ...documentOptions,
      content: [
        genericTopContent(data, catalogs, primaryColor),
        this.genericSpace(2),
        genericEmisorContent(data, catalogs, primaryColor, this._bgGrayColor),
        this.genericSpace(2),
        genericReceptorContent(data, catalogs, primaryColor, this._bgGrayColor),
      ],
      footer: (currentPage, pageCount, _) => {
        return genericFooter(currentPage, pageCount, data);
      },
    };
  }
}
