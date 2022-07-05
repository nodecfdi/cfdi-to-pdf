import { CNodeInterface, CNodes } from '@nodecfdi/cfdiutils-common';
import { Content, TableCell } from 'pdfmake/interfaces';
import { formatCurrency } from '../../utils/currency';

const generateRelatedDocsContent = (doctoRelacionados: CNodes): TableCell[][] => {
    const relatedDocsCells = doctoRelacionados.map<TableCell[]>((doc) => {
        return [
            doc.get('IdDocumento'),
            `${doc.get('Serie')}/${doc.get('Folio')}`,
            doc.get('MonedaDR'),
            doc.get('EquivalenciaDR'),
            doc.get('NumParcialidad'),
            formatCurrency(doc.get('ImpSaldoAnt') || '0'),
            formatCurrency(doc.get('ImpPagado') || '0'),
            formatCurrency(doc.get('ImpSaldoInsoluto') || '0')
        ];
    });
    relatedDocsCells.unshift([
        'UUID',
        'Serie / Folio',
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

const checkAndAddTotal = (totales: CNodeInterface, attribute: string, rowToInsert: TableCell[]): void => {
    if (totales.offsetExists(attribute)) {
        rowToInsert.push({
            text: `${attribute}: ${totales.get(attribute)}`,
            fontSize: 7
        });
    }
};

const generateTotalesInfoContent = (totales: CNodeInterface): TableCell[][] => {
    const totalesCells: TableCell[][] = [];

    const firstRow: TableCell[] = [];
    const secondRow: TableCell[] = [];

    checkAndAddTotal(totales, 'TotalRetencionesIVA', firstRow);
    checkAndAddTotal(totales, 'TotalRetencionesISR', firstRow);
    checkAndAddTotal(totales, 'TotalRetencionesIEPS', firstRow);
    checkAndAddTotal(totales, 'TotalTrasladosBaseIVA16', firstRow);
    checkAndAddTotal(totales, 'TotalTrasladosImpuestoIVA16', firstRow);

    checkAndAddTotal(totales, 'TotalTrasladosBaseIVA8', secondRow);
    checkAndAddTotal(totales, 'TotalTrasladosImpuestoIVA8', secondRow);
    checkAndAddTotal(totales, 'TotalTrasladosBaseIVA0', secondRow);
    checkAndAddTotal(totales, 'TotalTrasladosImpuestoIVA0', secondRow);
    checkAndAddTotal(totales, 'TotalTrasladosBaseIVAExento', secondRow);

    totalesCells.push([
        {
            text: 'Totales',
            colSpan: 2,
            alignment: 'center',
            bold: true,
            border: [true, true, false, true]
        },
        {},
        {
            text: `Monto Total: ${formatCurrency(totales.get('MontoTotalPagos'))}`,
            colSpan: 3,
            alignment: 'center',
            bold: true,
            border: [false, true, true, true]
        },
        {},
        {}
    ]);

    if (firstRow.length > 0) {
        const limit = 5 - firstRow.length;
        for (let i = 0; i < limit; i++) {
            firstRow.push({});
        }
        totalesCells.push(firstRow);
    }

    if (secondRow.length > 0) {
        const limit = 5 - secondRow.length;
        for (let i = 0; i < limit; i++) {
            secondRow.push({});
        }
        totalesCells.push(secondRow);
    }

    return totalesCells;
};

const usePago20Complement = (comprobante: CNodeInterface, currentContent: Content[]): void => {
    // Verify if exists pago20 complement
    const pago20 = comprobante.searchNode('cfdi:Complemento', 'pago20:Pagos');
    if (!pago20) return;

    const totales = pago20.searchNode('pago20:Totales');
    const pagos = pago20.searchNodes('pago20:Pago');

    if (pagos.length > 0 && totales !== undefined) {
        currentContent.push({
            style: 'tableContent',
            table: {
                widths: ['20%', '20%', '20%', '20%', '20%'],
                body: generateTotalesInfoContent(totales)
            }
        });
        currentContent.push('\n');
        for (const pago of pagos) {
            const doctoRelacionados = pago.searchNodes('pago20:DoctoRelacionado');
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
                            ? ['TIPO DE CAMBIO:', pago.get('TipoCambioP'), {}, {}]
                            : [{}, {}, {}, {}]
                    ]
                },
                layout: 'lightHorizontalLines'
            });
            currentContent.push({
                style: 'tableList',
                table: {
                    widths: ['*', 'auto', 'auto', 25, 20, 'auto', 'auto', 'auto'],
                    body: generateRelatedDocsContent(doctoRelacionados)
                },
                layout: {
                    fillColor(i: number): string | null {
                        return i % 2 !== 0 ? '#CCCCCC' : null;
                    }
                }
            });
            currentContent.push('\n');
            currentContent.push('\n');
        }
    }
};

export { usePago20Complement };
