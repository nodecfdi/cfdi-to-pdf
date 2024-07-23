# `@nodecfdi/cfdiutils-common`

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

> Sub-library of `@nodecfdi/cfdiutils-common` for common structs and helpers

:us: The documentation of this project is in spanish as this is the natural language for intended audience.

:mexico: La documentación del proyecto está en español porque ese es el lenguaje principal de los usuarios.

## Acerca de `@nodecfdi/cfdiutils-common`

Librería para contener las estructuras de datos comunes, y utilerías o funciones de ayuda común. Inspirada por la
versión de php <https://github.com/eclipxe13/CfdiUtils>

## Instalación

### NPM

```bash
npm i @nodecfdi/cfdiutils-common --save
```

### YARN

```bash
yarn add @nodecfdi/cfdiutils-common --save
```

### PNPM

```bash
pnpm add @nodecfdi/cfdiutils-common --save
```

### CDN - Browser

Usa la versión mas reciente publicada cambiando `<latest-version>` por la última versión. Por ejemplo ...cfdiutils-common@1.2.6/dist...

```html
<script src="https://unpkg.com/@nodecfdi/cfdiutils-common@<latest-version>/dist/cfdiutils-common.global.js"></script>
```

## Uso básico

Estructura de datos CNode

```ts
import { CNode } from '@nodecfdi/cfdiutils-common';
// Creación de un nodo con atributos
const node = new CNode('root', {
    id: '1',
});
console.log(node.attributes().get('id')); // '1'
console.log(node.attributes().get('no-existe')); // cadena de caracteres vacia ''
console.log(node.attributes().get('no-existe') ? 'si' : 'no'); // 'no'
node.attributes().set('atributo', 'valor'); // establece el valor
node.attributes().delete('id'); // elimina el atributo 'id'
// recorrer la colección de atributos
node.attributes().forEach((attributeValue, attributeName) => {
    console.log(`${attributeName}: ${attributeValue}`);
});
```

Utileria XmlNodeUtils y XML

```ts
import { CNode, install, Xml, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';

// DomParser, XMLSerializer, DOMImplementation agnostic can use xmldom, jsdom, etc.
// Is necesary install for XML helper and XmlNodeUtils
install(new DOMParser(), new XMLSerializer(), new DOMImplementation());

const node = new CNode('book', {}, [new CNode('chapter', { toc: '1' }), new CNode('chapter', { toc: '2' })]);
const xmlString = XmlNodeUtils.nodeToXmlString(node, true);
console.log(xmlString); // xml valido en formato string

// Create xml document from xml string
const document = Xml.newDocumentContent('my xml string');

// create node from element
const node = XmlNodeUtils.nodeFromXmlElement(Xml.documentElement(document));
```

## Objeto CNode

Esta es la estructura básica. Un nodo debe tener un nombre y esta propiedad no se puede cambiar. Su constructor admite
tres parámetros:

- `name: string`: Nombre del nodo, se eliminan espacios en blanco al inicio y al final, no permite vacíos.
- `attributes: Record<string, unknown>`: Objeto de elementos clave/valor que serán importados como atributos.
- `nodes: CNode[]`: Arreglo de elementos `CNode` que serán importados como nodos hijo.

## Atributos de nodos CAttributes

Se accede a sus atributos utilizando la forma de Map de javascript siguiendo estas reglas básicas:

- La lectura de un nodo siempre devuelve una cadena de caracteres aunque el atributo no exista.
- La escritura de un nodo es siempre con una cadena de caracteres, también puede ser un objeto que implemente el
  método `toString`

Los atributos se manejan con una colección de tipo `CAttributes` y se pueden obtener usando el método `attributes()` en
el objeto `CNode`.

## CNodes

Los nodos hijos se manejan a través de una colección de nodos `CNodes`. Se puede acceder al objeto `CNodes` usando el
método `children()` en el objeto `CNode`.

Cuando se itera el objeto en realidad se está iterando sobre la colección de nodos.

La clase `CNode` tiene estos métodos de ayuda que sirven para trabajar directamente sobre la colección CNodes:

- iterador: El método `foreach` se realiza sobre la colección de nodos.
- `addChild(node: CNode)`: Agrega un nodo en la colección de nodos.

