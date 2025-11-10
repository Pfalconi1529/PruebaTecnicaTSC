// tests/devops.test.ts

import { jest } from '@jest/globals';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { Router } from 'express';
// ¡NO importamos MockedFn!
import type { jest as jestType } from '@jest/globals';
import {
    DEV_OPS_API_KEY, HEADER_JWT, HEADER_KEY, SUCCESS_GREETING,
    TOKEN_DUPLICATE, JWT_TRANSACTION_SECRET
} from '../src/infrastructure/context/envVariables.js';

// --- CONFIGURACIÓN DE MOCKS ---

// 🎯 PASO 1: ACTIVACIÓN DEL AUTO-MOCKING
jest.mock('../src/domain/services/__mocks__/redisClient.js');

// 🎯 PASO 2: IMPORTACIÓN Y TIPADO EXPLÍCITO DE LOS MOCKS
// --------------------------------------------------------------------------------
// Definimos las firmas COMPLETAS de las funciones mockeadas.
// Asumo que get toma un string (key) y set toma un string, un valor y opciones.
// --------------------------------------------------------------------------------
type GetFn = (key: string) => Promise<string | null>;
type SetFn = (key: string, value: string, options?: any) => Promise<'OK' | null>;


// Importamos las funciones del módulo real.
import { get, set } from '../src/domain/services/__mocks__/redisClient.js';


// 🛑 CORRECCIÓN FINAL: Usamos jestType.Mock con la firma de la función (GetFn/SetFn)
// Esto cumple con el requisito 'FunctionLike' y no requiere MockedFn.
const mockGet = get as jestType.Mock<GetFn>;
const mockSet = set as jestType.Mock<SetFn>;


// --- IMPORTS RESTANTES ---

import { router as devOpsRouter } from '../src/presentation/routes/devOpsRouter.js';
import { app } from '../src/app.js';


// --- CONFIGURACIÓN INICIAL ---

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
        mockGet.mockClear();
        mockSet.mockClear();

        // Configuración por defecto: token NO usado (retorna null)
        mockGet.mockResolvedValue(null);

        // Configuración por defecto: set exitoso
        mockSet.mockResolvedValue('OK');
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
        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockSet).toHaveBeenCalledTimes(1);
    });

    test('POST /DevOps debe devolver 409 si el JWT ya fue utilizado (Blacklist)', async () => {
        const validToken = await generateTestJwt();

        // Simular que el token SÍ está en la blacklist
        mockGet.mockResolvedValue('used');

        const response = await request
            .post(ENDPOINT)
            .set(HEADER_KEY as string, apiKey)
            .set(HEADER_JWT as string, validToken)
            .send(baseData);

        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe(TOKEN_DUPLICATE);
        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockSet).not.toHaveBeenCalled();
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