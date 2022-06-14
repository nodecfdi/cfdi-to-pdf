import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractInvoiceData } from './abstract-invoice-data';

export class RetencionesData extends AbstractInvoiceData {
    private readonly _retenciones: CNodeInterface;
    private readonly _periodo: CNodeInterface;
    private readonly _totales: CNodeInterface;

    constructor(
        retenciones: CNodeInterface,
        qrUrl: string,
        tfdSourceString: string,
        logo?: string,
        additionalFields?: { title: string; value: string }[]
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
        const timbreFiscalDigital = retenciones.searchNode('retenciones:Complemento', 'tfd:TimbreFiscalDigital');
        if (!timbreFiscalDigital) {
            throw new Error('La factura de retenciones no contiene complemento de timbre fiscal digital');
        }

        this._retenciones = retenciones;
        this._emisor = emisor;
        this._receptor = receptor;
        this._periodo = periodo;
        this._totales = totales;
        this._timbreFiscalDigital = timbreFiscalDigital;
        this._qrUrl = qrUrl;
        this._tfdSourceString = tfdSourceString;
        this._logo = logo;
        this._additionalFields = additionalFields;
        if (this._qrUrl.trim().length === 0) {
            this.buildUrlQr(this._retenciones);
        }
    }

    public retenciones(): CNodeInterface {
        return this._retenciones;
    }

    public periodo(): CNodeInterface {
        return this._periodo;
    }

    public totales(): CNodeInterface {
        return this._totales;
    }
}
