// @ts-check
import { nodecfdiConfig } from '@nodecfdi/eslint-config';
import { defineFlatConfig } from 'eslint-define-config';

export default defineFlatConfig([...nodecfdiConfig({ vitest: true })]);
