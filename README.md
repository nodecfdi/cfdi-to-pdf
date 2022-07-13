# `@nodecfdi/cfdi-to-pdf`

[![Source Code][badge-source]][source]
[![Npm Node Version Support][badge-node-version]][node-version]
[![Discord][badge-discord]][discord]
[![Latest Version][badge-release]][release]
[![Software License][badge-license]][license]
[![Build Status][badge-build]][build]
[![Reliability][badge-reliability]][reliability]
[![Maintainability][badge-maintainability]][maintainability]
[![Code Coverage][badge-coverage]][coverage]
[![Violations][badge-violations]][violations]
[![Total Downloads][badge-downloads]][downloads]

> Create a generic PDF file from a CFDI 3.3, CFDI 4.0, Retenciones 1.0 and Retenciones 2.0

:us: The documentation of this project is in spanish as this is the natural language for intended audience.

:mexico: La documentación del proyecto está en español porque ese es el lenguaje principal de los usuarios.

## Acerca de `@nodecfdi/cfdi-to-pdf`

En algunos casos necesitas generar un archivo PDF desde un CFDI (Comprobante fiscal Digital por Internet), o constancia
de retenciones. Esta librería te ayuda a crear un pdf genérico. Además puedes crear un boceto a tu gusto y acomodarlo a
como lo requieras. Inspirada por la versión de php <https://github.com/phpcfdi/cfditopdf>

## Instalación

```shell
npm i @nodecfdi/cfdi-to-pdf --save
```

o

```shell
yarn add @nodecfdi/cfdi-to-pdf
```

## Uso básico

Ejemplo en nodejs usando xmldom para CFDI 3.3 y CFDI 4.0

```ts
import {
    installPdfMake,
    GenericCfdiTranslator,
    PdfMakerBuilder,
    CfdiData,
} from '@nodecfdi/cfdi-to-pdf';
import {
    XmlNodeUtils,
    install,
} from '@nodecfdi/cfdiutils-common';
import {
    DOMImplementation,
    XMLSerializer,
    DOMParser
} from '@xmldom/xmldom';
import PdfPrinter from 'pdfmake';
import { join } from 'path';
import { readFileSync } from 'fs';

const inputCfdiPath = './cfdi40or33-real.xml';
const cfdiSourceString = 'cadenaOrigen';
const outputCfdiPath = './cfdi40or33-real.pdf';

// from version 1.2.x on @nodecfdi/cfdiutils-common required install dom resolution
install(new DOMParser(), new XMLSerializer(), new DOMImplementation());

// PDFMAKE on nodejs require font path not included on distributable files
installPdfMake(new PdfPrinter({
    Roboto: {
        normal: join('.', 'fonts', 'Roboto-Regular.ttf'),
        bold: join('.', 'fonts', 'Roboto-Medium.ttf'),
        italics: join('.', 'fonts', 'Roboto-Italic.ttf'),
        bolditalics: join('.', 'fonts', 'Roboto-MediumItalic.ttf'),
    }
}));

const xml = readFileSync(inputCfdiPath).toString();
const comprobante = XmlNodeUtils.nodeFromXmlString(xml);
const cfdiData = new CfdiData(comprobante, '', cfdiSourceString, 'mylogoBase64');

const builder = new PdfMakerBuilder(new GenericCfdiTranslator());
await builder.build(cfdiData, outputCfdiPath);
```

Ejemplo en nodejs usando jsDom para CFDI 3.3 y CFDI 4.0

```ts
import {
    installPdfMake,
    GenericCfdiTranslator,
    PdfMakerBuilder,
    CfdiData,
} from '@nodecfdi/cfdi-to-pdf';
import {
    XmlNodeUtils,
    install,
} from '@nodecfdi/cfdiutils-common';
import { JSDOM } from 'jsdom';
import PdfPrinter from 'pdfmake';
import { join } from 'path';
import { readFileSync } from 'fs';

const inputCfdiPath = './cfdi40or33-real.xml';
const cfdiSourceString = 'cadenaOrigen';
const outputCfdiPath = './cfdi40or33-real.pdf';

const dom = new JSDOM();
const jsDOMParser = new dom.window.DOMParser();
const jsXMLSerializer = new dom.window.XMLSerializer();
const jsDOMImplementation = dom.window.document.implementation;

// from version 1.2.x on @nodecfdi/cfdiutils-common required install dom resolution
install(jsDOMParser, jsXMLSerializer, jsDOMImplementation);

// PDFMAKE on nodejs require font path not included on distributable files
installPdfMake(new PdfPrinter({
    Roboto: {
        normal: join('.', 'fonts', 'Roboto-Regular.ttf'),
        bold: join('.', 'fonts', 'Roboto-Medium.ttf'),
        italics: join('.', 'fonts', 'Roboto-Italic.ttf'),
        bolditalics: join('.', 'fonts', 'Roboto-MediumItalic.ttf'),
    }
}));

const xml = readFileSync(inputCfdiPath).toString();
const comprobante = XmlNodeUtils.nodeFromXmlString(xml);
const cfdiData = new CfdiData(comprobante, '', cfdiSourceString, 'mylogoBase64');

const builder = new PdfMakerBuilder(new GenericCfdiTranslator());
await builder.build(cfdiData, outputCfdiPath);
```

