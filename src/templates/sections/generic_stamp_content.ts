import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import type CfdiData from '#src/cfdi_data';
import breakEveryNCharacters from '#src/utils/break_characters';

const genericStampContent = (data: CfdiData, primaryColor: string): Content => {
  const comprobante = data.comprobante();
  const tfd = data.timbreFiscalDigital();
  const tfdSourceString = data.tfdSourceString();
  const qrUrl = data.qrUrl();
  const tfdCellsTable: TableCell[][] = [];
  tfdCellsTable.push(
    [
      {
        text: '',
        colSpan: 5,
        fillColor: primaryColor,
      },
      '',
      '',
      '',
      '',
    ],
    [
      {
        colSpan: 1,
        rowSpan: 8,
        qr: qrUrl,
        fit: 100,
      },
      '',
      '',
      '',
      '',
    ],
    [
      '',
      { text: 'Folio fiscal:', style: 'tableSatSub' },
      tfd.getAttribute('UUID'),
      { text: 'Número de certificado SAT', style: 'tableSatSub' },
      { text: 'Fecha y hora de certificación', style: 'tableSatSub' },
    ],
    [
      '',
      { text: 'Número de serie certificado emisor:', style: 'tableSatSub' },
      { text: comprobante.getAttribute('NoCertificado'), alignment: 'right' },
      tfd.getAttribute('NoCertificadoSAT'),
      tfd.getAttribute('FechaTimbrado'),
    ],
    [
      '',
      { text: 'Cadena original del timbre', colSpan: 2, alignment: 'left', style: 'tableSatSub' },
      '',
      { text: 'Sello digital del SAT', style: 'tableSatSub' },
      { text: 'Sello digital del CFDI', style: 'tableSatSub' },
    ],
    [
      '',
      { text: breakEveryNCharacters(tfdSourceString, 86), colSpan: 2, rowSpan: 4 },
      '',
      { text: breakEveryNCharacters(tfd.getAttribute('SelloSAT'), 86), rowSpan: 4, fontSize: 4 },
      {
        text: breakEveryNCharacters(tfd.getAttribute('SelloCFD'), 80),
        rowSpan: 4,
        margin: [0, 0, 5, 0],
      },
    ],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  );

  return {
    style: 'tableSat',

    table: {
      widths: ['auto', '20%', '20%', '20%', '21.2%'],
      body: tfdCellsTable,
    },
    layout: 'noBorders',
  };
};

export default genericStampContent;
