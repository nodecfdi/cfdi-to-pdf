import { type Content } from 'pdfmake/interfaces.js';

export default class AbstractGenericTraslator {
  protected genericSpace(spaces = 1): Content {
    const result = Array.from<string>({ length: spaces });

    return {
      text: result.join('\n'),
    };
  }
}
