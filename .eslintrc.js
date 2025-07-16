module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  rules: {
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  ignorePatterns: ['dist/', '.next/', 'node_modules/'],
};