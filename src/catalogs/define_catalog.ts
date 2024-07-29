import { type CatalogItem } from '#src/types';

export const defineCatalog = <T extends CatalogItem>(fn: T[]): T[] => {
  return fn;
};

export const buildItem = (id: string, texto: string): CatalogItem => {
  return {
    id,
    texto,
  };
};
