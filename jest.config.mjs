export default {

    preset: 'ts-jest/presets/default-esm',
    testEnviroment: 'node',
    global: true,
    testMatch: [
        "**/tests/**/*.test.ts"
    ],

    collectCoverageFrom: [
        "src/**/*.ts",
    ],
    moduleNameMapper: {

        "^(\\.\\.?\\/.+)\\.js$": "$1",
    },


    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: './tsconfig.json',
                useESM: true,
            },
        ],
    },


    extensionsToTreatAsEsm: ['.ts'],
};