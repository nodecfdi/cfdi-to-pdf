import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

export class RetencionesData {
    private readonly _retenciones: CNodeInterface;
    private readonly _emisor: CNodeInterface;
    private readonly _receptor: CNodeInterface;
    private readonly _periodo: CNodeInterface;
    private readonly _totales: CNodeInterface;
    private readonly _timbreFiscalDigital: CNodeInterface;
    private readonly _qrUrl: string;
    private readonly _tfdSourceString: string;
    private readonly _logo: string | undefined;
    private readonly _additionalFields: { title: string; value: string }[] | undefined;

    constructor(
        retenciones: CNodeInterface,
        qrUrl: string,
        tfdSourceString: string,
        logo?: string,
        additionalFields?: { title: string; value: string }[]
    ) {
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
    }

    public retenciones(): CNodeInterface {
        return this._retenciones;
    }

    public emisor(): CNodeInterface {
        return this._emisor;
    }

    public receptor(): CNodeInterface {
        return this._receptor;
    }

    public periodo(): CNodeInterface {
        return this._periodo;
    }

    public totales(): CNodeInterface {
        return this._totales;
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

    public additionalFields(): { title: string; value: string }[] | undefined {
        return this._additionalFields;
    }
}
