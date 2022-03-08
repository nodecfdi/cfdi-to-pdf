import { DocumentTranslatorInterface } from './document-translator-interface';
import { CfdiData } from '../cfdi-data';
import { Column, Content, ContentColumns, ContentTable, TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CNodeInterface, CNodes } from '@nodecfdi/cfdiutils-common';
import { toCurrency } from '../utils/currency';

export class GenericTranslator implements DocumentTranslatorInterface {
    protected generateFooter(version: string, uuid: string, currentPage: number, pageCount: number): Content {
        return {
            style: 'tableContent',
            table: {
                widths: ['auto', '*', 'auto', 'auto'],
                body: [
                    [
                        {
                            text: `Este documento es una representación impresa de un Comprobante Fiscal Digital a través de Internet versión ${version}`,
                            style: 'tableList',
                            colSpan: 4,
                            alignment: 'center',
                        },
                        {},
                        {},
                        {},
                    ],
                    [
                        {
                            text: `UUID: ${uuid} - Página ${currentPage} de ${pageCount}`,
                            style: 'tableList',
                            colSpan: 4,
                            alignment: 'center',
                        },
                        {},
                        {},
                        {},
                    ],
                ],
            },
            layout: 'noBorders',
        };
    }

    protected generateTopContent(comprobante: CNodeInterface, logo?: string): Content {
        const header: ContentColumns = {
            columns: [
                {
                    width: '*',
                    alignment: 'left',
                    style: 'tableContent',
                    table: {
                        widths: ['*'],
                        body: [['']],
                    },
                    layout: 'lightHorizontalLines',
                },
                {
                    width: 'auto',
                    alignment: 'center',
                    style: 'tableContent',
                    table: {
                        widths: ['auto', 'auto'],
                        body: [
                            ['SERIE:', comprobante.get('Serie')],
                            ['FOLIO:', comprobante.get('Folio')],
                            ['FECHA:', comprobante.get('Fecha')],
                            ['EXPEDICIÓN:', comprobante.get('LugarExpedicion')],
                            ['COMPROBANTE:', comprobante.get('TipoDeComprobante')],
                            ['VERSIÓN:', comprobante.get('Version')],
                        ],
                    },
                    layout: 'lightHorizontalLines',
                },
            ],
        };
        if (logo) {
            (header.columns[0] as ContentTable).table.body[0][0] = { image: logo, fit: [150, 150] };
            (header.columns[0] as ContentTable).table.widths = ['*'];
        }
        return header;
    }

    protected generateEmisorContent(emisor: CNodeInterface): Content {
        return {
            style: 'tableContent',
            table: {
                widths: ['auto', '*', 'auto', 'auto'],
                body: [
                    [
                        {
                            text: 'EMISOR',
                            style: 'tableHeader',
                            colSpan: 4,
                            alignment: 'center',
                        },
                        {},
                        {},
                        {},
                    ],
                    ['NOMBRE:', emisor.get('Nombre'), 'RFC:', emisor.get('Rfc')],
                    ['REGIMEN FISCAL:', { colSpan: 3, text: emisor.get('RegimenFiscal') }, {}, {}],
                ],
            },
            layout: 'lightHorizontalLines',
        };
    }

    protected generateAddress(receptor: CNodeInterface, address?: string): TableCell[][] {
        const tableCell: TableCell[][] = [];
        const cellAddress: TableCell[] = [];
        if (address || receptor.offsetExists('DomicilioFiscalReceptor')) {
            cellAddress.push('DOMICILIO:', `${address ? address + ' ' : ''}${receptor.get('DomicilioFiscalReceptor')}`);
        }
        cellAddress.push('USO CFDI', {
            colSpan: address || receptor.offsetExists('DomicilioFiscalReceptor') ? 1 : 3,
            text: receptor.get('UsoCFDI'),
        });
        tableCell.push(cellAddress);
        if (receptor.offsetExists('ResidenciaFiscal') && receptor.offsetExists('NumRegIdTrib')) {
            tableCell.push([
                'RESIDENCIA FISCAL:',
                receptor.get('ResidenciaFiscal'),
                'NUMERO ID TRIB.:',
                receptor.get('NumRegIdTrib'),
            ]);
        }
        return tableCell;
    }

    protected generateReceptorContent(receptor: CNodeInterface, address?: string): Content {
        const receptorContent: Content = {
            style: 'tableContent',
            table: {
                widths: ['auto', '*', 'auto', 'auto'],
                body: [
                    [
                        {
                            text: 'RECEPTOR',
                            style: 'tableHeader',
                            colSpan: 4,
                            alignment: 'center',
                        },
                        {},
                        {},
                        {},
                    ],
                    ['NOMBRE:', receptor.get('Nombre'), 'RFC:', receptor.get('Rfc')],
                    ...this.generateAddress(receptor, address),
                ],
            },
            layout: 'lightHorizontalLines',
        };

        if (receptor.offsetExists('RegimenFiscalReceptor')) {
            receptorContent.table.body.push([
                'REGIMEN FISCAL',
                {
                    colSpan: 3,
                    text: receptor.get('RegimenFiscalReceptor'),
                },
                {},
                {},
            ]);
        }

        return receptorContent;
    }

