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
    'jsx-a11y/label-has-associated-control': 'off',
    'react/react-in-jsx-scope': 'off',
    'object-curly-newline': 'off',
    'operator-linebreak': 'off',
    'no-undef': 'off',
    'no-alert': 'off',
    'no-console': 'off',
    'no-use-before-define': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
    'react/button-has-type': 'off',
    'no-unused-vars': 'off',
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
