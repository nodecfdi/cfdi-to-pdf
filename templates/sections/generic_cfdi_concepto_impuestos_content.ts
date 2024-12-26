import { type XmlNodes } from '@nodecfdi/cfdi-core';
import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type ContentTable, type TableCell } from 'pdfmake/interfaces.js';
import { type CatalogsData } from '../../src/types.js';
import { formatCurrency } from '../../src/utils/currency.js';

const generateImpuestosContentTable = (
  traslados: XmlNodes,
  retenciones: XmlNodes,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): ContentTable => {
  const impuestosTableBody: TableCell[][] = [];

  for (const traslado of traslados) {
    const baseCells: TableCell[] = [];
    baseCells.push(
      { text: 'Traslado:', color: primaryColor, bold: true },
      { text: catalogs.cfdi40Impuestos.findAndReturnTexto(traslado.getAttribute('Impuesto')) },
      { text: 'Base:', color: primaryColor, bold: true },
      {
        text: formatCurrency(traslado.getAttribute('Base')),
        alignment: 'right',
      },
    );

    const factor = traslado.getAttribute('TipoFactor');

    if (factor === 'Exento') {
      baseCells.push({ text: 'Factor:', color: primaryColor, bold: true }, { text: factor }, '', '');
    } else {
      const importe = traslado.getAttribute('Importe');
      baseCells.push(
        {
          text: 'Tasa:',
          color: primaryColor,
          bold: true,
        },
        {
          text: traslado.getAttribute('TasaOCuota'),
        },
        {
          text: 'Importe:',
          color: primaryColor,
          bold: true,
        },
        {
          text: formatCurrency(importe === '' ? '0' : importe),
        },
      );
    }

    impuestosTableBody.push(baseCells);
  }

  for (const retencion of retenciones) {
    const baseCells: TableCell[] = [];
    baseCells.push(
      { text: 'Retención:', color: primaryColor, bold: true },
      {
        text: catalogs.cfdi40Impuestos.findAndReturnTexto(retencion.getAttribute('Impuesto')),
      },
      { text: 'Base:', color: primaryColor, bold: true },
      {
        text: formatCurrency(retencion.getAttribute('Base')),
        alignment: 'right',
      },
    );

    const factor = retencion.getAttribute('TipoFactor');

    if (factor === 'Exento') {
      baseCells.push({ text: 'Factor:', color: primaryColor, bold: true }, { text: factor }, '', '');
    } else {
      const importe = retencion.getAttribute('Importe');
      baseCells.push(
        {
          text: 'Tasa:',
          color: primaryColor,
          bold: true,
        },
        {
          text: retencion.getAttribute('TasaOCuota'),
        },
        {
          text: 'Importe:',
          color: primaryColor,
          bold: true,
        },
        {
          text: formatCurrency(importe === '' ? '0' : importe),
        },
      );

      impuestosTableBody.push(baseCells);
    }
  }

  return {
    table: {
      widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
      body: impuestosTableBody,
    },
    fillColor: bgGrayColor,
    layout: 'conceptosLayout',
  };
};

const genericCfdiConceptoImpuestosContent = (
  concepto: XmlNodeInterface,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): ContentTable => {
  const impuestoConceptoTable: TableCell[][] = [];

  const predial = concepto.searchNode('cfdi:CuentaPredial');
  const codigoSat = concepto.getAttribute('ClaveProdServ');
  const objetoImp = concepto.getAttribute('ObjetoImp');
  const extraDetails: TableCell[] = [
    '',
    {
      text: [
        { text: 'Clave Producto/Servicio: ', color: primaryColor, bold: true },
        {
          text: codigoSat,
        },
      ],
    },
    {
      text:
        objetoImp === ''
          ? ''
          : [
              { text: 'Objeto Impuesto: ', color: primaryColor, bold: true },
              {
                text: catalogs.cfdi40ObjetosImpuestos.findAndReturnTexto(objetoImp),
              },
            ],
    },
    {
      text:
        predial === undefined
          ? ''
          : [{ text: 'Cuenta Predial: ', color: primaryColor, bold: true }, { text: predial.getAttribute('Numero') }],
    },
  ];
  impuestoConceptoTable.push(extraDetails);

  const traslados = concepto.searchNodes('cfdi:Impuestos', 'cfdi:Traslados', 'cfdi:Traslado');
  const retenciones = concepto.searchNodes('cfdi:Impuestos', 'cfdi:Retenciones', 'cfdi:Retencion');

  if (traslados.length > 0 || retenciones.length > 0) {
    impuestoConceptoTable.push([
      {
        ...generateImpuestosContentTable(traslados, retenciones, catalogs, primaryColor, bgGrayColor),
        colSpan: 4,
      },
      '',
      '',
      '',
    ]);
  }

  return {
    table: {
      widths: ['*', 'auto', 'auto', '*'],
      body: impuestoConceptoTable,
    },
    layout: 'conceptosLayout',
  };
};

export default genericCfdiConceptoImpuestosContent;
