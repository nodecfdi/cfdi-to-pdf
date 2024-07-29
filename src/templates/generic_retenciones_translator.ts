import { type TDocumentDefinitions } from 'pdfmake/interfaces.js';
import type RetencionesData from '#src/retenciones_data';
import AbstractGenericTraslator from '#src/templates/abstract_generic_translator';
import genericEmisorContent from '#src/templates/sections/generic_emisor_content';
import genericFooter from '#src/templates/sections/generic_footer';
import genericReceptorContent from '#src/templates/sections/generic_receptor_content';
import genericTopContent from '#src/templates/sections/generic_top_content';
import {
  type CatalogsData,
  type DocumentOptions,
  type DocumentTranslatorInterface,
} from '#src/types';

export default class GenericRetencionesTranslator
  extends AbstractGenericTraslator
  implements DocumentTranslatorInterface<RetencionesData>
{
  public translate(
    data: RetencionesData,
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