Ejemplo en nodejs usando xmldom para RET 1.0 y RET 2.0

```ts
import {
    installPdfMake,
    GenericRetencionesTranslator,
    PdfMakerBuilder,
    RetencionesData,
} from '@nodecfdi/cfdi-to-pdf';
import {
    XmlNodeUtils,
    install,
} from '@nodecfdi/cfdiutils-common';
import {
    DOMImplementation,
    XMLSerializer,
    DOMParser
} from '@xmldom/xmldom';
import PdfPrinter from 'pdfmake';
import { join } from 'path';
import { readFileSync } from 'fs';

const inputRetPath = './ret10or20-real.xml';
const cfdiSourceString = 'cadenaOrigen';
const outputRetPath = './ret10or20-real.pdf';

// from version 1.2.x on @nodecfdi/cfdiutils-common required install dom resolution
install(new DOMParser(), new XMLSerializer(), new DOMImplementation());

// PDFMAKE on nodejs require font path not included on distributable files
installPdfMake(new PdfPrinter({
    Roboto: {
        normal: join('.', 'fonts', 'Roboto-Regular.ttf'),
        bold: join('.', 'fonts', 'Roboto-Medium.ttf'),
        italics: join('.', 'fonts', 'Roboto-Italic.ttf'),
        bolditalics: join('.', 'fonts', 'Roboto-MediumItalic.ttf'),
    }
}));

const xml = readFileSync(inputRetPath).toString();
const comprobante = XmlNodeUtils.nodeFromXmlString(xml);
const retencionesData = new RetencionesData(comprobante, '', cfdiSourceString, 'mylogoBase64');

const builder = new PdfMakerBuilder(new GenericRetencionesTranslator());
await builder.build(retencionesData, outputRetPath);
```

Ejemplo en nodejs usando jsDom para RET 1.0 y RET 2.0

```ts
import {
    installPdfMake,
    GenericRetencionesTranslator,
    PdfMakerBuilder,
    RetencionesData,
} from '@nodecfdi/cfdi-to-pdf';
import {
    XmlNodeUtils,
    install,
} from '@nodecfdi/cfdiutils-common';
import { JSDOM } from 'jsdom';
import PdfPrinter from 'pdfmake';
import { join } from 'path';
import { readFileSync } from 'fs';

const inputRetPath = './ret10or20-real.xml';
const cfdiSourceString = 'cadenaOrigen';
const outputRetPath = './ret10or20-real.pdf';

const dom = new JSDOM();
const jsDOMParser = new dom.window.DOMParser();
const jsXMLSerializer = new dom.window.XMLSerializer();
const jsDOMImplementation = dom.window.document.implementation;

// from version 1.2.x on @nodecfdi/cfdiutils-common required install dom resolution
install(jsDOMParser, jsXMLSerializer, jsDOMImplementation);

// PDFMAKE on nodejs require font path not included on distributable files
installPdfMake(new PdfPrinter({
    Roboto: {
        normal: join('.', 'fonts', 'Roboto-Regular.ttf'),
        bold: join('.', 'fonts', 'Roboto-Medium.ttf'),
        italics: join('.', 'fonts', 'Roboto-Italic.ttf'),
        bolditalics: join('.', 'fonts', 'Roboto-MediumItalic.ttf'),
    }
}));

const xml = readFileSync(inputRetPath).toString();
const comprobante = XmlNodeUtils.nodeFromXmlString(xml);
const retencionesData = new RetencionesData(comprobante, '', cfdiSourceString, 'mylogoBase64');

const builder = new PdfMakerBuilder(new GenericRetencionesTranslator());
await builder.build(retencionesData, outputRetPath);
```

> Puedes ver mas ejemplos en examples

