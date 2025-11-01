module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: false },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:n/recommended',
    'plugin:promise/recommended',
    'prettier'
  ],
  rules: {
    'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
    'no-console': 'off',
    'import/no-unresolved': 'off',
    'n/no-unsupported-features/es-syntax': 'off'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '**/*.min.js'
  ]
}
