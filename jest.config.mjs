// jest.config.mjs

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    // Usar el preset de ts-jest para módulos ESM
    preset: 'ts-jest/presets/default-esm',

    // CRÍTICO: Carga las variables de entorno del archivo .env antes de los tests.
    // Esto resuelve el problema de JWT_TRANSACTION_SECRET.
    setupFiles: ['dotenv/config'],

    // Define los archivos de prueba
    testMatch: [
        "**/tests/**/*.test.ts"
    ],
    
    // Indica dónde están los archivos fuente para la cobertura
    collectCoverageFrom: [
        "src/**/*.ts",
    ],

    // Mapeo para manejar la resolución de módulos y la extensión .js
    moduleNameMapper: {
        // Mapea las importaciones que terminan en .js hacia el archivo .ts.
        "^(\\.\\.?\\/.+)\\.js$": "$1",
    },

    // Configuración para el transformador ts-jest
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: './tsconfig.json',
                useESM: true,
            },
        ],
    },

    // Extensión del archivo
    extensionsToTreatAsEsm: ['.ts'],
};