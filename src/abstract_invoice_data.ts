import { getParser, nodeToXmlString } from '@nodecfdi/cfdi-core';
import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { DiscoverExtractor } from '@nodecfdi/cfdi-expresiones';
import normalizeSpace from '#src/utils/normalize_space';

export default abstract class AbstractInvoiceData {
  protected declare _emisor: XmlNodeInterface;

  protected declare _receptor: XmlNodeInterface;

  protected declare _timbreFiscalDigital: XmlNodeInterface;

  protected declare _qrUrl: string;

  protected declare _tfdSourceString: string;

  protected _logo: string | undefined;

  protected _additionalFields: { title: string; value: string }[] | undefined;

  protected declare _legendFooter: string;

  public emisor(): XmlNodeInterface {
    return this._emisor;
  }

  public receptor(): XmlNodeInterface {
    return this._receptor;
  }

  public timbreFiscalDigital(): XmlNodeInterface {
    return this._timbreFiscalDigital;
  }

  public qrUrl(): string {
    return this._qrUrl;
  }

  public tfdSourceString(): string {
    return this._tfdSourceString;
  }

  public logo(): string | undefined {
    return this._logo;
  }

  public additionalFields(): { title: string; value: string }[] | undefined {
    return this._additionalFields;
  }

  public buildTfdSource(): void {
    const tfd = this.timbreFiscalDigital();

    if (tfd.hasAttribute('Version')) {
      this.createTfdSourceString1_1();
    } else {
      this.createTfdSourceString1_0();
    }
  }

  public buildUrlQr(node: XmlNodeInterface): void {
    const rawString = nodeToXmlString(node, true);
    const document = getParser().parseFromString(rawString, 'text/xml');
    try {
      this._qrUrl = new DiscoverExtractor().extract(document);
    } catch {
      // Not generated qrURL
    }
  }

  private createTfdSourceString1_0(): void {
    const tfd = this.timbreFiscalDigital();

    let finalSource = '';
    // Version - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.getAttribute('version'))}`;

    // UUID - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.getAttribute('UUID'))}`;

    // FechaTimbrado - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.getAttribute('FechaTimbrado'))}`;

    // SelloCFD - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.getAttribute('selloCFD'))}`;

    // NoCertificadoSAT
    finalSource = `${finalSource}|${normalizeSpace(tfd.getAttribute('noCertificadoSAT'))}`;

    this._tfdSourceString = `|${finalSource}||`;
  }

  private createTfdSourceString1_1(): void {
    const tfd = this.timbreFiscalDigital();

    let finalSource = '';
    // Version - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.getAttribute('Version'))}`;

    // UUID - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.getAttribute('UUID'))}`;

    // FechaTimbrado - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.getAttribute('FechaTimbrado'))}`;

    // RfcProvCertif - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.getAttribute('RfcProvCertif'))}`;

    // Leyenda - Optional
    if (tfd.hasAttribute('Leyenda')) {
      finalSource = `${finalSource}|${normalizeSpace(tfd.getAttribute('Leyenda'))}`;
    }

    // SelloCFD - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.getAttribute('SelloCFD'))}`;

    // NoCertificadoSAT
    finalSource = `${finalSource}|${normalizeSpace(tfd.getAttribute('NoCertificadoSAT'))}`;

    this._tfdSourceString = `|${finalSource}||`;
  }

  public setLegendFooter(legendFooter: string): void {
    this._legendFooter = legendFooter;
  }

  public legendFooter(): string {
    return this._legendFooter;
  }
}
