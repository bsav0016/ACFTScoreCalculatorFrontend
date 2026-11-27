// Expo's standard lint rules (React, React Hooks, import resolution, React Native basics).
//
// Real-bug rules (undefined variables, unreachable code, bad imports, ...) stay errors and fail the PR check.
// Rules that only flag long-standing style or the newer React Compiler patterns in existing screens are warnings:
// they show up in the log and in review without blocking a merge. Tighten them to errors screen by screen as the
// warnings are cleared.
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const a11y = require('./scripts/eslint-rule-a11y');

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
    // Screen-reader support: see scripts/eslint-rule-a11y.js. Errors, because a control without a name or role is unusable.
    files: ['components/**/*.js', 'App.js'],
    plugins: { a11y },
    rules: {
      'a11y/input-has-name': 'error',
      'a11y/touchable-has-role': 'error',
    },
  },
  {
    // Text and TextInput come from components/text.js, which caps the phone's text-size scaling at 2x.
    files: ['components/**/*.js', 'App.js'],
    ignores: ['components/text.js'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [{
          name: 'react-native',
          importNames: ['Text', 'TextInput'],
          message: "Import Text and TextInput from components/text.js (it caps text scaling), not from 'react-native'.",
        }],
      }],
    },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: { require: 'readonly', module: 'readonly', process: 'readonly', console: 'readonly', __dirname: 'readonly' },
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        jest: 'readonly', describe: 'readonly', test: 'readonly', expect: 'readonly', afterEach: 'readonly', beforeEach: 'readonly', __dirname: 'readonly',
      },
    },
  },
]);
