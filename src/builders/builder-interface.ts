import { CfdiData } from '../cfdi-data';

export interface BuilderInterface {
    build(data: CfdiData, destination: string): Promise<void>;

    buildBase64(data: CfdiData): Promise<string>;
}
