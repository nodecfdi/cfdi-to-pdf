import { CatalogsInterface } from 'src/catalogs/catalogs-interface';
import { AbstractInvoiceData } from '../abstract-invoice-data';

export interface BuilderInterface<T extends AbstractInvoiceData> {
    build(data: T, destination: string, catalogs?: CatalogsInterface): Promise<void>;

    buildBase64(data: T, catalogs?: CatalogsInterface): Promise<string>;
}
