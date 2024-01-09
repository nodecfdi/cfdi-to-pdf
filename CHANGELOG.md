# @nodecfdi/cfdi-to-pdf ChangeLog

## 1.6.0

### Drop support to node version 14

- Drop support to node 14
- Update dependencies
- Change from microbundle to tsup
- Change from jest to vitest

## 1.5.0

### Feature support to Catalogs

- Added support to catalogs
- Update dependencies
- Update readme with optional catalogs variable

## 1.4.0

### Feature support to Automatic generate TFD source string

- Added support to automatic generate TFD source string
- Update devs dependencies
- Update readme with optional qr, and tfdSourceString

## 1.3.1

### Fix fs resolve

- fix fs resolve for bundlers like webpack, rollup, vite, etc
- Update devs dependencies

## 1.3.0

### Feature Support to Impuestos Locales

- Added support to complement "Impuestos Locales"
- Small refactoring

### Documentation

- Added example nodejs and complement example browser
- Fixed Readme with functional usages

## 1.2.0

- Add helper to installPdfmaker and use has document [pdfmake](https://pdfmake.github.io/docs/0.1/getting-started/) describe (Browser, Nodejs support).
- Improve documentation about new process to use `@nodecfdi/cfdi-to-pdf`.
- Added example of use in browser environment.
- Update usage for apply DOM agnostic.

### CI

- Update workflow for use pnpm and better test coverage.
- Added Sonarcloud for better continuous code quality.

### Build

- Replace rollup bundle for microbundle for generation of library.

## 1.1.5

- Reduce margin on retenciones template, more cleare show info
- Best format to represent emisor, receptor info on cfdi and retenciones template
- Update version of expresiones, fixed retenciones2.0 expression and retenciones1.0

## 1.1.4

- Fix on TemplateGenericRetenciones, TFD version is upgraded on retenciones 2.0 from 1.0 to 1.1
- Fix on TemplateGenericRetenciones, Format currency and remove unused convertion on zero values
- Fix on TemplateGenericRetenciones, On Receptor foraign, change field NumRegIdTrib on retenciones 2.0
- Added support to automatic generate QRUrl on empty field or with invoke method buildQrUrl

## 1.1.3

- Added support for dual version retenciones1.0 and 2.0
- Small fix on retenciones pdf qr code (big on sometimes case)

## 1.1.2

- Fixed problem on complement pago20 with totales info
- Reduce size on totales info for best table responsive
- Minor update on template complement pago20 for best presentation

## 1.1.1

- Added support for dual version cfdi 3.3 and 4.0
- Added Información Global Node for cfdi 4.0
- Added Complements Pago10 and Pago20 in generic template.

## 1.1.0

- Remove builders for compatibility with browser generator and aws lambda
- Refactor for tests
- Remove dependencies not used
- Fixed problem with break tfd cadena

## 1.0.0

- First release
- Migrate from `OcelotlStudio` to `NodeCfdi`
- Added support to browser and nodejs
- Added support to multiple templates
- Added retenciones support
- Generate test suite and standard eslint prettier config
