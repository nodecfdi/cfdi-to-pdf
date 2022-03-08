import { join } from 'path';
import { readFileSync } from 'fs';
import { XmlResolver } from '@nodecfdi/cfdiutils-core';

export class TestCase {
    public static filePath(filename: string): string {
        return join(__dirname, '_files', filename);
    }

    public static fileContents(filename: string): string {
        return readFileSync(TestCase.filePath(filename), 'utf-8');
    }

    public static createXmlResolver(): XmlResolver {
        const resourcesFolder = join(__dirname, '_files', 'external_resources');
        return new XmlResolver(resourcesFolder);
    }
}
