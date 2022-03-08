import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

export class CfdiData {
    private readonly _comprobante: CNodeInterface;
    private readonly _emisor: CNodeInterface;
    private readonly _receptor: CNodeInterface;
    private readonly _timbreFiscalDigital: CNodeInterface;
    private readonly _qrUrl: string;
    private readonly _tfdSourceString: string;
    private readonly _logo: string | undefined;
    private readonly _address: string | undefined;
    private readonly _additionalFields: { title: string; value: string }[] | undefined;

    constructor(
        comprobante: CNodeInterface,
        qrUrl: string,
        tfdSourceString: string,
        logo?: string,
        address?: string,
        additionalFields?: { title: string; value: string }[]
    ) {
        const emisor = comprobante.searchNode('cfdi:Emisor');
        if (!emisor) {
            throw new Error('El CFDI no contiene nodo emisor');
        }
        const receptor = comprobante.searchNode('cfdi:Receptor');
        if (!receptor) {
            throw new Error('El CFDI no contiene nodo receptor');
        }
        const timbreFiscalDigital = comprobante.searchNode('cfdi:Complemento', 'tfd:TimbreFiscalDigital');
        if (!timbreFiscalDigital) {
            throw new Error('El CFDI no contiene complemento de timbre fiscal digital');
        }

        this._comprobante = comprobante;
        this._emisor = emisor;
        this._receptor = receptor;
        this._timbreFiscalDigital = timbreFiscalDigital;
        this._qrUrl = qrUrl;
        this._tfdSourceString = tfdSourceString;
        this._logo = logo;
        this._address = address;
        this._additionalFields = additionalFields;
    }

    public comprobante(): CNodeInterface {
        return this._comprobante;
    }

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

    public address(): string | undefined {
        return this._address;
    }

    public additionalFields(): { title: string; value: string }[] | undefined {
        return this._additionalFields;
    }
}
