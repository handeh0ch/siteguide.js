import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsdoc from 'eslint-plugin-jsdoc';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Adds ignores to the given ESLint configuration(s).
 *
 * @param {Object|Object[]} configs - The ESLint configuration(s) to modify.
 * @returns {Object[]} The modified ESLint configuration(s) with ignores added.
 */
function withIgnores(configs) {
    if (!Array.isArray(configs)) {
        return [
            {
                ...configs,
                ignores: ['**/dist/**', '**/*sample*'],
            },
        ];
    }

    return configs.map((config) => {
        return {
            ...config,
            ignores: ['**/dist/**', '**/*sample*'],
        };
    });
}

export default tseslint.config(
    {
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    withIgnores(eslint.configs.recommended),
    withIgnores(tseslint.configs.strict).map((config) => {
        return {
            ...config,
            rules: {
                '@typescript-eslint/no-invalid-void-type': 0,
                'no-undef': 0,
                'no-unused-vars': [
                    'error',
                    {
                        vars: 'all',
                        args: 'none',
                        ignoreRestSiblings: true,
                        caughtErrors: 'all',
                        caughtErrorsIgnorePattern: '.*',
                        destructuredArrayIgnorePattern: '.*',
                    },
                ],
            },
        };
    }),
    withIgnores({
        files: ['**/*.ts'],
        plugins: {
            jsdoc,
            prettier,
        },
        rules: {
            'prefer-const': 'error',
            quotes: [2, 'single', { avoidEscape: true }],
            semi: 'error',
            indent: 'error',
            'no-prototype-builtins': 'off',
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
    }),
    eslintConfigPrettier
);
