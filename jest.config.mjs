// jest.config.mjs (Configuración Final y Definitiva)

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {

  setupFiles: ['dotenv/config'],
  // CRÍTICO: Usar el preset oficial de ts-jest para ESM
  preset: 'ts-jest/presets/default-esm', 
  testEnvironment: 'node', 
  extensionsToTreatAsEsm: ['.ts', '.tsx'],  
  // CRÍTICO: Mapeo de módulos para resolver rutas relativas
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', 
  },

  // 🔥 SOLUCIÓN CRÍTICA: Forzar la transformación de supertest.
  // node_modules/(?!(...)/) significa: NO ignores la transformación de estos paquetes.
  transformIgnorePatterns: [
    'node_modules/(?!(ipaddr.js|proxy-addr|supertest)/)',
  ],
  
  // Usamos el 'transform' para apuntar al tsconfig.test.json
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