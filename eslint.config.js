// Expo's standard lint rules (React, React Hooks, import resolution, React Native basics).
//
// Real-bug rules (undefined variables, unreachable code, bad imports, ...) stay errors and fail the PR check.
// Rules that only flag long-standing style or the newer React Compiler patterns in existing screens are warnings:
// they show up in the log and in review without blocking a merge. Tighten them to errors screen by screen as the
// warnings are cleared.
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  globalIgnores(['dist/*', 'android/*', 'ios/*', '.expo/*', 'coverage/*']),
  {
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react/display-name': 'warn',
      'no-var': 'warn',
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        jest: 'readonly', describe: 'readonly', test: 'readonly', expect: 'readonly', afterEach: 'readonly',
      },
    },
  },
]);
