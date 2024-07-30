import { type Content } from 'pdfmake/interfaces.js';
import type CfdiData from '#src/cfdi_data';
import breakCharacters from '#src/utils/break_characters';

const genericStampContent = (data: CfdiData): Content => {
  const tfd = data.timbreFiscalDigital();
  const tfdSourceString = data.tfdSourceString();
  const qrUrl = data.qrUrl();

  return {
    table: {
      widths: ['54.5%', '0.5%', '*'],
      body: [
        [{ text: '', border: [false, false, false, true], colSpan: 3 }, '', ''],
        [
          {
            style: 'tableSat',
            table: {
              widths: ['auto', '*', '27%', '38%'],
              body: [
                [
                  { qr: qrUrl, fit: 100, rowSpan: 4 },
                  '',
                  {
                    text: 'Folio fiscal:',
                    style: 'tableSatSub',
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
                  { text: 'Cadena original del Timbre', colSpan: 2, style: 'tableSatSub' },
                  '',
                ],
                [
                  '',
                  '',
                  {
                    text: breakCharacters(tfdSourceString),
                    colSpan: 2,
                  },
                  '',
                ],
              ],
            },
            layout: 'stampLayout',
          },
          '',
          {
            style: 'tableSat',
            table: {
              widths: ['*', '0.5%', '*'],
              body: [
                [
                  { text: 'Número de certificado SAT', style: 'tableSatSub' },
                  '',
                  { text: 'Fecha y hora de certificación', style: 'tableSatSub' },
                ],
                [
                  {
                    text: tfd.getAttribute('NoCertificadoSAT'),
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
                  { text: breakCharacters(tfd.getAttribute('SelloSAT')) },
                  '',
                  { text: breakCharacters(tfd.getAttribute('SelloCFD')) },
                ],
              ],
            },
            layout: 'stampLayout',
          },
        ],
      ],
    },
    layout: 'tableLayout',
  };
};

export default genericStampContent;
