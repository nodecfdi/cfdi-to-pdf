import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import AbstractInvoiceData from '#src/abstract_invoice_data';

export default class RetencionesData extends AbstractInvoiceData {
  private readonly _retenciones: XmlNodeInterface;

  private readonly _periodo: XmlNodeInterface;

  private readonly _totales: XmlNodeInterface;

  public constructor(
    retenciones: XmlNodeInterface,
    qrUrl?: string | null,
    tfdSourceString?: string | null,
    logo?: string,
    additionalFields?: { title: string; value: string }[],
  ) {
    super();
    const emisor = retenciones.searchNode('retenciones:Emisor');
    if (!emisor) {
      throw new Error('La factura de retenciones no contiene nodo emisor');
    }

    const receptor = retenciones.searchNode('retenciones:Receptor');
    if (!receptor) {
      throw new Error('La factura de retenciones no contiene nodo receptor');
    }

    const periodo = retenciones.searchNode('retenciones:Periodo');
    if (!periodo) {
      throw new Error('La factura de retenciones no contiene nodo periodo');
    }

    const totales = retenciones.searchNode('retenciones:Totales');
    if (!totales) {
      throw new Error('La factura de retenciones no contiene nodo totales');
    }

    const timbreFiscalDigital = retenciones.searchNode(
      'retenciones:Complemento',
      'tfd:TimbreFiscalDigital',
    );
    if (!timbreFiscalDigital) {
      throw new Error('La factura de retenciones no contiene complemento de timbre fiscal digital');
    }

    this._retenciones = retenciones;
    this._emisor = emisor;
    this._receptor = receptor;
    this._periodo = periodo;
    this._totales = totales;
    this._timbreFiscalDigital = timbreFiscalDigital;
    this._qrUrl = qrUrl ?? '';
    this._tfdSourceString = tfdSourceString ?? '';
    this._logo = logo;
    this._additionalFields = additionalFields;
    if (this._qrUrl.trim().length === 0) {
      this.buildUrlQr(this._retenciones);
    }

    if (this._tfdSourceString.trim().length === 0) {
      this.buildTfdSource();
    }

    this._legendFooter =
      'Este documento es una representación impresa de un Comprobante Fiscal Digital por Internet que ampara Retenciones e Información de Pagos versión {version}';
  }

  public retenciones(): XmlNodeInterface {
    return this._retenciones;
  }

  public periodo(): XmlNodeInterface {
    return this._periodo;
  }

  public totales(): XmlNodeInterface {
    return this._totales;
  }
}
