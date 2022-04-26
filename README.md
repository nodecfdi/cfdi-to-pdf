# @nodecfdi/cfdi-to-pdf

[![Source Code][badge-source]][source]
[![Software License][badge-license]][license]
[![Latest Version][badge-release]][release]
[![Discord][badge-discord]][discord]

[source]: https://github.com/nodecfdi/cfdi-to-pdf

[badge-source]: https://img.shields.io/badge/source-nodecfdi%2Fcfdi--to--pdf-blue?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMTIgMTIgNDAgNDAiPjxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0zMiwxMy40Yy0xMC41LDAtMTksOC41LTE5LDE5YzAsOC40LDUuNSwxNS41LDEzLDE4YzEsMC4yLDEuMy0wLjQsMS4zLTAuOWMwLTAuNSwwLTEuNywwLTMuMiBjLTUuMywxLjEtNi40LTIuNi02LjQtMi42QzIwLDQxLjYsMTguOCw0MSwxOC44LDQxYy0xLjctMS4yLDAuMS0xLjEsMC4xLTEuMWMxLjksMC4xLDIuOSwyLDIuOSwyYzEuNywyLjksNC41LDIuMSw1LjUsMS42IGMwLjItMS4yLDAuNy0yLjEsMS4yLTIuNmMtNC4yLTAuNS04LjctMi4xLTguNy05LjRjMC0yLjEsMC43LTMuNywyLTUuMWMtMC4yLTAuNS0wLjgtMi40LDAuMi01YzAsMCwxLjYtMC41LDUuMiwyIGMxLjUtMC40LDMuMS0wLjcsNC44LTAuN2MxLjYsMCwzLjMsMC4yLDQuNywwLjdjMy42LTIuNCw1LjItMiw1LjItMmMxLDIuNiwwLjQsNC42LDAuMiw1YzEuMiwxLjMsMiwzLDIsNS4xYzAsNy4zLTQuNSw4LjktOC43LDkuNCBjMC43LDAuNiwxLjMsMS43LDEuMywzLjVjMCwyLjYsMCw0LjYsMCw1LjJjMCwwLjUsMC40LDEuMSwxLjMsMC45YzcuNS0yLjYsMTMtOS43LDEzLTE4LjFDNTEsMjEuOSw0Mi41LDEzLjQsMzIsMTMuNHoiLz48L3N2Zz4%3D

[license]: https://github.com/nodecfdi/cfdi-to-pdf/blob/main/LICENSE.md

[badge-license]: https://img.shields.io/github/license/nodecfdi/cfdi-to-pdf?logo=open-source-initiative&style=flat-square

[badge-release]: https://img.shields.io/npm/v/@nodecfdi/cfdi-to-pdf

[release]: https://www.npmjs.com/package/@nodecfdi/cfdi-to-pdf

[badge-discord]: https://img.shields.io/discord/459860554090283019?logo=discord&style=flat-square

[discord]: https://discord.gg/aFGYXvX

> Create a generic PDF file from a CFDI 3.3, CFDI 4.0, and Retenciones 1.0

:us: The documentation of this project is in spanish as this is the natural language for intended audience.

:mexico: La documentación del proyecto está en español porque ese es el lenguaje principal de los usuarios.

## Acerca de @nodecfdi/cfdi-to-pdf

En algunos casos necesitas generar un archivo PDF desde un CFDI (Comprobante fiscal Digital por Internet), o constancia
de retenciones. Esta librería te ayuda a crear un pdf genérico. Además puedes crear un boceto a tu gusto y acomodarlo a
como lo requieras. Inspirada por la versión de php https://github.com/phpcfdi/cfditopdf

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
const cfdiData = new CfdiData(comprobante, 'urlCode', 'cadenaOrigen', 'myLogoImageBase64');

const builder = new PdfMakerBrowserBuilder(new GenericCfdiTranslator());
const base64 = await builder.buildBase64(cfdiData);

// O en NodeJS tambien se puede guardar en un archivo
await builder.build(cfdiData, destPath);

console.log(base64);
```

### Retenciones

```typescript
import {
    GenericRetencionesTranslator,
    PdfMakerBrowserBuilder,
    RetencionesData
} from '@nodecfdi/cfdi-to-pdf';
import {XmlNodeUtils} from '@nodecfdi/cfdiutils-common';

// Salida base64 Retenciones
// Accedemos al contenido en nuestro archivo XML
const xml = '...xmlstring data...';
const retenciones = XmlNodeUtils.nodeFromXmlString(xml);
const retencionesData = new RetencionesData(retenciones, 'urlCode', 'cadenaOrigen', 'myLogoImageBase64');

const builder = new PdfMakerBrowserBuilder(new GenericRetencionesTranslator());

const base64 = await builder.buildBase64(retencionesData);

// O en NodeJS tambien se puede guardar en un archivo
await builder.build(retencionesData, destPath);

console.log(base64);
```
