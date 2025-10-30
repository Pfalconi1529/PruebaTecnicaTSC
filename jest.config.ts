import type { Config } from 'jest';

const config: Config = {
    // 1. CRÍTICO: Usa el preset que configura automáticamente Jest para TypeScript y ES Modules (ESM).
    preset: 'ts-jest/presets/default-esm', 
    
    // 2. CRÍTICO: Mapea las importaciones que terminan en .js (requeridas por NodeNext) 
    // a sus archivos .ts correspondientes. Esto soluciona los errores de "Cannot find module ... .js".
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1', 
    },

    // 3. Indica que solo debe buscar pruebas dentro de la carpeta src/test/
    testMatch: [
        "<rootDir>/src/test/**/*.test.ts"
    ],
    
    // 4. Define el entorno de ejecución como Node.js.
    testEnvironment: 'node',
};

export default config;
