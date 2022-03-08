import { BuilderInterface } from './builders/builder-interface';
import { CfdiData } from './cfdi-data';

export class Converter {
    private _builder: BuilderInterface;

    constructor(builder: BuilderInterface) {
        this._builder = builder;
    }

    public createPdfOnPath(cfdiData: CfdiData, destination: string): Promise<void> {
        return this._builder.build(cfdiData, destination);
    }

    public createPdfOnBase64(cfdiData: CfdiData): Promise<string> {
        return this._builder.buildBase64(cfdiData);
    }
}
