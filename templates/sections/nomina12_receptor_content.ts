import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content, type TableCell } from 'pdfmake/interfaces.js';
import type CfdiData from '../../src/cfdi_data.js';
import { type CatalogsData } from '../../src/types.js';

const labelValue = (label: string, value: string, primaryColor: string): TableCell => ({
  text: [{ text: `${label}: `, color: primaryColor, bold: true }, { text: value }],
});

const nomina12ReceptorContent = (
  data: CfdiData,
  nominaReceptor: XmlNodeInterface,
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): Content => {
  const receptor = data.receptor();
  const comprobante = data.comprobante();

  const leftRows: TableCell[][] = [
    [{ text: receptor.getAttribute('Nombre'), style: ['subHeader'], color: primaryColor }],
    [labelValue('RFC', receptor.getAttribute('Rfc'), primaryColor)],
  ];

  if (receptor.hasAttribute('RegimenFiscalReceptor')) {
    leftRows.push([
      labelValue(
        'Régimen fiscal',
        catalogs.cfdi40RegimenesFiscales.findAndReturnEtiqueta(receptor.getAttribute('RegimenFiscalReceptor')),
        primaryColor,
      ),
    ]);
  }

  if (receptor.hasAttribute('DomicilioFiscalReceptor')) {
    leftRows.push([labelValue('Domicilio fiscal', receptor.getAttribute('DomicilioFiscalReceptor'), primaryColor)]);
  }

  leftRows.push([
    labelValue(
      'Uso del CFDI',
      catalogs.cfdi40UsosCfdi.findAndReturnTexto(receptor.getAttribute('UsoCFDI')),
      primaryColor,
    ),
  ]);

  if (comprobante.hasAttribute('Exportacion')) {
    leftRows.push([
      labelValue(
        'Exportación',
        catalogs.cfdi40Exportaciones.findAndReturnTexto(comprobante.getAttribute('Exportacion')),
        primaryColor,
      ),
    ]);
  }

  if (nominaReceptor.hasAttribute('NumEmpleado')) {
    leftRows.push([labelValue('No. Empleado', nominaReceptor.getAttribute('NumEmpleado'), primaryColor)]);
  }

  if (nominaReceptor.hasAttribute('Departamento')) {
    leftRows.push([labelValue('Departamento', nominaReceptor.getAttribute('Departamento'), primaryColor)]);
  }

  if (nominaReceptor.hasAttribute('Puesto')) {
    leftRows.push([labelValue('Puesto', nominaReceptor.getAttribute('Puesto'), primaryColor)]);
  }

  if (nominaReceptor.hasAttribute('RiesgoPuesto')) {
    leftRows.push([
      labelValue(
        'Riesgo puesto',
        catalogs.nominaRiesgosPuestos.findAndReturnTexto(nominaReceptor.getAttribute('RiesgoPuesto')),
        primaryColor,
      ),
    ]);
  }

  const rightRows: TableCell[][] = [];

  if (nominaReceptor.hasAttribute('NumSeguridadSocial')) {
    rightRows.push([
      labelValue('No. Seguridad Social', nominaReceptor.getAttribute('NumSeguridadSocial'), primaryColor),
    ]);
  }

  if (nominaReceptor.hasAttribute('Curp')) {
    rightRows.push([labelValue('CURP', nominaReceptor.getAttribute('Curp'), primaryColor)]);
  }

  if (nominaReceptor.hasAttribute('FechaInicioRelLaboral')) {
    rightRows.push([
      labelValue('Fecha inicio relación laboral', nominaReceptor.getAttribute('FechaInicioRelLaboral'), primaryColor),
    ]);
  }

  if (nominaReceptor.hasAttribute('Antigüedad')) {
    rightRows.push([labelValue('Antigüedad', nominaReceptor.getAttribute('Antigüedad'), primaryColor)]);
  }

  if (nominaReceptor.hasAttribute('TipoContrato')) {
    rightRows.push([
      labelValue(
        'Tipo contrato',
        catalogs.nominaTiposContratos.findAndReturnTexto(nominaReceptor.getAttribute('TipoContrato')),
        primaryColor,
      ),
    ]);
  }

  if (nominaReceptor.hasAttribute('TipoRegimen')) {
    rightRows.push([
      labelValue(
        'Régimen contratación',
        catalogs.nominaTiposRegimenes.findAndReturnTexto(nominaReceptor.getAttribute('TipoRegimen')),
        primaryColor,
      ),
    ]);
  }

  if (nominaReceptor.hasAttribute('TipoJornada')) {
    rightRows.push([
      labelValue(
        'Tipo de jornada',
        catalogs.nominaTiposJornadas.findAndReturnTexto(nominaReceptor.getAttribute('TipoJornada')),
        primaryColor,
      ),
    ]);
  }

  if (nominaReceptor.hasAttribute('PeriodicidadPago')) {
    rightRows.push([
      labelValue(
        'Periodicidad de pago',
        catalogs.nominaPeriodicidadesPagos.findAndReturnTexto(nominaReceptor.getAttribute('PeriodicidadPago')),
        primaryColor,
      ),
    ]);
  }

  if (nominaReceptor.hasAttribute('SalarioDiarioIntegrado')) {
    rightRows.push([labelValue('Salario diario', nominaReceptor.getAttribute('SalarioDiarioIntegrado'), primaryColor)]);
  }

  if (nominaReceptor.hasAttribute('SalarioBaseCotApor')) {
    rightRows.push([labelValue('Salario base', nominaReceptor.getAttribute('SalarioBaseCotApor'), primaryColor)]);
  }

  if (nominaReceptor.hasAttribute('Banco')) {
    rightRows.push([labelValue('Banco', nominaReceptor.getAttribute('Banco'), primaryColor)]);
  }

  if (nominaReceptor.hasAttribute('CuentaBancaria')) {
    rightRows.push([labelValue('Cuenta bancaria', nominaReceptor.getAttribute('CuentaBancaria'), primaryColor)]);
  }

  if (nominaReceptor.hasAttribute('ClaveEntFed')) {
    rightRows.push([
      labelValue(
        'Clave Entidad Federativa',
        catalogs.nominaEstados.findAndReturnTexto(nominaReceptor.getAttribute('ClaveEntFed')),
        primaryColor,
      ),
    ]);
  }

  if (nominaReceptor.hasAttribute('Sindicalizado')) {
    rightRows.push([labelValue('Sindicalizado', nominaReceptor.getAttribute('Sindicalizado'), primaryColor)]);
  }

  if (rightRows.length === 0) {
    rightRows.push([{}]);
  }

  return {
    table: {
      widths: ['49.5%', '*', '49.5%'],
      body: [
        [
          { text: 'Datos del receptor', style: ['tableSubtitleHeader'], color: primaryColor },
          '',
          { text: 'Datos adicionales receptor', style: ['tableSubtitleHeader'], color: primaryColor },
        ],
        [
          {
            fillColor: bgGrayColor,
            table: {
              widths: ['*'],
              body: leftRows,
            },
            layout: 'tableLayout',
            border: [false, false, false, true],
          },
          '',
          {
            fillColor: bgGrayColor,
            table: {
              widths: ['*'],
              body: rightRows,
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

export default nomina12ReceptorContent;
