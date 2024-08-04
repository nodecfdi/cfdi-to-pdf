import { type TDocumentDefinitions } from 'pdfmake/interfaces.js';
import type RetencionesData from '#src/retenciones_data';
import AbstractGenericTraslator from '#src/templates/abstract_generic_translator';
import genericEmisorContent from '#src/templates/sections/generic_emisor_content';
import genericFooter from '#src/templates/sections/generic_footer';
import genericReceptorContent from '#src/templates/sections/generic_receptor_content';
import genericRetencionPeriodoContent from '#src/templates/sections/generic_retencion_periodo_content';
import genericRetencionTotalesContent from '#src/templates/sections/generic_retencion_totales_content';
import genericStampContent from '#src/templates/sections/generic_stamp_content';
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
    bgGrayColor: string,
  ): TDocumentDefinitions {
    const retencionesContent = [
      genericTopContent(data, catalogs, primaryColor),
      this.genericSpace(2),
      genericEmisorContent(data, catalogs, primaryColor, bgGrayColor),
      this.genericSpace(2),
      genericReceptorContent(data, catalogs, primaryColor, bgGrayColor),
      this.genericSpace(2),
    ];

    const isVersionOne = data.retenciones().getAttribute('Version') === '1.0';
    retencionesContent.push(
      genericRetencionPeriodoContent(
        data.periodo(),
        isVersionOne,
        catalogs,
        primaryColor,
        bgGrayColor,
      ),
      this.genericSpace(2),
      ...genericRetencionTotalesContent(
        data.totales(),
        isVersionOne,
        catalogs,
        primaryColor,
        bgGrayColor,
      ),
      this.genericSpace(2),
    );

    // TODO: Complements

    // AdditionalFields
    const additionalFields = data.additionalFields();
    if (additionalFields) {
      for (const element of additionalFields) {
        retencionesContent.push(
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

    retencionesContent.push(
      genericStampContent(data.timbreFiscalDigital(), data.tfdSourceString(), data.qrUrl()),
    );

    return {
      ...documentOptions,
      content: retencionesContent,
      footer: (currentPage, pageCount, _) => {
        return genericFooter(currentPage, pageCount, data);
      },
    };
  }
}
