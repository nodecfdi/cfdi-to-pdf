import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

export abstract class AbstractInvoiceData {
    protected _emisor!: CNodeInterface;
    protected _receptor!: CNodeInterface;
    protected _timbreFiscalDigital!: CNodeInterface;
    protected _qrUrl!: string;
    protected _tfdSourceString!: string;
    protected _logo: string | undefined;
    protected _additionalFields: { title: string; value: string }[] | undefined;

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

    public additionalFields(): { title: string; value: string }[] | undefined {
        return this._additionalFields;
    }
}