    protected generateGeneralInvoiceInfoContent(comprobante: CNodeInterface): Content {
        return {
            style: 'tableContent',
            table: {
                widths: [95, '*', 95, '*'],
                body: [
                    [
                        {
                            text: 'DATOS GENERALES DEL COMPROBANTE',
                            style: 'tableHeader',
                            colSpan: 4,
                            alignment: 'center',
                        },
                        {},
                        {},
                        {},
                    ],
                    ['MONEDA:', comprobante.get('Moneda'), 'FORMA PAGO:', comprobante.get('FormaPago')],
                    [
                        'METODO DE PAGO;',
                        comprobante.get('MetodoPago'),
                        'CONDICIONES DE PAGO:',
                        comprobante.get('CondicionesDePago'),
                    ],
                ],
            },
            layout: 'lightHorizontalLines',
        };
    }

    protected formatCurrency(currency: number | string): string {
        return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'symbol' }).format(
            Number(currency)
        );
    }

    protected generateImpuestos(concepto: CNodeInterface): Content[] {
        const impuestosContent: Content[] = [];
        const traslados = concepto.searchNodes('cfdi:Impuestos', 'cfdi:Traslados', 'cfdi:Traslado');
        const retenciones = concepto.searchNodes('cfdi:Impuestos', 'cfdi:Retenciones', 'cfdi:Retencion');
        if (traslados.length > 0) {
            impuestosContent.push('Traslados');
            const contentT = traslados.map<TableCell[]>((traslado) => {
                return [
                    traslado.get('Impuesto'),
                    traslado.get('TipoFactor') === 'Exento'
                        ? 'EXENTO'
                        : this.formatCurrency(traslado.get('Importe') || '0'),
                ];
            });
            impuestosContent.push({
                table: {
                    body: contentT,
                },
                layout: 'noBorders',
            });
        }
        if (retenciones.length > 0) {
            impuestosContent.push('Retenciones');
            const contentR = retenciones.map<TableCell[]>((retencion) => {
                return [retencion.get('Impuesto'), this.formatCurrency(retencion.get('Importe') || '0')];
            });
            impuestosContent.push({
                table: {
                    body: contentR,
                },
                layout: 'noBorders',
            });
        }
        return impuestosContent;
    }

    protected generateConceptsContent(conceptos: CNodes): Content {
        const rowsConceptos = conceptos.map<TableCell[]>((concepto) => {
            return [
                concepto.get('ClaveProdServ'),
                concepto.get('Cantidad'),
                concepto.get('ClaveUnidad'),
                concepto.get('NoIdentificacion') || '(Ninguno)',
                concepto.get('Descripcion'),
                this.formatCurrency(concepto.get('ValorUnitario') || '0'),
                this.formatCurrency(concepto.get('Descuento') || '0'),
                {
                    colSpan: 2,
                    stack: this.generateImpuestos(concepto),
                },
                '',
                this.formatCurrency(concepto.get('Importe') || '0'),
            ];
        });

        rowsConceptos.unshift([
            'ClaveProdServ',
            'Cant',
            'Clave Unidad',
            'Identificación',
            'Descripción',
            'Valor Unitario',
            'Descuento',
            {
                colSpan: 2,
                text: 'Impuesto',
            },
            '',
            'Importe',
        ]);

        return {
            style: 'tableList',
            table: {
                widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: rowsConceptos,
            },
            layout: {
                fillColor(i): string | null {
                    return i === 0 ? '#CCCCCC' : null;
                },
            },
        };
    }

    protected generateCurrencyRelatedInfo(comprobante: CNodeInterface, relacionados?: CNodeInterface): Content {
        const totalImpuestosTrasladados = comprobante.searchAttribute('cfdi:Impuestos', 'TotalImpuestosTrasladados');
        const totalImpuestosRetenidos = comprobante.searchAttribute('cfdi:Impuestos', 'TotalImpuestosRetenidos');
        const contentColumns: Column[] = [];
        const relatedInfoAndImport: Column[] = [];
        relatedInfoAndImport.push({
            fontSize: 7,
            margin: [0, 5, 0, 0],
            columns: [
                { width: 'auto', text: 'IMPORTE CON LETRA:', margin: [0, 0, 5, 0] },
                {
                    width: 'auto',
                    text: toCurrency(parseFloat(comprobante.get('Total') || '0'), comprobante.get('Moneda')),
                },
                { width: '*', text: '' },
            ],
        });
        if (relacionados) {
            relatedInfoAndImport.push({
                fontSize: 7,
                margin: [0, 10, 0, 0],
                columns: [
                    {
                        width: 'auto',
                        text: 'TIPO RELACION:',
                        margin: [0, 0, 5, 0],
                    },
                    {
                        width: 'auto',
                        text: relacionados.get('TipoRelacion'),
                    },
                    {
                        width: '*',
                        text: '',
                    },
                ],
            });

            const uuidsArray = relacionados.searchNodes('cfdi:CfdiRelacionado').map((relacionado) => {
                return [`UUID: ${relacionado.get('UUID')}`];
            });

            relatedInfoAndImport.push({
                fontSize: 7,
                margin: [0, 5, 0, 0],
                table: {
                    widths: ['*'],
                    body: [['CFDIS RELACIONADOS'], ...uuidsArray],
                },
            });
        }
        contentColumns.push(relatedInfoAndImport);
        contentColumns.push({
            width: 'auto',
            alignment: 'right',
            style: 'tableContent',
            margin: [10, 0, 0, 0],
            table: {
                widths: ['auto', 'auto'],
                body: [
                    ['SUBTOTAL:', { text: this.formatCurrency(comprobante.get('SubTotal') || '0'), fontSize: 9 }],
                    ['DESCUENTO:', this.formatCurrency(comprobante.get('Descuento'))],
                    ['TOTAL IMP. TRASLADADOS:', this.formatCurrency(totalImpuestosTrasladados || '0')],
                    ['TOTAL IMP. RETENIDOS:', this.formatCurrency(totalImpuestosRetenidos || '0')],
                    [
                        {
                            text: 'TOTAL:',
                            fontSize: 11,
                            bold: true,
                        },
                        { text: this.formatCurrency(comprobante.get('Total') || '0'), fontSize: 11, bold: true },
                    ],
                ],
            },
            layout: 'lightHorizontalLines',
        });

        return {
            columns: contentColumns,
        };
    }

    protected generateRelatedDocsContent(doctoRelacionados: CNodes): TableCell[][] {
        const relatedDocsCells = doctoRelacionados.map<TableCell[]>((doc) => {
            return [
                doc.get('IdDocumento'),
                doc.get('MetodoDePagoDR'),
                doc.get('MonedaDR'),
                doc.get('TipoCambioDR'),
                doc.get('NumParcialidad'),
                this.formatCurrency(doc.get('ImpSaldoAnt') || '0'),
                this.formatCurrency(doc.get('ImpPagado') || '0'),
                this.formatCurrency(doc.get('ImpSaldoInsoluto') || '0'),
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
            'Importe Saldo Insoluto',
        ]);
        relatedDocsCells.unshift([
            {
                text: 'DOCUMENTOS RELACIONADOS',
                style: 'tableHeader',
                colSpan: 8,
                alignment: 'center',
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
        ]);
        return relatedDocsCells;
    }

    protected generatePaymentsContent(pagos: CNodes): Content[] {
        const paymentContent = pagos.map<Content>((pago) => {
            const doctoRelacionados = pago.searchNodes('pago10:DoctoRelacionado');
            return [
                {
                    style: 'tableContent',
                    table: {
                        widths: [95, '*', 95, '*'],
                        body: [
                            [
                                {
                                    text: 'INFORMACIÓN DE PAGO',
                                    style: 'tableHeader',
                                    colSpan: 4,
                                    alignment: 'center',
                                },
                                {},
                                {},
                                {},
                            ],
                            ['FECHA:', pago.get('FechaPago'), 'FORMA PAGO:', pago.get('FormaDePagoP')],
                            ['MONEDA:', pago.get('MonedaP'), 'MONTO:', this.formatCurrency(pago.get('Monto') || '0')],
                            pago.offsetExists('TipoCambioP')
                                ? ['TIPO DE CAMBIO:', pago.get('TipoCambioP'), '', '']
                                : ['', '', '', ''],
                        ],
                    },
                    layout: 'lightHorizontalLines',
                },
                '\n',
                {
                    style: 'tableList',
                    table: {
                        widths: ['*', 'auto', 'auto', 30, 20, 'auto', 'auto', 'auto'],
                        body: this.generateRelatedDocsContent(doctoRelacionados),
                    },
                    layout: {
                        fillColor(i: number): string | null {
                            return i % 2 !== 0 ? '#CCCCCC' : null;
                        },
                    },
                },
                '\n',
            ];
        });
        return ([] as Content[]).concat.apply([], paymentContent);
    }

    protected breakEveryNCharacters(str = '', n = 86): string {
        const arr = str.match(new RegExp(`.{1,${n}}`, 'g'));
        let result = str;
        if (arr) {
            result = arr.reduce((a, b) => {
                const check = b.substring(0, Math.floor(n / 3));
                if (a.length + b.length < n || check.includes('+') || check.includes('|')) {
                    return `${a}${b}`;
                }
                return `${a}\n${b}`;
            });
        }
        return result;
    }

    protected generateStampContent(cfdiData: CfdiData): Content {
        const comprobante = cfdiData.comprobante();
        const tfd = cfdiData.timbreFiscalDigital();
        const tfdSourceString = cfdiData.tfdSourceString();
        const qrUrl = cfdiData.qrUrl();
        const tfdCellsTable: TableCell[][] = [];
        if (tfd) {
            tfdCellsTable.push(
                [
                    {
                        colSpan: 1,
                        rowSpan: 8,
                        qr: qrUrl,
                        fit: 140,
                    },
                    '',
                    '',
                ],
                ['', 'NUMERO SERIE CERTIFICADO SAT', tfd.get('NoCertificadoSAT')],
                ['', 'NUMERO SERIE CERTIFICADO EMISOR', comprobante.get('NoCertificado')],
                ['', 'FECHA HORA CERTIFICACIÓN', tfd.get('FechaTimbrado')],
                ['', 'FOLIO FISCAL UUID', tfd.get('UUID')],
                ['', 'SELLO DIGITAL', this.breakEveryNCharacters(tfd.get('SelloCFD'), 86)],
                ['', 'SELLO DEL SAT', this.breakEveryNCharacters(tfd.get('SelloSAT'), 86)]
            );
        }
        tfdCellsTable.push([
            '',
            'CADENA ORIGINAL CC:',
            {
                text: this.breakEveryNCharacters(tfdSourceString, 86),
            },
        ]);
        return {
            style: 'tableSat',
            table: {
                widths: ['auto', 'auto', '*'],
                body: tfdCellsTable,
            },
            layout: 'lightHorizontalLines',
        };
    }

    protected generateContent(cfdiData: CfdiData): Content {
        const comprobante = cfdiData.comprobante();
        const emisor = cfdiData.emisor();
        const receptor = cfdiData.receptor();
        const relacionados = comprobante.searchNode('cfdi:CfdiRelacionados');
        const conceptos = comprobante.searchNodes('cfdi:Conceptos', 'cfdi:Concepto');
        const pagos = comprobante.searchNodes('cfdi:Complemento', 'pago10:Pagos', 'pago10:Pago');
        const additionalFields = cfdiData.additionalFields();

        let content: Content[] = [];
        content.push(this.generateTopContent(comprobante, cfdiData.logo()));
        content.push('\n');
        content.push(this.generateEmisorContent(emisor));
        content.push('\n');
        content.push(this.generateReceptorContent(receptor, cfdiData.address()));
        content.push('\n');
        if (comprobante.get('TipoDeComprobante') === 'I' || comprobante.get('TipoDeComprobante') === 'E') {
            content.push(this.generateGeneralInvoiceInfoContent(comprobante));
            content.push('\n');
        }
        content.push(this.generateConceptsContent(conceptos));
        content.push('\n');
        if (comprobante.get('TipoDeComprobante') === 'I' || comprobante.get('TipoDeComprobante') === 'E') {
            content.push(this.generateCurrencyRelatedInfo(comprobante, relacionados));
            content.push('\n');
        }
        if (comprobante.get('TipoDeComprobante') === 'P') {
            content = content.concat(this.generatePaymentsContent(pagos));
        }
        if (additionalFields) {
            additionalFields.forEach((element) => {
                content.push({
                    style: 'tableContent',
                    table: {
                        widths: ['*'],
                        body: [[{ text: element.title, style: 'tableHeader' }], [element.value]],
                    },
                    layout: 'lightHorizontalLines',
                });
                content.push('\n');
            });
        }

        content.push(this.generateStampContent(cfdiData));

        return content;
    }

    public translate(cfdiData: CfdiData): TDocumentDefinitions {
        const comprobante = cfdiData.comprobante();
        const tfd = cfdiData.timbreFiscalDigital();
        return {
            content: this.generateContent(cfdiData),
            styles: {
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'black',
                },
                tableContent: {
                    fontSize: 8,
                    color: 'black',
                    alignment: 'left',
                },
                tableList: {
                    fontSize: 7,
                    color: 'black',
                    alignment: 'center',
                },
                tableSat: {
                    fontSize: 5,
                    color: 'black',
                    alignment: 'left',
                },
            },
            defaultStyle: {
                font: 'Helvetica',
            },
            footer: (currentPage, pageCount) =>
                this.generateFooter(comprobante.get('Version'), tfd.get('UUID'), currentPage, pageCount),
        };
    }
}
