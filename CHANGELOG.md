# @nodecfdi/cfdi-to-pdf ChangeLog

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
