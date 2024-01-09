import { DiscoverExtractor } from '@nodecfdi/cfdi-expresiones';
import { type CNodeInterface, XmlNodeUtils, getParser } from '@nodecfdi/cfdiutils-common';
import { normalizeSpace } from './utils/normalize-space.js';

export abstract class AbstractInvoiceData {
  protected _emisor!: CNodeInterface;

  protected _receptor!: CNodeInterface;

  protected _timbreFiscalDigital!: CNodeInterface;

  protected _qrUrl!: string;

  protected _tfdSourceString!: string;

  protected _logo: string | undefined;

  protected _additionalFields: Array<{ title: string; value: string }> | undefined;

  public emisor(): CNodeInterface {
    return this._emisor;
  }

  public receptor(): CNodeInterface {
    return this._receptor;
  }

  public timbreFiscalDigital(): CNodeInterface {
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

  public additionalFields(): Array<{ title: string; value: string }> | undefined {
    return this._additionalFields;
  }

  public buildTfdSource(): void {
    const tfd = this.timbreFiscalDigital();

    if (tfd.offsetExists('Version')) {
      this.createTfdSourceString1_1();
    } else {
      this.createTfdSourceString1_0();
    }
  }

  public buildUrlQr(node: CNodeInterface): void {
    const rawString = XmlNodeUtils.nodeToXmlString(node, true);
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
    finalSource = `${finalSource}|${normalizeSpace(tfd.get('version'))}`;

    // UUID - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.get('UUID'))}`;

    // FechaTimbrado - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.get('FechaTimbrado'))}`;

    // SelloCFD - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.get('selloCFD'))}`;

    // NoCertificadoSAT
    finalSource = `${finalSource}|${normalizeSpace(tfd.get('noCertificadoSAT'))}`;

    this._tfdSourceString = `|${finalSource}||`;
  }

  private createTfdSourceString1_1(): void {
    const tfd = this.timbreFiscalDigital();

    let finalSource = '';
    // Version - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.get('Version'))}`;

    // UUID - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.get('UUID'))}`;

    // FechaTimbrado - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.get('FechaTimbrado'))}`;

    // RfcProvCertif - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.get('RfcProvCertif'))}`;

    // Leyenda - Optional
    if (tfd.offsetExists('Leyenda')) {
      finalSource = `${finalSource}|${normalizeSpace(tfd.get('Leyenda'))}`;
    }

    // SelloCFD - Required
    finalSource = `${finalSource}|${normalizeSpace(tfd.get('SelloCFD'))}`;

    // NoCertificadoSAT
    finalSource = `${finalSource}|${normalizeSpace(tfd.get('NoCertificadoSAT'))}`;

    this._tfdSourceString = `|${finalSource}||`;
  }
}
