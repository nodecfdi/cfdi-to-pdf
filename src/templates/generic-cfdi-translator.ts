import {
  type Column,
  type Content,
  type ContentColumns,
  type ContentTable,
  type Style,
  type TableCell,
  type TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { type CNodeInterface, type CNodes } from '@nodecfdi/cfdiutils-common';
import { formatCurrency, toCurrency, toNumber } from '../utils/currency.js';
import { breakEveryNCharacters } from '../utils/break-characters.js';
import { type CfdiData } from '../cfdi-data.js';
import { type CatalogsInterface } from '../catalogs/catalogs-interface.js';
import { type DocumentTranslatorInterface } from './document-translator-interface.js';
import { usePago10Complement } from './complements/pago10-complement.js';
import { usePago20Complement } from './complements/pago20-complement.js';
import { useImpLocal10Complement } from './complements/imp-local10-complement.js';

export class GenericCfdiTranslator implements DocumentTranslatorInterface<CfdiData> {
  public translate(cfdiData: CfdiData, defaultStyle: Style, catalogs: CatalogsInterface): TDocumentDefinitions {
    const comprobante = cfdiData.comprobante();
    const tfd = cfdiData.timbreFiscalDigital();

    return {
      content: this.generateContent(cfdiData, catalogs),
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
      defaultStyle,
      footer: (currentPage, pageCount) =>
        this.generateFooter(comprobante.get('Version'), tfd.get('UUID'), currentPage, pageCount),
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

  protected generateTopContent(comprobante: CNodeInterface, catalogs: CatalogsInterface, logo?: string): Content {
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
              ['COMPROBANTE:', catalogs.catTipoComprobante(comprobante.get('TipoDeComprobante'))],
              ['VERSIÓN:', comprobante.get('Version')],
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

  protected generateEmisorContent(emisor: CNodeInterface, catalogs: CatalogsInterface): Content {
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
              alignment: 'left',
            },
            {},
            {},
            {},
          ],
          ['NOMBRE:', emisor.get('Nombre'), 'RFC:', emisor.get('Rfc')],
          ['REGIMEN FISCAL:', { colSpan: 3, text: catalogs.catRegimenFiscal(emisor.get('RegimenFiscal')) }, {}, {}],
        ],
      },
      layout: 'lightHorizontalLines',
    };
  }

  protected generateAddress(receptor: CNodeInterface, catalogs: CatalogsInterface, address?: string): TableCell[][] {
    const tableCell: TableCell[][] = [];
    const cellAddress: TableCell[] = [];
    if (address ?? receptor.offsetExists('DomicilioFiscalReceptor')) {
      cellAddress.push('DOMICILIO:', `${address ? address + ' ' : ''}${receptor.get('DomicilioFiscalReceptor')}`);
    }

    cellAddress.push('USO CFDI', {
      colSpan: address ?? receptor.offsetExists('DomicilioFiscalReceptor') ? 1 : 3,
      text: catalogs.catUsoCFDI(receptor.get('UsoCFDI')),
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

  protected generateReceptorContent(receptor: CNodeInterface, catalogs: CatalogsInterface, address?: string): Content {
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
              alignment: 'left',
            },
            {},
            {},
            {},
          ],
          ['NOMBRE:', receptor.get('Nombre'), 'RFC:', receptor.get('Rfc')],
          ...this.generateAddress(receptor, catalogs, address),
        ],
      },
      layout: 'lightHorizontalLines',
    };

    if (receptor.offsetExists('RegimenFiscalReceptor')) {
      receptorContent.table.body.push([
        'REGIMEN FISCAL',
        {
          colSpan: 3,
          text: catalogs.catRegimenFiscal(receptor.get('RegimenFiscalReceptor')),
        },
        {},
        {},
      ]);
    }

    return receptorContent;
  }

  protected useGlobalInformation(
    comprobante: CNodeInterface,
    currentContent: Content[],
    catalogs: CatalogsInterface,
  ): void {
    const globalInformation = comprobante.searchNode('cfdi:InformacionGlobal');
    if (globalInformation === undefined) return;
    currentContent.push(
      {
        style: 'tableContent',
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              {
                text: 'INFORMACIÓN GLOBAL',
                style: 'tableHeader',
                colSpan: 3,
                alignment: 'left',
              },
              {},
              {},
            ],
            [
              `Periodicidad: ${catalogs.catPeriodicidad(globalInformation.get('Periodicidad'))}`,
              `Meses: ${catalogs.catMeses(globalInformation.get('Meses'))}`,
              `Año: ${globalInformation.get('Año')}`,
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },
      '\n',
    );
  }

  protected generateGeneralInvoiceInfoContent(comprobante: CNodeInterface, catalogs: CatalogsInterface): Content {
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
              alignment: 'left',
            },
            {},
            {},
            {},
          ],
          ['MONEDA:', comprobante.get('Moneda'), 'FORMA PAGO:', catalogs.catFormaPago(comprobante.get('FormaPago'))],
          [
            'METODO DE PAGO:',
            catalogs.catMetodoPago(comprobante.get('MetodoPago')),
            'CONDICIONES DE PAGO:',
            comprobante.get('CondicionesDePago'),
          ],
        ],
      },
      layout: 'lightHorizontalLines',
    };
  }

  protected generateImpuestos(concepto: CNodeInterface, catalogs: CatalogsInterface): Content[] {
    const impuestosContent: Content[] = [];
    const traslados = concepto.searchNodes('cfdi:Impuestos', 'cfdi:Traslados', 'cfdi:Traslado');
    const retenciones = concepto.searchNodes('cfdi:Impuestos', 'cfdi:Retenciones', 'cfdi:Retencion');
    if (traslados.length > 0) {
      impuestosContent.push('Traslados');
      const uniqueTraslados = new Map<string, { impuesto: string; importe: string | number }>();
      for (const traslado of traslados) {
        const key = `${traslado.get('Impuesto')}}`;
        if (traslado.get('TipoFactor') === 'Exento') {
          uniqueTraslados.set(key, {
            impuesto: traslado.get('Impuesto'),
            importe: 'EXENTO',
          });
          continue;
        }

        if (uniqueTraslados.has(key)) {
          const importe = toNumber(uniqueTraslados.get(key)!.importe) + toNumber(traslado.get('Importe'));
          uniqueTraslados.set(key, {
            impuesto: traslado.get('Impuesto'),
            importe,
          });
          continue;
        }

        uniqueTraslados.set(key, {
          impuesto: traslado.get('Impuesto'),
          importe: toNumber(traslado.get('Importe')),
        });
      }

      const contentT: TableCell[][] = [];
      for (const traslado of uniqueTraslados.values()) {
        contentT.push([
          catalogs.catImpuesto(traslado.impuesto),
          typeof traslado.importe === 'string' ? traslado.importe : formatCurrency(traslado.importe),
        ]);
      }

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
        return [catalogs.catImpuesto(retencion.get('Impuesto')), formatCurrency(retencion.get('Importe'))];
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

  protected generateConceptsContent(conceptos: CNodes, catalogs: CatalogsInterface): Content {
    const rowsConceptos = conceptos.map<TableCell[]>((concepto) => {
      return [
        concepto.get('ClaveProdServ'),
        concepto.get('Cantidad'),
        concepto.get('ClaveUnidad'),
        concepto.get('NoIdentificacion') || '(Ninguno)',
        concepto.get('Descripcion'),
        formatCurrency(concepto.get('ValorUnitario')),
        formatCurrency(concepto.get('Descuento')),
        formatCurrency(concepto.get('Importe')),
        {
          colSpan: 2,
          stack: this.generateImpuestos(concepto, catalogs),
        },
        '',
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
      'Importe',
      {
        colSpan: 2,
        text: 'Impuesto',
      },
      '',
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

  protected generateCurrencyRelatedInfo(comprobante: CNodeInterface, catalogs: CatalogsInterface): Content {
    const totalImpuestosTrasladados = comprobante.searchAttribute('cfdi:Impuestos', 'TotalImpuestosTrasladados');
    const totalImpuestosRetenidos = comprobante.searchAttribute('cfdi:Impuestos', 'TotalImpuestosRetenidos');
    const contentColumns: Column[] = [];
    const relatedInfoAndImport: Column[] = [];
    if (comprobante.get('TipoDeComprobante') !== 'P') {
      relatedInfoAndImport.push({
        fontSize: 7,
        margin: [0, 5, 0, 0],
        columns: [
          { width: 'auto', text: 'IMPORTE CON LETRA:', margin: [0, 0, 5, 0] },
          {
            width: 'auto',
            text: toCurrency(Number.parseFloat(comprobante.get('Total') || '0'), comprobante.get('Moneda')),
          },
          { width: '*', text: '' },
        ],
      });
    }

    if (comprobante.get('Version') === '3.3') {
      const relacionados = comprobante.searchNode('cfdi:CfdiRelacionados');
      if (relacionados) {
        const uuidsArray = relacionados.searchNodes('cfdi:CfdiRelacionado').map((relacionado) => {
          return [`UUID: ${relacionado.get('UUID')}`];
        });

        relatedInfoAndImport.push({
          fontSize: 7,
          margin: [0, 5, 0, 0],
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `CFDIS RELACIONADOS - TIPO RELACIÓN ${catalogs.catTipoRelacion(
                    relacionados.get('TipoRelacion'),
                  )}`,
                  fillColor: '#CCCCCC',
                },
              ],
              ...uuidsArray,
            ],
          },
        });
      }
    } else {
      const relacionados = comprobante.searchNodes('cfdi:CfdiRelacionados');
      if (relacionados.length > 0) {
        for (const relacionadosNode of relacionados) {
          const uuidsArray = relacionadosNode.searchNodes('cfdi:CfdiRelacionado').map((relacionado) => {
            return [`UUID: ${relacionado.get('UUID')}`];
          });

          relatedInfoAndImport.push({
            fontSize: 7,
            margin: [0, 5, 0, 0],
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    text: `CFDIS RELACIONADOS - TIPO RELACIÓN ${catalogs.catTipoRelacion(
                      relacionadosNode.get('TipoRelacion'),
                    )}`,
                    fillColor: '#CCCCCC',
                  },
                ],
                ...uuidsArray,
              ],
            },
          });
        }
      }
    }

    contentColumns.push(relatedInfoAndImport);
    if (comprobante.get('TipoDeComprobante') !== 'P') {
      contentColumns.push({
        width: 'auto',
        alignment: 'right',
        style: 'tableContent',
        margin: [10, 0, 0, 0],
        table: {
          widths: ['auto', 'auto'],
          body: [
            ['SUBTOTAL:', { text: formatCurrency(comprobante.get('SubTotal')), fontSize: 9 }],
            ['DESCUENTO:', formatCurrency(comprobante.get('Descuento'))],
            ['TOTAL IMP. TRASLADADOS:', formatCurrency(totalImpuestosTrasladados)],
            ['TOTAL IMP. RETENIDOS:', formatCurrency(totalImpuestosRetenidos)],
            [
              {
                text: 'TOTAL:',
                fontSize: 11,
                bold: true,
              },
              { text: formatCurrency(comprobante.get('Total')), fontSize: 11, bold: true },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      });
    }

    return {
      columns: contentColumns,
    };
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
            fit: 120,
          },
          '',
          '',
        ],
        ['', 'NUMERO SERIE CERTIFICADO SAT', tfd.get('NoCertificadoSAT')],
        ['', 'NUMERO SERIE CERTIFICADO EMISOR', comprobante.get('NoCertificado')],
        ['', 'FECHA HORA CERTIFICACIÓN', tfd.get('FechaTimbrado')],
        ['', 'FOLIO FISCAL UUID', tfd.get('UUID')],
        ['', 'SELLO DIGITAL', breakEveryNCharacters(tfd.get('SelloCFD'), 86)],
        ['', 'SELLO DEL SAT', breakEveryNCharacters(tfd.get('SelloSAT'), 86)],
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

  protected generateContent(cfdiData: CfdiData, catalogs: CatalogsInterface): Content {
    const comprobante = cfdiData.comprobante();
    const emisor = cfdiData.emisor();
    const receptor = cfdiData.receptor();
    const conceptos = comprobante.searchNodes('cfdi:Conceptos', 'cfdi:Concepto');
    const additionalFields = cfdiData.additionalFields();

    const content: Content[] = [];
    content.push(
      this.generateTopContent(comprobante, catalogs, cfdiData.logo()),
      '\n',
      this.generateEmisorContent(emisor, catalogs),
      '\n',
      this.generateReceptorContent(receptor, catalogs, cfdiData.address()),
      '\n',
    );
    if (comprobante.get('TipoDeComprobante') !== 'P') {
      this.useGlobalInformation(comprobante, content, catalogs);
      content.push(this.generateGeneralInvoiceInfoContent(comprobante, catalogs), '\n');
    }

    content.push(
      this.generateConceptsContent(conceptos, catalogs),
      '\n',
      this.generateCurrencyRelatedInfo(comprobante, catalogs),
      '\n',
    );

    /** Area of complements */
    usePago10Complement(comprobante, content);
    usePago20Complement(comprobante, content);
    useImpLocal10Complement(comprobante, content);
    /** **/

    if (additionalFields) {
      for (const element of additionalFields) {
        content.push(
          {
            style: 'tableContent',
            table: {
              widths: ['*'],
              body: [[{ text: element.title, style: 'tableHeader' }], [element.value]],
            },
            layout: 'lightHorizontalLines',
          },
          '\n',
        );
      }
    }

    content.push(this.generateStampContent(cfdiData));

    return content;
  }
}
