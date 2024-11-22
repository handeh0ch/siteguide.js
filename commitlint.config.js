export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-case': [2, 'always', 'lowerCase'],
        'type-empty': [2, 'never'],
        'type-enum': [2, 'always', ['ci', 'docs', 'feat', 'chore', 'fix', 'refactor', 'revert', 'style']],
    },
};
