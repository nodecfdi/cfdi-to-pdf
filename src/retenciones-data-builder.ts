import { SaxonbCliBuilder, TfdCadenaDeOrigen, XmlResolver, XsltBuilderInterface } from '@nodecfdi/cfdiutils-core';
import { CNodeInterface, Xml, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { DiscoverExtractor } from '@nodecfdi/cfdi-expresiones';
import { RetencionesData } from './retenciones-data';

export class RetencionesDataBuilder {
    private _xmlResolver: XmlResolver;
    private _xsltBuilder: XsltBuilderInterface;

    constructor(saxonBPath = '/usr/bin/saxonb-xslt') {
        this._xmlResolver = new XmlResolver('');
        this._xsltBuilder = new SaxonbCliBuilder(saxonBPath);
    }

    public withXmlResolver(xmlResolver: XmlResolver): RetencionesDataBuilder {
        this._xmlResolver = xmlResolver;
        return this;
    }

    public withXsltBuilder(xsltBuilder: XsltBuilderInterface): RetencionesDataBuilder {
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
        additionalFields?: { title: string; value: string }[]
    ): Promise<RetencionesData> {
        const retenciones = XmlNodeUtils.nodeFromXmlString(xml);
        const tfdSourceString = await this.createTfdSourceString(retenciones);
        return Promise.resolve(
            new RetencionesData(retenciones, this.createQrUrl(retenciones), tfdSourceString, logo, additionalFields)
        );
    }

    public async build(
        retenciones: CNodeInterface,
        logo?: string,
        additionalFields?: { title: string; value: string }[]
    ): Promise<RetencionesData> {
        const tfdSourceString = await this.createTfdSourceString(retenciones);
        return Promise.resolve(
            new RetencionesData(retenciones, this.createQrUrl(retenciones), tfdSourceString, logo, additionalFields)
        );
    }

    public createTfdSourceString(retenciones: CNodeInterface): Promise<string> {
        const tfd = retenciones.searchNode('retenciones:Complemento', 'tfd:TimbreFiscalDigital');
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
        return `https://prodretencionverificacion.clouda.sat.gob.mx/${extractor.extract(document)}`;
    }
}
