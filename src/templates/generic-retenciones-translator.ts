import { DocumentTranslatorInterface } from './document-translator-interface';
import { RetencionesData } from '../retenciones-data';
import {
    Content,
    ContentColumns,
    ContentTable,
    TableCell,
    TableLayout,
    TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { CNodeInterface, CNodes } from '@nodecfdi/cfdiutils-common';
import { breakEveryNCharacters } from '../utils/break-characters';

export class GenericRetencionesTranslator implements DocumentTranslatorInterface<RetencionesData> {
    public version = '1.0';

    protected tableLayoutBordered(): TableLayout {
        return {
            hLineWidth: (i, node): number => {
                if (i === 0 || i === node.table.body.length) {
                    return 1;
                }
                return i === node.table.headerRows ? 2 : 1;
            },
            vLineWidth: (i, node): number => {
                return i === 0 || i === node.table.widths?.length ? 1 : 0;
            },
            hLineColor: (i, node): string => {
                return i === 0 || i === node.table.body.length ? 'black' : 'gray';
            },
            paddingLeft(i): number {
                return i === 0 ? 0 : 8;
            },
            paddingRight(i, node): number {
                return i === (node.table.widths?.length || 0) - 1 ? 0 : 8;
            },
        };
    }

    protected generateFooter(version: string, uuid: string, currentPage: number, pageCount: number): Content {
        return {
            style: 'tableContent',
            table: {
                widths: ['auto', '*', 'auto', 'auto'],
                body: [
                    [
                        {
                            text: `Este documento es una representación impresa de un Comprobante Fiscal Digital por Internet que ampara Retenciones e Información de Pagos versión ${version}`,
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

    protected generateTopContent(retenciones: CNodeInterface, logo?: string): Content {
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
                            ['FOLIO:', retenciones.get('FolioInt')],
                            ['FECHA:', retenciones.get('FechaExp')],
                            ['COMPROBANTE:', 'RETENCIÓN'],
                            ['VERSIÓN:', this.version],
                        ],
                    },
                    layout: 'lightHorizontalLines',
                },
            ],
        };
        if (logo) {
            (header.columns[0] as ContentTable).table.body[0][0] = { image: logo, fit: [80, 80] };
            (header.columns[0] as ContentTable).table.widths = ['*'];
        }
        return header;
    }

    protected generateEmisorContent(emisor: CNodeInterface): Content {
        const body: TableCell[][] = [];
        body.push([
            {
                text: 'EMISOR',
                style: 'tableHeader',
                colSpan: 4,
                alignment: 'center',
            },
            {},
            {},
            {},
        ]);
        body.push([
            'NOMBRE:',
            emisor.get('NomDenRazSocE'),
            'RFC:',
            emisor.get(this.version === '1.0' ? 'RFCEmisor' : 'RfcE'),
        ]);

        if (this.version === '2.0') {
            body.push(['REGIMEN FISCAL:', emisor.get('RegimenFiscalE'), '', '']);
        }

        return {
            style: 'tableContent',
            table: {
                widths: ['auto', '*', 'auto', 'auto'],
                body: body,
            },
            layout: this.tableLayoutBordered(),
        };
    }

    protected generateReceptorContent(receptor: CNodeInterface): Content {
        const nacionalidad = receptor.get(this.version === '1.0' ? 'Nacionalidad' : 'NacionalidadR');
        const infoReceptor: TableCell[] = [];
        let domicilioFiscal = '';
        if (nacionalidad === 'Nacional') {
            const nacional = receptor.searchNode('retenciones:Nacional');
            if (nacional) {
                infoReceptor.push(
                    'NOMBRE:',
                    nacional.get('NomDenRazSocR'),
                    'RFC:',
                    nacional.get(this.version === '1.0' ? 'RFCRecep' : 'RfcR')
                );
                domicilioFiscal = nacional.get('DomicilioFiscalR');
            }
        } else {
            const extranjero = receptor.searchNode('retenciones:Extranjero');
            if (extranjero) {
                infoReceptor.push(
                    'NOMBRE:',
                    extranjero.get('NomDenRazSocR'),
                    'NUM. REG. ID TRIB.:',
                    extranjero.get('NumRegIdTrib')
                );
            }
        }
        const body: TableCell[][] = [];
        body.push([
            {
                text: 'RECEPTOR',
                style: 'tableHeader',
                colSpan: 4,
                alignment: 'center',
            },
            {},
            {},
            {},
        ]);
        body.push([
            'NACIONALIDAD:',
            nacionalidad,
            this.version === '2.0' ? 'DOMICILIO FISCAL:' : '',
            this.version === '2.0' ? domicilioFiscal : '',
        ]);
        body.push(infoReceptor);
        return {
            style: 'tableContent',
            table: {
                widths: ['auto', '*', 'auto', 'auto'],
                body: body,
            },
            layout: this.tableLayoutBordered(),
        };
    }

    protected generatePeriodoContent(periodo: CNodeInterface, claveRet: string): Content {
        return {
            style: 'tableContent',
            table: {
                widths: ['*', '*', '*', '*'],
                body: [
                    [
                        {
                            text: 'PERIODO MES INICIAL',
                            style: 'tableHeader',
                            alignment: 'left',
                        },
                        {
                            text: 'PERIODO MES FINAL',
                            style: 'tableHeader',
                            alignment: 'left',
                        },
                        {
                            text: 'PERIODO EJERCICIO ANUAL',
                            style: 'tableHeader',
                            alignment: 'left',
                        },
                        {
                            text: 'TIPO DE RETENCION',
                            style: 'tableHeader',
                            alignment: 'left',
                        },
                    ],
                    [
                        periodo.get('MesIni'),
                        periodo.get('MesFin'),
                        periodo.get(this.version === '1.0' ? 'Ejerc' : 'Ejercicio'),
                        claveRet,
                    ],
                ],
            },
            layout: this.tableLayoutBordered(),
        };
    }

    protected generateImpuestosRetenidos(impuestosRetenidos: CNodeInterface[]): TableCell[][] {
        const rowsRetenciones: TableCell[][] = [];
        if (impuestosRetenidos.length > 0) {
            rowsRetenciones.push([
                {
                    text: 'IMPUESTOS RETENIDOS',
                    style: 'tableHeader',
                    colSpan: 3,
                    alignment: 'center',
                },
                {},
                {},
            ]);
            rowsRetenciones.push([
                {
                    text: 'TIPO DE IMPUESTO',
                    style: 'tableSubHeader',
                    fillColor: '#eeeeff',
                    alignment: 'left',
                },
                {
                    text: 'TIPO DE PAGO',
                    style: 'tableSubHeader',
                    fillColor: '#eeeeff',
                    alignment: 'left',
                },
                {
                    text: 'MONTO RETENIDO',
                    style: 'tableSubHeader',
                    fillColor: '#eeeeff',
                    alignment: 'left',
                },
            ]);
        }
        impuestosRetenidos.forEach((impuestoRetenido) => {
            rowsRetenciones.push([
                impuestoRetenido.get(this.version === '1.0' ? 'Impuesto' : 'ImpuestoRet'),
                impuestoRetenido.get('TipoPagoRet'),
                impuestoRetenido.get(this.version === '1.0' ? 'montoRet' : 'MontoRet'),
            ]);
        });
        return rowsRetenciones;
    }

    protected generateTotales(totales: CNodeInterface): Content {
        const impuestosRetenidos = totales.searchNodes('retenciones:ImpRetenidos');
        const impuestosRetenidosBody: TableCell[][] = this.generateImpuestosRetenidos(impuestosRetenidos);
        return {
            style: 'tableContent',
            table: {
                widths: ['*', '*', '*', '*'],
                body: [
                    [
                        {
                            text: 'TOTALES',
                            style: 'tableHeader',
                            colSpan: 4,
                            alignment: 'center',
                        },
                        {},
                        {},
                        {},
                    ],
                    [
                        {
                            text: 'MONTO TOTAL DE OPERACIÓN',
                            style: 'tableSubHeader',
                            fillColor: '#eeeeff',
                            alignment: 'left',
                        },
                        {
                            text: 'MONTO TOTAL GRAVADO',
                            style: 'tableSubHeader',
                            fillColor: '#eeeeff',
                            alignment: 'left',
                        },
                        {
                            text: 'MONTO TOTAL EXENTO',
                            style: 'tableSubHeader',
                            fillColor: '#eeeeff',
                            alignment: 'left',
                        },
                        {
                            text: 'MONTO TOTAL RETENIDO',
                            style: 'tableSubHeader',
                            fillColor: '#eeeeff',
                            alignment: 'left',
                        },
                    ],
                    [
                        totales.get(this.version === '1.0' ? 'montoTotOperacion' : 'MontoTotOperacion'),
                        totales.get(this.version === '1.0' ? 'montoTotGrav' : 'MontoTotGrav'),
                        totales.get(this.version === '1.0' ? 'montoTotExent' : 'MontoTotExent'),
                        totales.get(this.version === '1.0' ? 'montoTotRet' : 'MontoTotRet'),
                    ],
                    [
                        {
                            style: 'tableContent',
                            margin: 5,
                            colSpan: 4,
                            table: {
                                widths: ['*', '*', '*'],
                                body: impuestosRetenidosBody,
                            },
                            layout: this.tableLayoutBordered(),
                        },
                        {},
                        {},
                        {},
                    ],
                ],
            },
            layout: this.tableLayoutBordered(),
        };
    }

    protected generateStampContent(data: RetencionesData): Content {
        const retenciones = data.retenciones();
        const tfd = data.timbreFiscalDigital();
        const tfdVersion = tfd.get(this.version === '1.0' ? 'version' : 'Version');
        const tfdSourceString = data.tfdSourceString();
        const qrUrl = data.qrUrl();
        const tfdCellsTable: TableCell[][] = [];
        if (tfd) {
            tfdCellsTable.push(
                [
                    {
                        colSpan: 1,
                        rowSpan: 8,
                        qr: qrUrl,
                        fit: 100,
                    },
                    '',
                    '',
                ],
                [
                    '',
                    'NUMERO SERIE CERTIFICADO SAT',
                    tfd.get(tfdVersion === '1.0' ? 'noCertificadoSAT' : 'NoCertificadoSAT'),
                ],
                [
                    '',
                    'NUMERO SERIE CERTIFICADO EMISOR',
                    retenciones.get(this.version === '1.0' ? 'NumCert' : 'NoCertificado'),
                ],
                ['', 'FECHA HORA CERTIFICACIÓN', tfd.get('FechaTimbrado')],
                ['', 'FOLIO FISCAL UUID', tfd.get('UUID')],
                [
                    '',
                    'SELLO DIGITAL',
                    breakEveryNCharacters(tfd.get(tfdVersion === '1.0' ? 'selloCFD' : 'SelloCFD'), 86),
                ],
                [
                    '',
                    'SELLO DEL SAT',
                    breakEveryNCharacters(tfd.get(tfdVersion === '1.0' ? 'selloSAT' : 'SelloSAT'), 86),
                ]
            );
        }
        tfdCellsTable.push([
            '',
            'CADENA ORIGINAL CC:',
            {
                text: breakEveryNCharacters(tfdSourceString, 86),
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

    protected contentService(service: CNodeInterface): TableCell[][] {
        const tableService: TableCell[][] = [];
        // SubHeaders per service
        tableService.push([
            {
                text: 'FORMA DE PAGO',
                style: 'tableSubHeader',
                fillColor: '#eeeeff',
                alignment: 'left',
            },
            {
                text: 'TIPO DE SERVICIO',
                style: 'tableSubHeader',
                fillColor: '#eeeeff',
                alignment: 'left',
            },
            {
                text: 'FECHA DE PAGO',
                style: 'tableSubHeader',
                fillColor: '#eeeeff',
                alignment: 'left',
            },
            {
                text: 'PRECIO DE SERVICIO',
                style: 'tableSubHeader',
                fillColor: '#eeeeff',
                alignment: 'left',
            },
        ]);
        tableService.push([
            service.get('FormaPagoServ'),
            service.get('TipoDeServ'),
            service.get('FechaServ'),
            service.get('PrecioServSinIVA'),
        ]);
        if (service.offsetExists('SubTipServ') || service.offsetExists('RFCTerceroAutorizado')) {
            tableService.push([
                {
                    text: 'SUBTIPO DE SERVICIO',
                    style: 'tableSubHeader',
                    fillColor: '#eeeeff',
                    alignment: 'left',
                },
                {
                    text: 'RFC TERCERO AUTORIZADO',
                    style: 'tableSubHeader',
                    fillColor: '#eeeeff',
                    alignment: 'left',
                },
                '',
                '',
            ]);
            tableService.push([service.get('SubTipServ'), service.get('RFCTerceroAutorizado'), '', '']);
        }
        const impuestosTrasladadosDelServicio = service.searchNode(
            'plataformasTecnologicas:ImpuestosTrasladadosdelServicio'
        );
        const contribucionGubernamental = service.searchNode('plataformasTecnologicas:ContribucionGubernamental');
        const comisionDelServicio = service.searchNode('plataformasTecnologicas:ComisionDelServicio');

        if (impuestosTrasladadosDelServicio) {
            tableService.push([
                {
                    style: 'tableContent',
                    margin: 3,
                    table: {
                        widths: ['*', '*', '*', '*', '*'],
                        body: [
                            [
                                {
                                    text: 'IMPUESTOS TRASLADADOS DEL SERVICIO',
                                    style: 'tableHeader',
                                    colSpan: 5,
                                    alignment: 'center',
                                },
                                {},
                                {},
                                {},
                                {},
                            ],
                            [
                                {
                                    text: 'IMPUESTO BASE',
                                    style: 'tableSubHeader',
                                    fillColor: '#eeeeff',
                                    alignment: 'left',
                                },
                                {
                                    text: 'IMPUESTO',
                                    style: 'tableSubHeader',
                                    fillColor: '#eeeeff',
                                    alignment: 'left',
                                },
                                {
                                    text: 'TIPO FACTOR',
                                    style: 'tableSubHeader',
                                    fillColor: '#eeeeff',
                                    alignment: 'left',
                                },
                                {
                                    text: 'TASA O CUOTA',
                                    style: 'tableSubHeader',
                                    fillColor: '#eeeeff',
                                    alignment: 'left',
                                },
                                {
                                    text: 'IMPORTE',
                                    style: 'tableSubHeader',
                                    fillColor: '#eeeeff',
                                    alignment: 'left',
                                },
                            ],
                            [
                                impuestosTrasladadosDelServicio.get('Base'),
                                impuestosTrasladadosDelServicio.get('Impuesto'),
                                impuestosTrasladadosDelServicio.get('TipoFactor'),
                                impuestosTrasladadosDelServicio.get('TasaCuota'),
                                impuestosTrasladadosDelServicio.get('Importe'),
                            ],
                        ],
                    },
                    layout: this.tableLayoutBordered(),
                    colSpan: 4,
                },
                {},
                {},
                {},
            ]);
        }

        if (contribucionGubernamental) {
            tableService.push([
                {
                    style: 'tableContent',
                    margin: 3,
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [
                                {
                                    text: 'CONTRIBUCIÓN GUBERNAMENTAL',
                                    style: 'tableHeader',
                                    colSpan: 2,
                                    alignment: 'center',
                                },
                                {},
                            ],
                            [
                                {
                                    text: 'ESTADO',
                                    style: 'tableSubHeader',
                                    fillColor: '#eeeeff',
                                    alignment: 'left',
                                },
                                {
                                    text: 'IMPORTE',
                                    style: 'tableSubHeader',
                                    fillColor: '#eeeeff',
                                    alignment: 'left',
                                },
                            ],
                            [
                                contribucionGubernamental.get('EntidadDondePagaLaContribucion'),
                                contribucionGubernamental.get('ImpContrib'),
                            ],
                        ],
                    },
                    layout: this.tableLayoutBordered(),
                    colSpan: 4,
                },
                {},
                {},
                {},
            ]);
        }

        if (comisionDelServicio) {
            tableService.push([
                {
                    style: 'tableContent',
                    margin: 3,
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                {
                                    text: 'COMISIÓN DEL SERVICIO',
                                    style: 'tableHeader',
                                    colSpan: 3,
                                    alignment: 'center',
                                },
                                {},
                                {},
                            ],
                            [
                                {
                                    text: 'BASE',
                                    style: 'tableSubHeader',
                                    fillColor: '#eeeeff',
                                    alignment: 'left',
                                },
                                {
                                    text: 'PORCENTAJE',
                                    style: 'tableSubHeader',
                                    fillColor: '#eeeeff',
                                    alignment: 'left',
                                },
                                {
                                    text: 'IMPORTE',
                                    style: 'tableSubHeader',
                                    fillColor: '#eeeeff',
                                    alignment: 'left',
                                },
                            ],
                            [
                                comisionDelServicio.get('Base'),
                                comisionDelServicio.get('Porcentaje'),
                                comisionDelServicio.get('Importe'),
                            ],
                        ],
                    },
                    layout: this.tableLayoutBordered(),
                    colSpan: 4,
                },
                {},
                {},
                {},
            ]);
        }
        return tableService;
    }

    protected generateContentPerService(servicios: CNodes): TableCell[][] {
        const tableServices: TableCell[][] = [];
        // Header global
        tableServices.push([
            {
                text: 'SERVICIOS',
                style: 'tableHeader',
                alignment: 'center',
            },
        ]);
        // Per Services
        servicios.forEach((servicio) => {
            tableServices.push([
                {
                    margin: 5,
                    style: 'tableContent',
                    table: {
                        widths: ['*', '*', '*', '*'],
                        body: this.contentService(servicio),
                    },
                    layout: this.tableLayoutBordered(),
                },
            ]);
        });
        return tableServices;
    }

    protected generatePlataformasTecnologicas(plataformasTecnologicas: CNodeInterface): Content {
        const servicios = plataformasTecnologicas.searchNodes(
            'plataformasTecnologicas:Servicios',
            'plataformasTecnologicas:DetallesDelServicio'
        );
        const bodyPlataformasTecnologicas: TableCell[][] = [];
        // Header global
        bodyPlataformasTecnologicas.push([
            {
                text: 'SERVICIO MEDIANTE PLATAFORMAS TECNOLÓGICAS',
                style: 'tableHeader',
                colSpan: 5,
                alignment: 'center',
            },
            {},
            {},
            {},
            {},
        ]);
        // SubHeaders of global
        bodyPlataformasTecnologicas.push([
            {
                text: 'VERSION',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
            },
            {
                text: 'PERIODICIDAD',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
            },
            {
                text: 'NUMERO SERVICIOS',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
            },
            {
                text: 'SUBTOTAL OPERACIONES',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
            },
            {
                text: 'TOTAL IVA',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
            },
        ]);
        bodyPlataformasTecnologicas.push([
            plataformasTecnologicas.get('Version'),
            plataformasTecnologicas.get('Periodicidad'),
            plataformasTecnologicas.get('NumServ'),
            plataformasTecnologicas.get('MonTotServSIVA'),
            plataformasTecnologicas.get('TotalIVATrasladado'),
        ]);
        bodyPlataformasTecnologicas.push([
            {
                text: 'TOTAL IVA RETENIDO',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
            },
            {
                text: 'TOTAL ISR RETENIDO',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
            },
            {
                text: 'DIFERENCIA IVA',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
            },
            {
                text: 'TOTAL USO DE PLATAFORMA',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
            },
            {
                text: 'TOTAL CONTRIBUCIÓN GUBERNAMENTAL',
                fillColor: '#eeeeff',
                style: 'tableSubHeader',
                alignment: 'left',
            },
        ]);
        bodyPlataformasTecnologicas.push([
            plataformasTecnologicas.get('TotalIVARetenido'),
            plataformasTecnologicas.get('TotalISRRetenido'),
            plataformasTecnologicas.get('DifIVAEntregadoPrestServ'),
            plataformasTecnologicas.get('MonTotalporUsoPlataforma'),
            plataformasTecnologicas.get('MonTotalContribucionGubernamental'),
        ]);

        if (servicios.length > 0) {
            bodyPlataformasTecnologicas.push([
                {
                    style: 'tableContent',
                    margin: 3,
                    table: {
                        widths: ['*'],
                        body: this.generateContentPerService(servicios),
                    },
                    layout: this.tableLayoutBordered(),
                    colSpan: 5,
                },
                {},
                {},
                {},
                {},
            ]);
        }

        return {
            style: 'tableContent',
            table: {
                widths: ['*', '*', '*', '*', '*'],
                body: bodyPlataformasTecnologicas,
            },
            layout: this.tableLayoutBordered(),
        };
    }

    protected generateContent(data: RetencionesData): Content {
        const retenciones = data.retenciones();
        const emisor = data.emisor();
        const receptor = data.receptor();
        const periodo = data.periodo();
        const totales = data.totales();
        const additionalFields = data.additionalFields();
        const plataformasTecnologicas = retenciones.searchNode(
            'retenciones:Complemento',
            'plataformasTecnologicas:ServiciosPlataformasTecnologicas'
        );
        const content: Content[] = [];
        content.push(this.generateTopContent(retenciones, data.logo()));
        content.push('\n');
        content.push(this.generateEmisorContent(emisor));
        content.push('\n');
        content.push(this.generateReceptorContent(receptor));
        content.push('\n');
        content.push('\n');
        content.push(this.generatePeriodoContent(periodo, retenciones.get('CveRetenc')));
        content.push('\n');
        content.push(this.generateTotales(totales));
        content.push('\n');
        if (plataformasTecnologicas) {
            content.push(this.generatePlataformasTecnologicas(plataformasTecnologicas));
            content.push('\n');
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
        content.push(this.generateStampContent(data));
        return content;
    }

    public translate(data: RetencionesData): TDocumentDefinitions {
        const retenciones = data.retenciones();
        const tfd = data.timbreFiscalDigital();
        this.version = retenciones.get('Version');
        return {
            content: this.generateContent(data),
            styles: {
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'black',
                },
                tableSubHeader: {
                    bold: true,
                    fontSize: 9,
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
                this.generateFooter(this.version, tfd.get('UUID'), currentPage, pageCount),
        };
    }
}
