/** @type {import("xo").Options} */
const config = {
  space: true,
  prettier: true,
  ignores: ['docs', 'dist', 'coverage', '.husky', 'examples'],
  rules: {
    // Base rules
    'new-cap': ['error', { capIsNew: false }],

    // Typescript rules
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: false,
        types: {
          'String': {
            message: 'Use `string` instead.',
            fixWith: 'string',
          },
          'Number': {
            message: 'Use `number` instead.',
            fixWith: 'number',
          },
          'Boolean': {
            message: 'Use `boolean` instead.',
            fixWith: 'boolean',
          },
          'Symbol': {
            message: 'Use `symbol` instead.',
            fixWith: 'symbol',
          },
          'BigInt': {
            message: 'Use `bigint` instead.',
            fixWith: 'bigint',
          },
          'Object': {
            message:
              'The `Object` type is mostly the same as `unknown`. You probably want `Record<string, unknown>` instead. See https://github.com/typescript-eslint/typescript-eslint/pull/848',
            fixWith: 'Record<string, unknown>',
          },
          '{}': {
            message:
              'The `{}` type is mostly the same as `unknown`. You probably want `Record<string, unknown>` instead.',
            fixWith: 'Record<string, unknown>',
          },
          'object': {
            message:
              'The `object` type is hard to use. Use `Record<string, unknown>` instead. See: https://github.com/typescript-eslint/typescript-eslint/pull/848',
            fixWith: 'Record<string, unknown>',
          },
          'Function': 'Use a specific function type instead, like `() => void`.',
          'Buffer': {
            message: 'Use Uint8Array instead. See: https://sindresorhus.com/blog/goodbye-nodejs-buffer',
            suggest: ['Uint8Array'],
          },
          '[]': "Don't use the empty array type `[]`. It only allows empty arrays. Use `SomeType[]` instead.",
          '[[]]':
            "Don't use `[[]]`. It only allows an array with a single element which is an empty array. Use `SomeType[][]` instead.",
          '[[[]]]': "Don't use `[[[]]]`. Use `SomeType[][][]` instead.",
          '[[[[]]]]': 'ur drunk 🤡',
          '[[[[[]]]]]': '🦄💥',
        },
      },
    ],
    '@typescript-eslint/naming-convention': 'off',

    // Unicorn rules
    'unicorn/prefer-dom-node-append': 'off',
  },
};

module.exports = config;
