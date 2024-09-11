import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { getKeyValueOfCatalog, getValueOfCatalog } from '#src/catalogs/catalogs_source';
import CfdiData from '#src/cfdi_data';
import RetencionesData from '#src/retenciones_data';
import { type CatalogsData } from '#src/types';

const genericCfdiReceptorContent = (
  data: CfdiData,
  primaryColor: string,
  catalogs: CatalogsData,
  receptorData: TableCell[][],
  additionalReceptorData: TableCell[][],
): void => {
  const receptor = data.receptor();

  receptorData.push(
    [{ text: receptor.getAttribute('Nombre'), style: ['subHeader'], color: primaryColor }],
    [
      {
        text: [
          { text: 'RFC: ', color: primaryColor, bold: true },
          { text: receptor.getAttribute('Rfc') },
        ],
      },
    ],
  );

  if (receptor.hasAttribute('RegimenFiscalReceptor')) {
    receptorData.push([
      {
        text: [
          { text: 'Régimen fiscal: ', color: primaryColor, bold: true },
          {
            text: getKeyValueOfCatalog(
              'cfdi40RegimenesFiscales',
              receptor.getAttribute('RegimenFiscalReceptor'),
              catalogs,
            ),
          },
        ],
      },
    ]);
  }

  if (receptor.hasAttribute('DomicilioFiscalReceptor')) {
    receptorData.push([
      {
        text: [
          { text: 'Domicilio fiscal: ', color: primaryColor, bold: true },
          {
            text: receptor.getAttribute('DomicilioFiscalReceptor'),
          },
        ],
      },
    ]);
  }

  additionalReceptorData.push([
    {
      text: [
        { text: 'Uso del CFDI: ', color: primaryColor, bold: true },
        {
          text: getValueOfCatalog('cfdi40UsosCfdi', receptor.getAttribute('UsoCFDI'), catalogs),
        },
      ],
    },
  ]);

  if (data.comprobante().hasAttribute('Exportacion')) {
    additionalReceptorData.push([
      {
        text: [
          { text: 'Exportación: ', color: primaryColor, bold: true },
          {
            text: getValueOfCatalog(
              'cfdi40Exportaciones',
              data.comprobante().getAttribute('Exportacion'),
              catalogs,
            ),
          },
        ],
      },
    ]);
  }

  if (receptor.hasAttribute('ResidenciaFiscal')) {
    additionalReceptorData.push([
      {
        text: [
          { text: 'Residencia Fiscal: ', color: primaryColor, bold: true },
          {
            text: receptor.getAttribute('ResidenciaFiscal'),
          },
        ],
      },
    ]);
  }

  if (receptor.hasAttribute('NumRegIdTrib')) {
    additionalReceptorData.push([
      {
        text: [
          { text: 'Número Id Trib.: ', color: primaryColor, bold: true },
          {
            text: receptor.getAttribute('NumRegIdTrib'),
          },
        ],
      },
    ]);
  }
};

const genericRetencionesReceptorContent = (
  data: RetencionesData,
  primaryColor: string,
  receptorData: TableCell[][],
  additionalReceptorData: TableCell[][],
): void => {
  const receptor = data.receptor();
  const version = data.retenciones().getAttribute('Version');
  const nacionalidad = receptor.getAttribute(version === '1.0' ? 'Nacionalidad' : 'NacionalidadR');

  const nacional = receptor.searchNode('retenciones:Nacional');
  const extranjero = receptor.searchNode('retenciones:Extranjero');

  receptorData.push(
    [
      {
        text:
          (nacional
            ? nacional.getAttribute('NomDenRazSocR')
            : extranjero?.getAttribute('NomDenRazSocR')) ?? '',
        style: ['subHeader'],
        color: primaryColor,
      },
    ],
    [
      {
        text: [{ text: 'Nacionalidad: ', color: primaryColor, bold: true }, { text: nacionalidad }],
      },
    ],
  );

  if (nacional) {
    receptorData.push([
      {
        text: [
          { text: 'RFC Receptor: ', color: primaryColor, bold: true },
          { text: nacional.getAttribute(version === '1.0' ? 'RFCRecep' : 'RfcR') },
        ],
      },
    ]);
  }

  if (extranjero?.hasAttribute(version === '1.0' ? 'NumRegIdTrib' : 'NumRegIdTribR')) {
    additionalReceptorData.push([
      {
        text: [
          { text: 'Número Id Trib.: ', color: primaryColor, bold: true },
          { text: extranjero.getAttribute(version === '1.0' ? 'NumRegIdTrib' : 'NumRegIdTribR') },
        ],
      },
    ]);
  }

  if (nacional?.hasAttribute('DomicilioFiscalR')) {
    additionalReceptorData.push([
      {
        text: [
          { text: 'Domicilio Fiscal: ', color: primaryColor, bold: true },
          { text: nacional.getAttribute('DomicilioFiscalR') },
        ],
      },
    ]);
  }

  if (nacional?.hasAttribute(version === '1.0' ? 'CURPR' : 'CurpR')) {
    additionalReceptorData.push([
      {
        text: [
          { text: 'CURP: ', color: primaryColor, bold: true },
          { text: nacional.getAttribute(version === '1.0' ? 'CURPR' : 'CurpR') },
        ],
      },
    ]);
  }
};

const genericReceptorContent = (
  data: CfdiData | RetencionesData,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content => {
  const receptorData: TableCell[][] = [];
  const additionalReceptorData: TableCell[][] = [];

  if (data instanceof CfdiData) {
    genericCfdiReceptorContent(data, primaryColor, catalogs, receptorData, additionalReceptorData);
  } else if (data instanceof RetencionesData) {
    genericRetencionesReceptorContent(data, primaryColor, receptorData, additionalReceptorData);
  }

  if (receptorData.length === 0) {
    receptorData.push([{}]);
  }

  if (additionalReceptorData.length === 0) {
    additionalReceptorData.push([{}]);
  }

  return {
    table: {
      widths: ['49.5%', '*', '49.5%'],
      body: [
        [
          { text: 'Datos del receptor', style: ['tableSubtitleHeader'], color: primaryColor },
          '',
          {
            text: 'Datos adicionales receptor',
            style: ['tableSubtitleHeader'],
            color: primaryColor,
          },
        ],
        [
          {
            fillColor: bgGrayColor,
            table: {
              widths: ['*'],
              body: receptorData,
            },
            layout: 'tableLayout',
            border: [false, false, false, true],
          },
          '',
          {
            fillColor: bgGrayColor,
            table: {
              widths: ['*'],
              body: additionalReceptorData,
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

export default genericReceptorContent;
