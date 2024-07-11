import { type CatalogItem } from '../types.js';

export const defineCatalog = <T extends CatalogItem>(fn: T[]): T[] => {
  return fn;
};

export const buildItem = (id: string, texto: string): CatalogItem => {
  return {
    id,
    texto,
  };
};
