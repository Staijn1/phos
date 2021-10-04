module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['google', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'new-cap': 0,
    'prettier/prettier': [
      1,
      {
        trailingComma: 'es5',
        singleQuote: true,
        semi: false,
      },
    ],
  },
  overrides: [
    {
      files: ['src/**/*-Controller.ts'],
      rules: {
        'require-jsdoc': [
          'error',
          {
            require: {
              FunctionDeclaration: false,
              MethodDefinition: false,
              ClassDeclaration: false,
              ArrowFunctionExpression: false,
              FunctionExpression: false,
            },
          },
        ],
      },
    },
  ],
}
