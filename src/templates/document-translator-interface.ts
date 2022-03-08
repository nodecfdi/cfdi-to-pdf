import { CfdiData } from '../cfdi-data';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

export interface DocumentTranslatorInterface {
    translate(cfdiData: CfdiData): TDocumentDefinitions;
}
