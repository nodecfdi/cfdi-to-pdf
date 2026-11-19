import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import { type CatalogsData } from '../../src/types.js';

const labelValue = (label: string, value: string, primaryColor: string): TableCell => ({
  text: [{ text: `${label}: `, color: primaryColor, bold: true }, { text: value }],
});

const nomina12GeneralDataContent = (
  nomina: XmlNodeInterface,
  comprobante: XmlNodeInterface,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content => {
  const nominaEmisor = nomina.searchNode('nomina12:Emisor');
  const leftRows: TableCell[][] = [];
  const rightRows: TableCell[][] = [];

  if (nomina.hasAttribute('TipoNomina')) {
    leftRows.push([
      labelValue(
        'Tipo nómina',
        catalogs.nominaTiposNominas.findAndReturnTexto(nomina.getAttribute('TipoNomina')),
        primaryColor,
      ),
    ]);
  }

  if (nomina.hasAttribute('FechaPago')) {
    leftRows.push([labelValue('Fecha pago', nomina.getAttribute('FechaPago'), primaryColor)]);
  }

  if (nomina.hasAttribute('FechaInicialPago')) {
    leftRows.push([labelValue('Fecha inicial de pago', nomina.getAttribute('FechaInicialPago'), primaryColor)]);
  }

  if (nomina.hasAttribute('FechaFinalPago')) {
    leftRows.push([labelValue('Fecha final de pago', nomina.getAttribute('FechaFinalPago'), primaryColor)]);
  }

  if (nomina.hasAttribute('NumDiasPagados')) {
    leftRows.push([labelValue('No. de días pagados', nomina.getAttribute('NumDiasPagados'), primaryColor)]);
  }

  if (comprobante.hasAttribute('FormaPago')) {
    rightRows.push([
      labelValue(
        'Forma de pago',
        catalogs.cfdi40FormasPago.findAndReturnTexto(comprobante.getAttribute('FormaPago')),
        primaryColor,
      ),
    ]);
  }

  if (comprobante.hasAttribute('MetodoPago')) {
    rightRows.push([
      labelValue(
        'Método de pago',
        catalogs.cfdi40MetodosPago.findAndReturnTexto(comprobante.getAttribute('MetodoPago')),
        primaryColor,
      ),
    ]);
  }

  if (comprobante.hasAttribute('Moneda')) {
    rightRows.push([labelValue('Moneda', comprobante.getAttribute('Moneda'), primaryColor)]);
  }

  if (nominaEmisor?.hasAttribute('RegistroPatronal')) {
    rightRows.push([labelValue('Registro patronal', nominaEmisor.getAttribute('RegistroPatronal'), primaryColor)]);
  }

  if (nominaEmisor?.hasAttribute('RfcPatronOrigen')) {
    rightRows.push([labelValue('RFC Patrón Origen', nominaEmisor.getAttribute('RfcPatronOrigen'), primaryColor)]);
  }

  if (leftRows.length === 0) {
    leftRows.push([{}]);
  }

  if (rightRows.length === 0) {
    rightRows.push([{}]);
  }

  return {
    table: {
      widths: ['49.5%', '*', '49.5%'],
      body: [
        [
          { text: 'Datos generales nómina', style: ['tableSubtitleHeader'], color: primaryColor },
          '',
          { text: 'Datos de pago', style: ['tableSubtitleHeader'], color: primaryColor },
        ],
        [
          {
            fillColor: bgGrayColor,
            table: { widths: ['*'], body: leftRows },
            layout: 'tableLayout',
            border: [false, false, false, true],
          },
          '',
          {
            fillColor: bgGrayColor,
            table: { widths: ['*'], body: rightRows },
            layout: 'tableLayout',
            border: [false, false, false, true],
          },
        ],
      ],
    },
    layout: 'tableLayout',
  };
};

export default nomina12GeneralDataContent;
