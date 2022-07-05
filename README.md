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

### CFDI 33 / CFDI 40

```typescript
import {
    GenericCfdiTranslator,
    PdfMakerBrowserBuilder,
    CfdiData,
} from '@nodecfdi/cfdi-to-pdf';
import {XmlNodeUtils} from '@nodecfdi/cfdiutils-common';

// Salida base64 CFDI
// Accedemos al contenido en nuestro archivo XML
const xml = '...xmlstring data...';
const comprobante = XmlNodeUtils.nodeFromXmlString(xml);
const cfdiData = new CfdiData(comprobante, 'urlCodeQR or empty for auto generate', 'cadenaOrigen', 'myLogoImageBase64');

// Tambien puedes generar el codigo QR llamando al metodo:
// cfdiData.buildUrlQr(cfdiData.comprobante());

// const builder = new PdfMakerBuilder(...);
const builder = new PdfMakerBrowserBuilder(new GenericCfdiTranslator());
const base64 = await builder.buildBase64(cfdiData);

// O en NodeJS tambien se puede guardar en un archivo
await builder.build(cfdiData, destPath);

console.log(base64);
```

### Retenciones10 / Retenciones20

```typescript
import {
    installPdfMake,
    GenericRetencionesTranslator,
    PdfMakerBrowserBuilder,
    RetencionesData
} from '@nodecfdi/cfdi-to-pdf';
import {
    XmlNodeUtils,
    install,
} from '@nodecfdi/cfdiutils-common';

// Salida base64 Retenciones
// Accedemos al contenido en nuestro archivo XML
const xml = '...xmlstring data...';

// from version 1.2.0 on cfdiutils-common required install dom
install(domParserInstance, xmlSerializerInstance, domImplementationIstance);

// from version 1.2.0 on cfdi-to-pdf required install pdfmake
installPdfMake(myPdfMakeInstance);

const retenciones = XmlNodeUtils.nodeFromXmlString(xml);
const retencionesData = new RetencionesData(retenciones, 'urlCodeQR or empty for auto generate', 'cadenaOrigen', 'myLogoImageBase64');

// Tambien puedes generar el codigo QR llamando al metodo:
// retencionesData.buildUrlQr(retencionesData.retenciones());

// const builder = new PdfMakerBuilder(...);
const builder = new PdfMakerBrowserBuilder(new GenericRetencionesTranslator());

const base64 = await builder.buildBase64(retencionesData);

// O en NodeJS tambien se puede guardar en un archivo
await builder.build(retencionesData, destPath);

console.log(base64);
```

> Puedes ver mas ejemplos en examples

Nota: Actualmente la librería requiere que según el tipo de projecto (Nodejs | browser) se le pase el pdfmake ejecutable, según la documentación de [pdfmake](https://pdfmake.github.io/docs/0.1/getting-started/) y esto se puede ejecutando el instalador proporcionado por `@nodecfdi/cfdi-to-pdf`.

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
