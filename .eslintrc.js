const path = require('path')

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.join(__dirname, './tsconfig.eslint.json'),
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.js'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: path.join(__dirname, './tsconfig.eslint.json'),
      },
    },
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/ban-types': ['warn'],
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    'import/prefer-default-export': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    'import/newline-after-import': 'off',
    'max-classes-per-file': 'off',
    'no-console': 'off',
  },
}
