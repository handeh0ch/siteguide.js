import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsdoc from 'eslint-plugin-jsdoc';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        plugins: {
            jsdoc,
        },
        rules: {
            'prefer-const': 'error',
            '@typescript-eslint/typedef': [
                'error',
                {
                    parameter: true,
                    arrowParameter: false,
                    arrayDestructuring: true,
                    objectDestructuring: true,
                    propertyDeclaration: true,
                    variableDeclaration: true,
                    memberVariableDeclaration: true,
                    variableDeclarationIgnoreFunction: true,
                },
            ],
            quotes: [2, 'single', { avoidEscape: true }],
            semi: 'error',
            indent: 'error',
            'no-prototype-builtins': 'off',
            'object-curly-spacing': ['error', 'always'],
            '@typescript-eslint/ban-ts-comment': 0,
            '@typescript-eslint/no-empty-interface': 0,
            '@typescript-eslint/no-inferrable-types': 0,
            '@typescript-eslint/no-explicit-any': 0,
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-member-accessibility': 'error',
            'jsdoc/check-access': 1,
            'jsdoc/check-alignment': 1,
            'jsdoc/check-line-alignment': 1,
            'jsdoc/check-param-names': 1,
            'jsdoc/check-template-names': 1,
            'jsdoc/check-property-names': 1,
            'jsdoc/check-tag-names': 1,
            'jsdoc/check-types': 1,
            'jsdoc/check-values': 1,
            'jsdoc/empty-tags': 1,
            'jsdoc/implements-on-classes': 1,
            'jsdoc/multiline-blocks': 1,
            'jsdoc/no-multi-asterisks': 1,
            'jsdoc/require-hyphen-before-param-description': 1,
            'jsdoc/require-jsdoc': 1,
            'jsdoc/require-param': 1,
            'jsdoc/require-param-description': 1,
            'jsdoc/require-param-name': 1,
            'jsdoc/require-param-type': 1,
            'jsdoc/require-property': 1,
            'jsdoc/require-property-description': 1,
            'jsdoc/require-property-name': 1,
            'jsdoc/require-property-type': 1,
            'jsdoc/require-returns': 1,
            'jsdoc/require-returns-check': 1,
            'jsdoc/require-returns-description': 1,
            'jsdoc/require-returns-type': 1,
            'jsdoc/require-yields': 1,
            'jsdoc/require-yields-check': 1,
            'jsdoc/tag-lines': 1,
            'jsdoc/valid-types': 1,
            '@typescript-eslint/member-ordering': [
                'error',
                {
                    default: [
                        ['get', 'set', 'field', 'static-method'],
                        'constructor',
                        'public-abstract-method',
                        'protected-abstract-method',
                        'public-decorated-method',
                        'public-method',
                        'protected-decorated-method',
                        'protected-method',
                        'private-decorated-method',
                        'private-method',
                    ],
                },
            ],
        },
    },
    {
        files: ['*.html'],
        rules: {
            'filename-rules/match': [
                2,
                { '.ts': '/^[a-z0-9-?.*]+$/' },
                { '.html': '/^[a-z0-9-?.*]+$/' },
                { '.scss': '/^[a-z0-9-?.*]+$/' },
            ],
        },
    },
    eslintConfigPrettier
);
