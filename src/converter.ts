import { BuilderInterface } from './builders/builder-interface';
import { CfdiData } from './cfdi-data';
import { RetencionesData } from './retenciones-data';

export class Converter {
    private _builder: BuilderInterface<CfdiData | RetencionesData>;

    constructor(builder: BuilderInterface<CfdiData | RetencionesData>) {
        this._builder = builder;
    }

    public createPdfOnPath(data: CfdiData | RetencionesData, destination: string): Promise<void> {
        return this._builder.build(data, destination);
    }

    public createPdfOnBase64(data: CfdiData | RetencionesData): Promise<string> {
        return this._builder.buildBase64(data);
    }
}
