import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content } from 'pdfmake/interfaces.js';

const useDonat11Complement = (
  donat11: XmlNodeInterface,
  currentContent: Content[],
  primaryColor: string,
  bgGrayColor: string,
): void => {
  currentContent.push({
    table: {
      widths: ['*', '*', '*'],
      body: [
        [
          {
            text: 'Donatarias',
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
              { text: 'Version: ', color: primaryColor, bold: true },
              {
                text: donat11.getAttribute('version'),
              },
            ],
          },
          {
            fillColor: bgGrayColor,
            text: [
              { text: 'No. Autorización: ', color: primaryColor, bold: true },
              {
                text: donat11.getAttribute('noAutorizacion'),
              },
            ],
            alignment: 'center',
          },
          {
            fillColor: bgGrayColor,
            text: [
              { text: 'Fecha Autorización: ', color: primaryColor, bold: true },
              { text: donat11.getAttribute('fechaAutorizacion') },
            ],
            alignment: 'right',
          },
        ],
        [
          {
            fillColor: bgGrayColor,
            text: [{ text: 'Leyenda: ', color: primaryColor, bold: true }, { text: donat11.getAttribute('leyenda') }],
            colSpan: 3,
          },
          '',
          '',
        ],
        [
          { fillColor: bgGrayColor, text: '', border: [false, false, false, true] },
          { fillColor: bgGrayColor, text: '', border: [false, false, false, true] },
          { fillColor: bgGrayColor, text: '', border: [false, false, false, true] },
        ],
      ],
    },
    layout: 'tableLayout',
  });
};

export default useDonat11Complement;
