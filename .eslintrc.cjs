/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

const path = require('node:path');
const createAliasSetting = require('@vue/eslint-config-airbnb/createAliasSetting');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-airbnb',
  ],
  rules: {
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
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-shadow': [2, { allow: ['state', 'getters'] }],
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
    ecmaVersion: 'latest',
  },
};
