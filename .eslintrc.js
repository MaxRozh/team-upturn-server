module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', "prettier"],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    "airbnb",
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    'node_modules',
    'dist',
    'built'
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': ['error'],
    'no-param-reassign': [
      'error',
      {
        'props': true,
        'ignorePropertyModificationsFor': [
          'acc', // for reduce accumulators
          'draft' // for immer
        ]
      }
    ],
    "import/extensions": 0,
    "object-curly-newline": 0,
    "comma-dangle": ["error", "never"],
    "max-len": ["error", {
      "code": 120
    }],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/ban-types": ["error", { "types": { "Function": false } }]
  },
};
