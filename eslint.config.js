module.exports = [
  {
    ignores: ['node_modules/**', 'coverage/**', 'dist/**', '*.min.js']
  },
  // Configuration for browser files (ES6 modules)
  {
    files: ['app.js', 'presets.js', 'bpm.js', 'metronome.js', 'tuner.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // ES6 modules for browser
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        // Web APIs
        navigator: 'readonly',
        AudioContext: 'readonly',
        localStorage: 'readonly',
        // Node.js globals for dual export pattern
        module: 'readonly',
        exports: 'readonly'
      }
    },
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }]
    }
  },
  // Configuration for test files (CommonJS)
  {
    files: ['**/*.test.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script', // CommonJS for Jest
      globals: {
        // Jest globals
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
        // Node.js globals
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    },
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-unused-vars': ['warn'],
      'no-console': 'off' // Allow console in tests
    }
  }
];
