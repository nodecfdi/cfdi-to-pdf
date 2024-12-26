import { type Content, type Size, type TableCell } from 'pdfmake/interfaces.js';
import CfdiData from '../../src/cfdi_data.js';
import RetencionesData from '../../src/retenciones_data.js';
import { type CatalogsData } from '../../src/types.js';

const genericTopContent = (data: CfdiData | RetencionesData, catalogs: CatalogsData, primaryColor: string): Content => {
  const logo = data.logo();
  const tfd = data.timbreFiscalDigital();

  const contentWidths: Size[] = [];
  const bodyContent: TableCell[][] = [];
  let title = '';
  let sectionLogoMargin = [0, 4, 0, 4];
  let sectionLogoFit = [150, 60];

  if (data instanceof CfdiData) {
    contentWidths.push('10%', '*', 'auto', '3%', '42%');
    const comprobante = data.comprobante();
    const version = comprobante.getAttribute('Version');
    const tipoComprobante = comprobante.getAttribute('TipoDeComprobante');

    title = `CFDI ${version} de ${catalogs.cfdi40TiposComprobantes.findAndReturnTexto(tipoComprobante)}`;
    bodyContent.push(
      [
        { text: 'Serie', style: ['tableHeader'], color: primaryColor },
        { text: 'Folio', style: ['tableHeader'], color: primaryColor },
        { text: 'Lugar de emisión', style: ['tableHeader'], color: primaryColor },
        '',
        { text: 'Fecha y hora de emisión', style: ['tableHeader'], color: primaryColor },
      ],
      [
        { text: comprobante.getAttribute('Serie') },
        { text: comprobante.getAttribute('Folio') },
        { text: comprobante.getAttribute('LugarExpedicion') },
        '',
        { text: comprobante.getAttribute('Fecha') },
      ],
      [
        { text: 'Folio fiscal', style: ['tableHeader'], color: primaryColor, colSpan: 3 },
        '',
        '',
        '',
        { text: 'Fecha y hora de certificación', style: ['tableHeader'], color: primaryColor },
      ],
      [{ text: tfd.getAttribute('UUID'), colSpan: 3 }, '', '', '', { text: tfd.getAttribute('FechaTimbrado') }],
    );
  } else if (data instanceof RetencionesData) {
    contentWidths.push('*', '3%', '42%');
    sectionLogoMargin = [0, 10, 0, 10];
    sectionLogoFit = [150, 70];
    const retenciones = data.retenciones();
    const version = retenciones.getAttribute('Version');
    const cveRetencion = retenciones.getAttribute('CveRetenc');

    title = `CFDI Retenciones e Información de Pagos ${version}`;
    bodyContent.push(
      [
        { text: 'Folio Interno', style: ['tableHeader'], color: primaryColor },
        '',
        { text: 'Fecha y hora de emisión', style: ['tableHeader'], color: primaryColor },
      ],
      [{ text: retenciones.getAttribute('FolioInt') }, '', { text: retenciones.getAttribute('FechaExp') }],
      [
        { text: 'Folio fiscal', style: ['tableHeader'], color: primaryColor },
        '',
        { text: 'Fecha y hora de certificación', style: ['tableHeader'], color: primaryColor },
      ],
      [{ text: tfd.getAttribute('UUID') }, '', { text: tfd.getAttribute('FechaTimbrado') }],
      [{ text: 'Clave', style: ['tableHeader'], color: primaryColor, colSpan: 3 }, '', ''],
      [
        {
          text: catalogs.retenciones20ClavesRetencion.findAndReturnEtiqueta(cveRetencion),
          colSpan: 3,
        },
        '',
        '',
      ],
    );
  }

  const logoSection: TableCell = logo
    ? {
        rowSpan: 2,
        margin: sectionLogoMargin,
        image: logo,
        fit: sectionLogoFit,
        alignment: 'center',
      }
    : {
        rowSpan: 2,
        margin: sectionLogoMargin,
        text: '',
        alignment: 'center',
      };

  return {
    table: {
      widths: ['40%', '60%'],
      body: [
        [
          logoSection,
          {
            text: title,
            alignment: 'center',
            style: ['header'],
            color: primaryColor,
            border: [false, false, false, true],
          },
        ],
        [
          '',
          {
            table: {
              widths: contentWidths,
              body: bodyContent,
            },
            layout: 'tableLayout',
          },
        ],
      ],
    },
    layout: 'tableLayout',
  };
};

export default genericTopContent;
