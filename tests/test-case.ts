import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const useTestCase = (): {
  filePath: (filename: string) => string;
  fileContents: (filename: string) => string;
  nodeCfdiLogo: () => string;
} => {
  const filePath = (filename: string) => join(dirname(fileURLToPath(import.meta.url)), '_files', filename);

  const fileContents = (filename: string) => readFileSync(filePath(filename), 'binary');

  const nodeCfdiLogo = () => `data:image/png;base64,${fileContents('nodecfdi-logo.txt')}`;

  return {
    filePath,
    fileContents,
    nodeCfdiLogo,
  };
};

export { useTestCase };
