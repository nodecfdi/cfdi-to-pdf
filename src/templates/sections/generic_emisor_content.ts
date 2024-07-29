import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { getKeyValueOfCatalog } from '#src/catalogs/catalogs_source';
import CfdiData from '#src/cfdi_data';
import RetencionesData from '#src/retenciones_data';
import { type CatalogsData } from '#src/types';

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
          { text: 'Regimen Fiscal ', color: primaryColor },
          {
            text: getKeyValueOfCatalog('cfdi40RegimenesFiscales', regimenFiscal, catalogs),
          },
        ],
      },
    ]);
  }

  additionalEmisorData.push([
    {
      text: [{ text: 'Número de certificado ', color: primaryColor }, { text: numCertificado }],
    },
  ]);

  if (curp && curp !== '') {
    additionalEmisorData.push([
      {
        text: [{ text: 'CURP ', color: primaryColor }, { text: curp }],
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
                [{ text: [{ text: 'RFC ', color: primaryColor }, { text: rfc }] }],
              ],
            },
            layout: 'noBorders',
          },
          '',
          {
            fillColor: bgGrayColor,
            table: {
              widths: ['*'],
              body: additionalEmisorData,
            },
            layout: 'noBorders',
          },
        ],
        [{ fillColor: primaryColor, text: '' }, '', { fillColor: primaryColor, text: '' }],
      ],
    },
    layout: 'noBorders',
  };
};

export default genericEmisorContent;
