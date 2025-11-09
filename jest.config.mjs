export default {

  setupFiles: ['dotenv/config'],

  preset: 'ts-jest/presets/default-esm', 
  testEnvironment: 'node', 
  extensionsToTreatAsEsm: ['.ts', '.tsx'],  
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', 
  },

  transformIgnorePatterns: [
    'node_modules/(?!(ipaddr.js|proxy-addr|supertest)/)',
  ],

  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }],
  },
  
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/server.ts", 
    "!src/config/*.ts" 
  ]
};