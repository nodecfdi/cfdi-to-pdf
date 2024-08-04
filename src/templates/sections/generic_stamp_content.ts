import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content } from 'pdfmake/interfaces.js';
import breakCharacters from '#src/utils/break_characters';

const genericStampContent = (
  tfd: XmlNodeInterface,
  tfdSourceString: string,
  qrUrl: string,
): Content => {
  const isVersion11 = tfd.hasAttribute('Version');

  return {
    table: {
      widths: ['53%', '47%'],
      body: [
        [{ text: '', border: [false, false, false, true], colSpan: 2 }, ''],
        [
          {
            style: 'tableSat',
            table: {
              widths: ['34.5%', '0.5%', '27%', '38%'],
              body: [
                [
                  { qr: qrUrl, fit: 98, rowSpan: 4 },
                  '',
                  {
                    text: 'Folio fiscal:',
                    style: 'tableSatSub',
                    marginLeft: 1,
                    border: [false, false, false, true],
                  },
                  {
                    text: tfd.getAttribute('UUID'),
                    alignment: 'right',
                    border: [false, false, false, true],
                  },
                ],
                [
                  '',
                  '',
                  {
                    text: 'RFC Prov. de Certificación:',
                    style: 'tableSatSub',
                    marginLeft: 1,
                    border: [false, false, false, true],
                  },
                  {
                    text: tfd.getAttribute('RfcProvCertif'),
                    alignment: 'right',
                    border: [false, false, false, true],
                  },
                ],
                [
                  '',
                  '',
                  {
                    text: 'Cadena original del Timbre',
                    marginLeft: 1,
                    colSpan: 2,
                    style: 'tableSatSub',
                  },
                  '',
                ],
                [
                  '',
                  '',
                  {
                    text: breakCharacters(tfdSourceString),
                    marginLeft: 1,
                    colSpan: 2,
                  },
                  '',
                ],
              ],
            },
            layout: 'stampLayout',
          },
          {
            style: 'tableSat',
            table: {
              widths: ['49.5%', '1%', '49.5%'],
              body: [
                [
                  { text: 'Número de certificado SAT', style: 'tableSatSub' },
                  '',
                  { text: 'Fecha y hora de certificación', style: 'tableSatSub' },
                ],
                [
                  {
                    text: tfd.getAttribute(isVersion11 ? 'NoCertificadoSAT' : 'noCertificadoSAT'),
                    border: [false, false, false, true],
                  },
                  '',
                  { text: tfd.getAttribute('FechaTimbrado'), border: [false, false, false, true] },
                ],
                [
                  { text: 'Sello digital del SAT', style: 'tableSatSub' },
                  '',
                  { text: 'Sello digital del CFDI', style: 'tableSatSub' },
                ],
                [
                  {
                    text: breakCharacters(tfd.getAttribute(isVersion11 ? 'SelloSAT' : 'selloSAT')),
                  },
                  '',
                  {
                    text: breakCharacters(tfd.getAttribute(isVersion11 ? 'SelloCFD' : 'selloCFD')),
                  },
                ],
              ],
            },
            layout: 'stampLayout',
          },
        ],
      ],
      dontBreakRows: true,
    },
    layout: 'tableLayout',
  };
};

export default genericStampContent;
