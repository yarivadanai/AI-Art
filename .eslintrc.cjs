module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'no-restricted-properties': [
      'error',
      {
        object: 'Math',
        property: 'random',
        message: 'Use deterministic RNG helpers from packages/engine instead of Math.random.',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  ignorePatterns: ['.next/', 'dist/', 'coverage/', 'node_modules/'],
};
