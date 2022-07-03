import { join } from 'path';
import { readFileSync } from 'fs';

export class TestCase {
    public static filePath(filename: string): string {
        return join(__dirname, '_files', filename);
    }

    public static fileContents(filename: string): string {
        return readFileSync(TestCase.filePath(filename), 'utf-8');
    }

    public static nodeCfdiLogo(): string {
        return `data:image/png;base64,${TestCase.fileContents('nodecfdi-logo.txt')}`;
    }
}
