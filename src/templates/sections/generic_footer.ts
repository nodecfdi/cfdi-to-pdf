import { type Content } from 'pdfmake/interfaces.js';
import CfdiData from '../../cfdi_data.js';
import RetencionesData from '../../retenciones_data.js';

const genericFooter = (
  currentPage: number,
  pageCount: number,
  data: CfdiData | RetencionesData,
): Content => {
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
      alignment: 'center',
    },
    {
      text: `UUID: ${uuid} - Página ${currentPage} de ${pageCount}`,
      alignment: 'center',
    },
  ];
};

export default genericFooter;
