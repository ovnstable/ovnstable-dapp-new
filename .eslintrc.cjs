/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

const path = require('node:path');
const createAliasSetting = require('@vue/eslint-config-airbnb/createAliasSetting');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-airbnb',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'vue/no-unused-properties': ['error', {
      groups: ['props', 'methods', 'data', 'computed'],
      deepData: true,
      ignorePublicMembers: false,
      unreferencedOptions: ['unknownMemberAsUnreferenced'],
    }],
    'vue/html-indent': [
      'error',
      2,
    ],
    'no-plusplus': 0,
    'padded-blocks': ['error', 'never'],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'always',
    }],
    'vuejs-accessibility/form-control-has-label': 0,
    'no-console': isProd ? 'warn' : 'off',
    'no-debugger': isProd ? 'warn' : 'off',
    'no-shadow': 'off',
    'no-param-reassign': ['error', {
      props: true, ignorePropertyModificationsFor: ['state'],
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 1,
      },
      multiline: {
        max: 1,
      },
    }],
  },
  settings: {
    ...createAliasSetting({
      '@': `${path.resolve(__dirname, './src')}`,
    }),
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
};
