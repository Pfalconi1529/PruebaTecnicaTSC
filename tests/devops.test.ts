// tests/devops.test.ts

import { jest } from '@jest/globals';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { Router } from 'express';
import {
    DEV_OPS_API_KEY, HEADER_JWT, HEADER_KEY, SUCCESS_GREETING,
    TOKEN_DUPLICATE, JWT_TRANSACTION_SECRET
} from '../src/infrastructure/context/envVariables.js';
import { generateUniqueTransactionJwt } from '../src/infrastructure/utils/jwtGenerator.js';

// ==============================================================================
// 🎯 PASO 1: MOCKING DEL CLIENTE REDIS Y EXTRACCIÓN DE LAS FUNCIONES MOCKEADAS
// ==============================================================================

// 1. Decir a Jest que mockee el módulo (usará la versión en __mocks__/)
jest.mock('../src/domain/services/redisClient.js');

// 2. Importar la versión MOCKEADA del módulo
import * as redisMock from '../src/domain/services/__mocks__/redisClient.js';

// 3. Extracción de las funciones. Las extraemos con 'as any' para evitar el error de tipado.
// Esto permite que el código de JS se ejecute, que es lo que rompe las pruebas.
const finalMockGet = redisMock.get as any;
const finalMockSet = redisMock.set as any;


// ------------------------------------------------------------------------------
// 🎯 PASO 2: IMPORTS RESTANTES
// ------------------------------------------------------------------------------

import { router as devOpsRouter } from '../src/presentation/routes/devOpsRouter.js';
import { app } from '../src/app.js';


// ------------------------------------------------------------------------------
// 🎯 PASO 3: CONFIGURACIÓN INICIAL
// ------------------------------------------------------------------------------

jest.mock('../src/presentation/routes/index.js', () => {
    const mockRouter = Router();
    mockRouter.use('/devOpsRouter', devOpsRouter);
    return { router: mockRouter };
});

const jsonwebtokenExports = (jwt as any).default || jwt;
const apiKey: string = DEV_OPS_API_KEY as string;
const baseData = {
    message: 'Esto es una prueba',
    to: 'Juan Perez',
    from: 'Rita Asturia',
    timeToLifeSec: 45,
};
const request = supertest(app);
const ENDPOINT = '/devOpsRouter/devOps';

// --- UTILIDADES DE PRUEBA ---
const generateTestJwt = async (payload = { jti: 'fake-unique-uuid' }) => {
    return jsonwebtokenExports.sign(payload, JWT_TRANSACTION_SECRET!, {
        expiresIn: '1h',
    });
};
// ---------------------------


describe('Microservicio /DevOps (Con validación de Redis Mockeada)', () => {

    beforeEach(() => {
        finalMockGet.mockClear();
        finalMockSet.mockClear();

        // Configuración por defecto: token NO usado (retorna null)
        // Usamos @ts-ignore como último recurso para silenciar el error de tipado estricto
        // y asegurar que el valor 'null' se pueda pasar.
        // @ts-ignore
        finalMockGet.mockResolvedValue(null);

        // Configuración por defecto: set exitoso
        // @ts-ignore
        finalMockSet.mockResolvedValue('OK');
    });


    // --- TESTS DE FUNCIONAMIENTO ---

    test('POST /DevOps debe devolver el mensaje de éxito (200 OK)', async () => {
        const validToken = await generateTestJwt();
        const response = await request
            .post(ENDPOINT)
            .set(HEADER_KEY as string, apiKey)
            .set(HEADER_JWT as string, validToken)
            .send(baseData);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain(SUCCESS_GREETING + baseData.to);
        expect(finalMockGet).toHaveBeenCalledTimes(1);
        expect(finalMockSet).toHaveBeenCalledTimes(1);
    });

    test('POST /DevOps debe devolver 409 si el JWT ya fue utilizado (Blacklist)', async () => {
        const validToken = await generateTestJwt();

        // Simular que el token SÍ está en la blacklist
        // @ts-ignore
        finalMockGet.mockResolvedValue('used');

        const response = await request
            .post(ENDPOINT)
            .set(HEADER_KEY as string, apiKey)
            .set(HEADER_JWT as string, validToken)
            .send(baseData);

        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe(TOKEN_DUPLICATE);
        expect(finalMockGet).toHaveBeenCalledTimes(1);
        expect(finalMockSet).not.toHaveBeenCalled();
    });

    test('POST /DevOps debe devolver 401 si falta la API Key', async () => {
        const validToken = await generateTestJwt();

        const response = await request
            .post(ENDPOINT)
            .set(HEADER_JWT as string, validToken)
            .send(baseData);

        expect(response.statusCode).toBe(401);
    });
});