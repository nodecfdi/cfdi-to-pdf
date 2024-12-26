import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import CfdiData from '../../src/cfdi_data.js';
import RetencionesData from '../../src/retenciones_data.js';
import { type CatalogsData } from '../../src/types.js';

const genericEmisorContent = (
  data: CfdiData | RetencionesData,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content => {
  const emisor = data.emisor();
  const additionalEmisorData: TableCell[][] = [];
  let razonSocial = '';
  let rfc = '';
  let numCertificado = '';
  let regimenFiscal = '';
  let curp: string | undefined;

  if (data instanceof CfdiData) {
    razonSocial = emisor.getAttribute('Nombre');
    rfc = emisor.getAttribute('Rfc');
    numCertificado = data.comprobante().getAttribute('NoCertificado');
    regimenFiscal = emisor.getAttribute('RegimenFiscal');
  } else if (data instanceof RetencionesData) {
    const retVersion = data.retenciones().getAttribute('Version');

    razonSocial = emisor.getAttribute('NomDenRazSocE');
    rfc = emisor.getAttribute(retVersion === '1.0' ? 'RFCEmisor' : 'RfcE');
    numCertificado = data.retenciones().getAttribute('NumCert');
    regimenFiscal = emisor.getAttribute('RegimenFiscalE');
    curp = emisor.getAttribute('CURPE');
  }

  if (regimenFiscal !== '') {
    additionalEmisorData.push([
      {
        text: [
          { text: 'Regimen Fiscal: ', color: primaryColor, bold: true },
          {
            text: catalogs.cfdi40RegimenesFiscales.findAndReturnEtiqueta(regimenFiscal),
          },
        ],
      },
    ]);
  }

  additionalEmisorData.push([
    {
      text: [{ text: 'Número de certificado: ', color: primaryColor, bold: true }, { text: numCertificado }],
    },
  ]);

  if (curp && curp !== '') {
    additionalEmisorData.push([
      {
        text: [{ text: 'CURP: ', color: primaryColor, bold: true }, { text: curp }],
      },
    ]);
  }

  return {
    table: {
      widths: ['49.5%', '*', '49.5%'],
      body: [
        [
          { text: 'Datos del emisor', style: ['tableSubtitleHeader'], color: primaryColor },
          '',
          { text: 'Datos adicionales emisor', style: ['tableSubtitleHeader'], color: primaryColor },
        ],
        [
          {
            fillColor: bgGrayColor,
            table: {
              widths: ['*'],
              body: [
                [{ text: razonSocial, style: ['subHeader'], color: primaryColor }],
                [{ text: [{ text: 'RFC: ', color: primaryColor, bold: true }, { text: rfc }] }],
              ],
            },
            layout: 'tableLayout',
            border: [false, false, false, true],
          },
          '',
          {
            fillColor: bgGrayColor,
            table: {
              widths: ['*'],
              body: additionalEmisorData,
            },
            layout: 'tableLayout',
            border: [false, false, false, true],
          },
        ],
      ],
    },
    layout: 'tableLayout',
  };
};

export default genericEmisorContent;