Nota: Actualmente la librería requiere que según el tipo de projecto (Nodejs | browser) se le pase el pdfmake ejecutable, según la documentación de [pdfmake](https://pdfmake.github.io/docs/0.1/getting-started/) y esto se puede ejecutando el instalador proporcionado por `@nodecfdi/cfdi-to-pdf`.

## Elementos soportados

Elementos base soportados:

| Tipo    | Soportado          |
| ------- | ------------------ |
| CFDI3.3 | :white_check_mark: |
| CFDI4.0 | :white_check_mark: |
| RET1.0  | :white_check_mark: |
| RET2.0  | :white_check_mark: |

Complementos:

| Complemento              | Soportado          |
| ------------------------ | ------------------ |
| PAGO1.0                  | :white_check_mark: |
| PAGO2.0                  | :white_check_mark: |
| IMPUESTOS LOCALES        | :white_check_mark: |
| PLATAFORMAS TECNOLÓGICAS | :white_check_mark: |

## Patrocinadores

`@nodecfdi/cfdi-to-pdf` es un projecto de licencia abierta MIT donde el continuo desarrollo es realizado por el apoyo de la comunidad y de los patrocinadores.

[![Infaster](/assets/infaster-sponsor.png "infaster")](https://www.infaster.mx/)

## Soporte

Puedes obtener soporte abriendo un ticket en Github.

Adicionalmente, esta librería pertenece a la comunidad [OcelotlStudio](https://ocelotlstudio.com), así que puedes usar los mismos canales de comunicación para obtener ayuda de algún miembro de la comunidad.

## Compatibilidad

Esta librería se mantendrá compatible con al menos la versión con
[soporte activo de Node](https://nodejs.org/es/about/releases/) más reciente.

También utilizamos [Versionado Semántico 2.0.0](https://semver.org/lang/es/) por lo que puedes usar esta librería sin temor a romper tu aplicación.

## Contribuciones

Las contribuciones con bienvenidas. Por favor lee [CONTRIBUTING][] para más detalles y recuerda revisar el archivo [CHANGELOG][].

## Copyright and License

The `@nodecfdi/cfdi-to-pdf` library is copyright © [NodeCfdi](https://github.com/nodecfdi) - [OcelotlStudio](https://ocelotlstudio.com) and licensed for use under the MIT License (MIT). Please see [LICENSE][] for more information.

[contributing]: https://github.com/nodecfdi/cfdi-to-pdf/blob/main/CONTRIBUTING.md
[changelog]: https://github.com/nodecfdi/cfdi-to-pdf/blob/main/CHANGELOG.md

[source]: https://github.com/nodecfdi/cfdi-to-pdf
[node-version]: https://www.npmjs.com/package/@nodecfdi/cfdi-to-pdf
[discord]: https://discord.gg/AsqX8fkW2k
[release]: https://www.npmjs.com/package/@nodecfdi/cfdi-to-pdf
[license]: https://github.com/nodecfdi/cfdi-to-pdf/blob/main/LICENSE
[build]: https://github.com/nodecfdi/cfdi-to-pdf/actions/workflows/build.yml?query=branch:main
[reliability]:https://sonarcloud.io/component_measures?id=nodecfdi_cfdi-to-pdf&metric=Reliability
[maintainability]: https://sonarcloud.io/component_measures?id=nodecfdi_cfdi-to-pdf&metric=Maintainability
[coverage]: https://sonarcloud.io/component_measures?id=nodecfdi_cfdi-to-pdf&metric=Coverage
[violations]: https://sonarcloud.io/project/issues?id=nodecfdi_cfdi-to-pdf&resolved=false
[downloads]: https://www.npmjs.com/package/@nodecfdi/cfdi-to-pdf

[badge-source]: https://img.shields.io/badge/source-nodecfdi/cfdi--to--pdf-blue.svg?logo=github
[badge-node-version]: https://img.shields.io/node/v/@nodecfdi/cfdi-to-pdf.svg?logo=nodedotjs
[badge-discord]: https://img.shields.io/discord/459860554090283019?logo=discord
[badge-release]: https://img.shields.io/npm/v/@nodecfdi/cfdi-to-pdf.svg?logo=npm
[badge-license]: https://img.shields.io/github/license/nodecfdi/cfdi-to-pdf.svg?logo=open-source-initiative
[badge-build]: https://img.shields.io/github/workflow/status/nodecfdi/cfdi-to-pdf/build/main?logo=github-actions
[badge-reliability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_cfdi-to-pdf&metric=reliability_rating
[badge-maintainability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_cfdi-to-pdf&metric=sqale_rating
[badge-coverage]: https://img.shields.io/sonar/coverage/nodecfdi_cfdi-to-pdf/main?logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-violations]: https://img.shields.io/sonar/violations/nodecfdi_cfdi-to-pdf/main?format=long&logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-downloads]: https://img.shields.io/npm/dm/@nodecfdi/cfdi-to-pdf.svg?logo=npm
