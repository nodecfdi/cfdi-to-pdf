import { type CatalogsInterface } from '../catalogs/catalogs-interface.js';
import { type AbstractInvoiceData } from '../abstract-invoice-data.js';

export type BuilderInterface<T extends AbstractInvoiceData> = {
  build(data: T, destination: string, catalogs?: CatalogsInterface): Promise<void>;

  buildBase64(data: T, catalogs?: CatalogsInterface): Promise<string>;
};
