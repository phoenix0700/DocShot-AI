module.exports = {
  root: true,
  extends: [require.resolve('./packages/eslint-config-custom')],
  rules: {
    // project specific overrides can go here
  },
  ignorePatterns: ['dist/', '.next/', 'node_modules/'],
};
