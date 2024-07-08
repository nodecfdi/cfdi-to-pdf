import { type CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractInvoiceData } from './abstract-invoice-data.js';

export class CfdiData extends AbstractInvoiceData {
  private readonly _comprobante: CNodeInterface;

  private readonly _address: string | undefined;

  // eslint-disable-next-line max-params
  constructor(
    comprobante: CNodeInterface,
    qrUrl?: string | null,
    tfdSourceString?: string | null,
    logo?: string,
    address?: string,
    additionalFields?: Array<{ title: string; value: string }>,
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
  }

  public comprobante(): CNodeInterface {
    return this._comprobante;
  }

  public address(): string | undefined {
    return this._address;
  }
}
