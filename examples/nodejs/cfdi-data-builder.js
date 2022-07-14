const { CfdiData } = require('@nodecfdi/cfdi-to-pdf');
const { CNodeInterface, XmlNodeUtils } = require('@nodecfdi/cfdiutils-common');
const { XmlResolver, SaxonbCliBuilder, XsltBuilderInterface, TfdCadenaDeOrigen } = require('@nodecfdi/cfdiutils-core');

/**
 * This class use SaxonbCliBuilder is necesary install on your linux distro for usage and pass
 * correct path of executable
 */

class CfdiDataBuilder {
    _xmlResolver;
    _xsltBuilder;

    constructor() {
        this._xmlResolver = new XmlResolver('./');
        this._xsltBuilder = new SaxonbCliBuilder('/usr/bin/saxonb-xslt');
    }

    /** @param {XmlResolver} xmlResolver */
    withWxmlResolver(xmlResolver) {
        this._xmlResolver = xmlResolver;
        return this;
    }

    /** @param {XsltBuilderInterface} xsltBuilder */
    withXsltBuilder(xsltBuilder) {
        this._xsltBuilder = xsltBuilder;
        return this;
    }

    xmlResolver() {
        return this._xmlResolver;
    }

    xsltBuilder() {
        return this._xsltBuilder;
    }

    async build(comprobante) {
        const tfdSourceString = await this.createTfdSourceString(comprobante);
        return new CfdiData(comprobante, '', tfdSourceString);
    }

    /** @param {CNodeInterface} comprobante */
    async createTfdSourceString(comprobante) {
        const tfd = comprobante.searchNode('cfdi:Complemento', 'tfd:TimbreFiscalDigital');
        if (!tfd) {
            return '';
        }

        // fix al parecer no me regresa el namespace xmlns:xsi
        tfd.attributes().set('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');

        const tfdXml = XmlNodeUtils.nodeToXmlString(tfd);
        const tfdCO = new TfdCadenaDeOrigen(this.xmlResolver(), this.xsltBuilder());
        return tfdCO.build(tfdXml);
    }
}

module.exports = { CfdiDataBuilder };
