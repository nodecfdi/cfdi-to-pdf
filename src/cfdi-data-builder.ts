import { SaxonbCliBuilder, TfdCadenaDeOrigen, XmlResolver, XsltBuilderInterface } from '@nodecfdi/cfdiutils-core';
import { CNodeInterface, Xml, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { CfdiData } from './cfdi-data';
import { DiscoverExtractor } from '@nodecfdi/cfdi-expresiones';

export class CfdiDataBuilder {
    private _xmlResolver: XmlResolver;
    private _xsltBuilder: XsltBuilderInterface;

    constructor(saxonBPath = '/usr/bin/saxonb-xslt') {
        this._xmlResolver = new XmlResolver('');
        this._xsltBuilder = new SaxonbCliBuilder(saxonBPath);
    }

    public withXmlResolver(xmlResolver: XmlResolver): CfdiDataBuilder {
        this._xmlResolver = xmlResolver;
        return this;
    }

    public withXsltBuilder(xsltBuilder: XsltBuilderInterface): CfdiDataBuilder {
        this._xsltBuilder = xsltBuilder;
        return this;
    }

    public xmlResolver(): XmlResolver {
        return this._xmlResolver;
    }

    public xsltBuilder(): XsltBuilderInterface {
        return this._xsltBuilder;
    }

    public async buildFromString(
        xml: string,
        logo?: string,
        address?: string,
        additionalFields?: { title: string; value: string }[]
    ): Promise<CfdiData> {
        const comprobante = XmlNodeUtils.nodeFromXmlString(xml);
        const tfdSourceString = await this.createTfdSourceString(comprobante);
        return Promise.resolve(
            new CfdiData(comprobante, this.createQrUrl(comprobante), tfdSourceString, logo, address, additionalFields)
        );
    }

    public async build(
        comprobante: CNodeInterface,
        logo?: string,
        address?: string,
        additionalFields?: { title: string; value: string }[]
    ): Promise<CfdiData> {
        const tfdSourceString = await this.createTfdSourceString(comprobante);
        return Promise.resolve(
            new CfdiData(comprobante, this.createQrUrl(comprobante), tfdSourceString, logo, address, additionalFields)
        );
    }

    public createTfdSourceString(comprobante: CNodeInterface): Promise<string> {
        const tfd = comprobante.searchNode('cfdi:Complemento', 'tfd:TimbreFiscalDigital');
        if (!tfd) {
            return Promise.resolve('');
        }
        // fix al parecer no me regresa el namespace xmlns:xsi
        tfd.attributes().set('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        const tfdCadenaOrigen = new TfdCadenaDeOrigen(this.xmlResolver(), this.xsltBuilder());
        return tfdCadenaOrigen.build(XmlNodeUtils.nodeToXmlString(tfd), tfd.get('Version') || tfd.get('version'));
    }

    public createQrUrl(comprobante: CNodeInterface): string {
        const extractor = new DiscoverExtractor();
        const document = Xml.newDocumentContent(XmlNodeUtils.nodeToXmlString(comprobante));
        return extractor.extract(document);
    }
}
