module.exports = {
  root: false,
  extends: [
    'eslint:recommended',
    'turbo',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    node: true,
    es2022: true,
    browser: true,
  },
  rules: {
    'no-unused-vars': 'warn',
  },
}; 