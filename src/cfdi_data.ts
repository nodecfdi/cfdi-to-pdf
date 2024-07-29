import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import AbstractInvoiceData from '#src/abstract_invoice_data';

export default class CfdiData extends AbstractInvoiceData {
  private readonly _comprobante: XmlNodeInterface;

  private readonly _address: string | undefined;

  public constructor(
    comprobante: XmlNodeInterface,
    qrUrl?: string | null,
    tfdSourceString?: string | null,
    logo?: string,
    address?: string,
    additionalFields?: { title: string; value: string }[],
  ) {
    super();
    const emisor = comprobante.searchNode('cfdi:Emisor');
    if (!emisor) {
      throw new Error('El CFDI no contiene nodo emisor');
    }

    const receptor = comprobante.searchNode('cfdi:Receptor');
    if (!receptor) {
      throw new Error('El CFDI no contiene nodo receptor');
    }

    const timbreFiscalDigital = comprobante.searchNode(
      'cfdi:Complemento',
      'tfd:TimbreFiscalDigital',
    );
    if (!timbreFiscalDigital) {
      throw new Error('El CFDI no contiene complemento de timbre fiscal digital');
    }

    this._comprobante = comprobante;
    this._emisor = emisor;
    this._receptor = receptor;
    this._timbreFiscalDigital = timbreFiscalDigital;
    this._qrUrl = qrUrl ?? '';
    this._tfdSourceString = tfdSourceString ?? '';
    this._logo = logo;
    this._address = address;
    this._additionalFields = additionalFields;
    if (this._qrUrl.trim().length === 0) {
      this.buildUrlQr(this._comprobante);
    }

    if (this._tfdSourceString.trim().length === 0) {
      this.buildTfdSource();
    }

    this._legendFooter =
      'Este documento es una representación impresa de un Comprobante Fiscal Digital a través de Internet versión {version}';
  }

  public comprobante(): XmlNodeInterface {
    return this._comprobante;
  }

  public address(): string | undefined {
    return this._address;
  }
}
