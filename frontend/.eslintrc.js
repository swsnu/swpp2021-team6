module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['plugin:prettier/recommended', 'airbnb'],
  rules: {
    'linebreak-style': 0,
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    camelcase: 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'react/react-in-jsx-scope': 'off',
    'object-curly-newline': 'off',
    '@typescript-eslint/camelcase': 'off',
    'no-undef': 'off',
    'no-use-before-define': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
    'react/button-has-type': 'off',
    'no-unused-vars': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['off'],
  },
};
