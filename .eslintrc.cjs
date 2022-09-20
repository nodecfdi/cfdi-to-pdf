const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
    root: true,
    env: {
        // commonjs: true,
        es6: true,
        node: true,
        jest: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:promise/recommended',
        'plugin:jest/recommended',
        'plugin:prettier/recommended',
        'prettier'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        /*  enabling "project" field is a performance hit
            https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md#performance
        */
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc', 'prettier'],
    globals: {
        __DEV__: true,
        __VERSION__: true,
        __COMMIT_SHA__: true,
        __BUILD_DATE__: true
    },
    reportUnusedDisableDirectives: true,
    rules: {
        // eslint rules
        'indent': 'off',
        'semi': 'error',
        'quote-props': ['error', 'consistent'],
        'generator-star-spacing': ['error', { before: false, after: true }],
        'space-before-function-paren': 'off',
        'no-dupe-class-members': 'off',
        'no-useless-constructor': 'off',
        'lines-between-class-members': ['error', 'always'],
        'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],

        // promise rules
        'promise/catch-or-return': ['error', { terminationMethod: ['catch', 'asCallback', 'finally'] }],

        // typescript rules
        '@typescript-eslint/no-unused-vars': [2, { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        '@typescript-eslint/no-useless-constructor': 'off',
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true
            }
        ],
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit',
                overrides: {
                    constructors: 'no-public'
                }
            }
        ],
        '@typescript-eslint/ban-ts-comment': [
            'error',
            {
                'ts-expect-error': 'allow-with-description'
            }
        ],
        '@typescript-eslint/no-non-null-assertion': [2],
        '@typescript-eslint/no-explicit-any': [2, { ignoreRestArgs: true }],
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false
                },
                multilineDetection: 'brackets'
            }
        ],
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/no-empty-interface': 'off',

        // tsdoc rules
        'tsdoc/syntax': 'warn'
    },
    overrides: [
        {
            files: ['*.js', '*.jsx', '*.cjs'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/no-var-requires': 'off'
            }
        }
    ]
});
