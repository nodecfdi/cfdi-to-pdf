import { type Content } from 'pdfmake/interfaces.js';
import CfdiData from '#src/cfdi_data';
import RetencionesData from '#src/retenciones_data';

const genericFooter = (currentPage: number, pageCount: number, data: CfdiData | RetencionesData): Content => {
  const uuid = data.timbreFiscalDigital().getAttribute('UUID');
  let version = '';

  if (data instanceof CfdiData) {
    version = data.comprobante().getAttribute('Version');
  } else if (data instanceof RetencionesData) {
    version = data.retenciones().getAttribute('Version');
  }

  return [
    {
      text: data.legendFooter().replace('{version}', version),
      style: { fontSize: 7 },
      alignment: 'center',
    },
    {
      text: `UUID: ${uuid} - Página ${currentPage} de ${pageCount}`,
      style: { fontSize: 7 },
      alignment: 'center',
    },
  ];
};

export default genericFooter;
