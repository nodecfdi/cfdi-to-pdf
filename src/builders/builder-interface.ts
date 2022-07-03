import { AbstractInvoiceData } from '~/abstract-invoice-data';

export interface BuilderInterface<T extends AbstractInvoiceData> {
    build(data: T, destination: string): Promise<void>;

    buildBase64(data: T): Promise<string>;
}
