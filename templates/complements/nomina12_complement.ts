import { type XmlNodeInterface } from '@nodecfdi/cfdi-core/types';
import { type Content } from 'pdfmake/interfaces.js';
import { type CatalogsData } from '../../src/types.js';
import nomina12DeduccionesContent from '../sections/nomina12_deducciones_content.js';
import nomina12GeneralDataContent from '../sections/nomina12_general_data_content.js';
import nomina12OtrosPagosContent from '../sections/nomina12_otros_pagos_content.js';
import nomina12PercepcionesContent from '../sections/nomina12_percepciones_content.js';
import nomina12TotalesContent from '../sections/nomina12_totales_content.js';

export const useNomina12GeneralData = (
  nomina: XmlNodeInterface,
  comprobante: XmlNodeInterface,
  currentContent: Content[],
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): void => {
  currentContent.push(nomina12GeneralDataContent(nomina, comprobante, catalogs, primaryColor, bgGrayColor), '\n');
};

const useNomina12Complement = (
  nomina: XmlNodeInterface,
  comprobante: XmlNodeInterface,
  currentContent: Content[],
  catalogs: CatalogsData,
  primaryColor: string,
  bgGrayColor: string,
): void => {
  const percepciones = nomina.searchNode('nomina12:Percepciones');
  if (percepciones) {
    currentContent.push(...nomina12PercepcionesContent(percepciones, catalogs, primaryColor, bgGrayColor), '\n');
  }

  const deducciones = nomina.searchNode('nomina12:Deducciones');
  if (deducciones) {
    currentContent.push(...nomina12DeduccionesContent(deducciones, primaryColor, bgGrayColor), '\n');
  }

  const otrosPagos = nomina.searchNode('nomina12:OtrosPagos');
  if (otrosPagos) {
    currentContent.push(...nomina12OtrosPagosContent(otrosPagos, catalogs, primaryColor, bgGrayColor), '\n');
  }

  currentContent.push(...nomina12TotalesContent(nomina, comprobante, primaryColor, bgGrayColor), '\n');
};

export default useNomina12Complement;
