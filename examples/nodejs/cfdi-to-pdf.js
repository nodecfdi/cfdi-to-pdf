const { installPdfMake, GenericCfdiTranslator, PdfMakerBuilder } = require('@nodecfdi/cfdi-to-pdf');
const { XmlNodeUtils, install } = require('@nodecfdi/cfdiutils-common');
const { DOMImplementation, XMLSerializer, DOMParser } = require('@xmldom/xmldom');
const PdfPrinter = require('pdfmake');
const { join } = require('path');
const { readFileSync } = require('fs');
const { CfdiDataBuilder } = require('./cfdi-data-builder');
const { XmlResolver } = require('@nodecfdi/cfdiutils-core');

const inputCfdiPath = './cfdi33-real.xml';
const outputCfdiPath = './cfdi33-real.pdf';

const process = async () => {
    install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    installPdfMake(
        new PdfPrinter({
            Roboto: {
                normal: join('.', 'fonts', 'Roboto-Regular.ttf'),
                bold: join('.', 'fonts', 'Roboto-Medium.ttf'),
                italics: join('.', 'fonts', 'Roboto-Italic.ttf'),
                bolditalics: join('.', 'fonts', 'Roboto-MediumItalic.ttf')
            }
        })
    );

    const xml = readFileSync(inputCfdiPath).toString();
    const comprobante = XmlNodeUtils.nodeFromXmlString(xml);
    const cfdiData = await new CfdiDataBuilder().build(comprobante);

    const builder = new PdfMakerBuilder(new GenericCfdiTranslator());
    await builder.build(cfdiData, outputCfdiPath);
};

process();