## XmlNodeUtils

Esta es una clase de utilerías que contiene métodos estáticos que permiten crear estructuras de nodos desde XML y generar XML a partir de los nodos. Recuerde que los nodos solo pueden almacenar atributos y nodos hijos.

Actualmente, permite exportar e importar a/desde: `Document`, `Element` y `string` (con contenido válido).

Advertencias:

- Los nodos no son una reescritura fiel de DOM.
- Los nodos solo contienen atributos, hijos y contenido textual simple.
- Importar XML que no siga la estructura de atributos, hijos y contenido textual simple exclusivamente puede resultar en pérdida de datos.

## Contenido de texto

Tradicionalmente, los CFDI Regulares, CFDI de Retenciones e Información de Pagos, así como sus complementos,
siguen la estructura de elementos con valores en los atributos y sin texto.

Sin embargo, el SAT —en su infinita consistencia— tiene el *Complemento de facturas del sector de ventas al detalle*
disponible en <https://www.sat.gob.mx/consulta/76197/complemento-para-factura-electronica> donde, en lugar de poner
los valores en atributos, pone los valores en el contenido textual del elemento, además de otros cambios como usar
nombres de nodos en inglés.

Por lo anterior, se introdujo la interfaz `CNodeHasValueInterface` que contiene los métodos `value(): string` y
`setValue(valueString: string): void` con lo que se puede escribir y leer este contenido simple.

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

The `@nodecfdi/cfdiutils-common` library is copyright © [NodeCfdi](https://github.com/nodecfdi) - [OcelotlStudio](https://ocelotlstudio.com) and licensed for use under the MIT License (MIT). Please see [LICENSE][] for more information.

[contributing]: https://github.com/nodecfdi/cfdiutils-common/blob/main/CONTRIBUTING.md
[changelog]: https://github.com/nodecfdi/cfdiutils-common/blob/main/CHANGELOG.md

[source]: https://github.com/nodecfdi/cfdiutils-common
[node-version]: https://www.npmjs.com/package/@nodecfdi/cfdiutils-common
[discord]: https://discord.gg/AsqX8fkW2k
[release]: https://www.npmjs.com/package/@nodecfdi/cfdiutils-common
[license]: https://github.com/nodecfdi/cfdiutils-common/blob/main/LICENSE
[build]: https://github.com/nodecfdi/cfdiutils-common/actions/workflows/build.yml?query=branch:main
[reliability]:https://sonarcloud.io/component_measures?id=nodecfdi_cfdiutils-common&metric=Reliability
[maintainability]: https://sonarcloud.io/component_measures?id=nodecfdi_cfdiutils-common&metric=Maintainability
[coverage]: https://sonarcloud.io/component_measures?id=nodecfdi_cfdiutils-common&metric=Coverage
[violations]: https://sonarcloud.io/project/issues?id=nodecfdi_cfdiutils-common&resolved=false
[downloads]: https://www.npmjs.com/package/@nodecfdi/cfdiutils-common

[badge-source]: https://img.shields.io/badge/source-nodecfdi/cfdiutils--common-blue.svg?logo=github
[badge-node-version]: https://img.shields.io/node/v/@nodecfdi/cfdiutils-common.svg?logo=nodedotjs
[badge-discord]: https://img.shields.io/discord/459860554090283019?logo=discord
[badge-release]: https://img.shields.io/npm/v/@nodecfdi/cfdiutils-common.svg?logo=npm
[badge-license]: https://img.shields.io/github/license/nodecfdi/cfdiutils-common.svg?logo=open-source-initiative
[badge-build]: https://img.shields.io/github/actions/workflow/status/nodecfdi/cfdiutils-common/build.yml?branch=main
[badge-reliability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_cfdiutils-common&metric=reliability_rating
[badge-maintainability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_cfdiutils-common&metric=sqale_rating
[badge-coverage]: https://img.shields.io/sonar/coverage/nodecfdi_cfdiutils-common/main?logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-violations]: https://img.shields.io/sonar/violations/nodecfdi_cfdiutils-common/main?format=long&logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-downloads]: https://img.shields.io/npm/dm/@nodecfdi/cfdiutils-common.svg?logo=npm
