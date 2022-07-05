import { CNodeInterface, CNodes } from '@nodecfdi/cfdiutils-common';
import { Content, TableCell } from 'pdfmake/interfaces';
import { formatCurrency } from '../../utils/currency';

const generateRelatedDocsContent = (doctoRelacionados: CNodes): TableCell[][] => {
    const relatedDocsCells = doctoRelacionados.map<TableCell[]>((doc) => {
        return [
            doc.get('IdDocumento'),
            doc.get('MetodoDePagoDR'),
            doc.get('MonedaDR'),
            doc.get('TipoCambioDR'),
            doc.get('NumParcialidad'),
            formatCurrency(doc.get('ImpSaldoAnt') || '0'),
            formatCurrency(doc.get('ImpPagado') || '0'),
            formatCurrency(doc.get('ImpSaldoInsoluto') || '0')
        ];
    });
    relatedDocsCells.unshift([
        'UUID',
        'Método de Pago',
        'Moneda',
        'Tipo de Cambio',
        'Num. Parcialidad',
        'Importe Saldo Anterior',
        'Importe Pagado',
        'Importe Saldo Insoluto'
    ]);
    relatedDocsCells.unshift([
        {
            text: 'DOCUMENTOS RELACIONADOS',
            style: 'tableHeader',
            colSpan: 8,
            alignment: 'center'
        },
        {},
        {},
        {},
        {},
        {},
        {},
        {}
    ]);

    return relatedDocsCells;
};

const usePago10Complement = (comprobante: CNodeInterface, currentContent: Content[]): void => {
    // Verify if exists pago10 complement
    const pago10 = comprobante.searchNode('cfdi:Complemento', 'pago10:Pagos');
    if (!pago10) return;

    const pagos = pago10.searchNodes('pago10:Pago');
    if (pagos.length > 0) {
        for (const pago of pagos) {
            const doctoRelacionados = pago.searchNodes('pago10:DoctoRelacionado');
            currentContent.push({
                style: 'tableContent',
                table: {
                    widths: [95, '*', 95, '*'],
                    body: [
                        [
                            {
                                text: 'INFORMACIÓN DE PAGO',
                                style: 'tableHeader',
                                colSpan: 4,
                                alignment: 'center'
                            },
                            {},
                            {},
                            {}
                        ],
                        ['FECHA:', pago.get('FechaPago'), 'FORMA PAGO:', pago.get('FormaDePagoP')],
                        ['MONEDA:', pago.get('MonedaP'), 'MONTO:', formatCurrency(pago.get('Monto') || '0')],
                        pago.offsetExists('TipoCambioP')
                            ? ['TIPO DE CAMBIO:', pago.get('TipoCambioP'), '', '']
                            : ['', '', '', '']
                    ]
                },
                layout: 'lightHorizontalLines'
            });
            currentContent.push('\n');
            currentContent.push({
                style: 'tableList',
                table: {
                    widths: ['*', 'auto', 'auto', 30, 20, 'auto', 'auto', 'auto'],
                    body: generateRelatedDocsContent(doctoRelacionados)
                },
                layout: {
                    fillColor(i: number): string | null {
                        return i % 2 !== 0 ? '#CCCCCC' : null;
                    }
                }
            });
            currentContent.push('\n');
        }
    }
};

export { usePago10Complement };
