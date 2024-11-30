module.exports = {
    preset: 'ts-jest/presets/default-esm', // Use ES module preset
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts$': ['ts-jest', { useESM: true }], // Enable ES module support for TypeScript
      '^.+\\.js$': ['babel-jest', { presets: ['@babel/preset-env'] }]
    },
    extensionsToTreatAsEsm: ['.ts'], // Treat these as ES modules
    moduleNameMapper: {
      '^d3$': 'identity-obj-proxy', // Or use a more specific mapping
      '^(\\.{1,2}/.*)\\.js$': '$1' // Strip .js extension for imports
    },
    transformIgnorePatterns: [
      '/node_modules/(?!d3|d3-array|d3-shape)/'
    ],
    testPathIgnorePatterns: ['/dist/'], // Ignore test files in dist/
  };