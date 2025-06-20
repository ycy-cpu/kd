// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended', // 确保在最后
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'prettier', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-console': ['warn', { allow: ['error', 'warn'] }],
    'no-debugger': 'error',
    'no-unused-vars': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true, // 使用单引号
        trailingComma: 'all', // 尾随逗号
      },
    ],
    // 禁用可能与 Prettier 冲突的规则
    'spaced-comment': 'off',
    'space-before-function-paren': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      parser: 'espree',
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['.eslintrc.js', 'craco.config.js', 'jest.config.js'],
      env: {
        node: true,
      },
      parser: 'espree',
      rules: {
        'no-undef': 'off',
      },
    },
  ],
}
