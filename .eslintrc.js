module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2022: true,
        node: true
    },
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'script'
    },
    rules: {
        'no-unused-vars': ['warn', { args: 'none' }],
        'no-console': 'off',
        'no-var': 'error',
        'prefer-const': 'warn',
        'eqeqeq': ['error', 'always'],
        'curly': ['error', 'all'],
        'no-throw-literal': 'error',
        'no-return-await': 'error',
        'require-await': 'warn'
    },
    ignorePatterns: ['node_modules/', 'public/js/', 'archive/', '*.min.js']
};
