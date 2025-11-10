// tests/devops.test.ts 

import { jest, describe, it, expect } from '@jest/globals'; 
import supertest from 'supertest'; 
import { Router } from 'express'; 

// Inyectar secreto y API key.
process.env.JWT_TRANSACTION_SECRET = 'Pfalconi_1529'; 
process.env.DEV_OPS_API_KEY = '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c';

// ------------------------------------------------------------------------------
// IMPORTS DE LA APLICACIÓN
// ------------------------------------------------------------------------------
import type { 
    DEV_OPS_API_KEY, HEADER_JWT, HEADER_KEY, SUCCESS_GREETING, 
    ERR_INVALID_AUTH, ERROR_TOKEN
} from '../src/infrastructure/context/envVariables.js'; 

import { app } from '../src/app.js';
import { router as devOpsRouter } from '../src/presentation/routes/devOpsRouter.js'; 
import { generateUniqueTransactionJwt } from '../src/infrastructure/utils/jwtGenerator.js'; 

// ------------------------------------------------------------------------------
// TEST STRUCTURE
// ------------------------------------------------------------------------------
const request = supertest(app);

const baseData = {
    message: "Esto es una prueba",
    to: "Juan Perez",
    from: "Rita Asturia",
    timeToLifeSec: 45
};

// Mock del router para aislar la prueba
jest.mock('../src/presentation/routes/index.js', () => { 
    const mockRouter = Router();
    mockRouter.use('/devOpsRouter', devOpsRouter); 
    return { router: mockRouter };
});


describe('Microservicio /DevOps (Solo validación JWT)', () => { // Nombre del suite modificado

    it('POST /DevOps debe devolver el mensaje de éxito (200 OK)', async () => {
        const jwtToken = generateUniqueTransactionJwt(baseData.timeToLifeSec);

        const response = await request.post('/devOpsRouter/devOps')
            .set(HEADER_KEY!, DEV_OPS_API_KEY!)
            .set(HEADER_JWT!, jwtToken)
            .send(baseData);
            
        expect(response.statusCode).toBe(200); 
        expect(response.body.message).toContain(SUCCESS_GREETING + baseData.to);
    });

    // 🚨 Este test verifica si el middleware atrapa un token malo.
    it('POST /DevOps debe devolver 401 si el JWT es inválido (Firma Inválida)', async () => {
        const response = await request.post('/devOpsRouter/devOps')
            .set(HEADER_KEY, DEV_OPS_API_KEY)

            .set(HEADER_JWT, 'TOKEN.INVALIDO.AQUI')
            .send(baseData);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe(ERROR_TOKEN);
    });

    it('POST /DevOps debe devolver 401 si falta la API Key', async () => {
        const response = await request.post('/devOpsRouter/devOps')
            .set(HEADER_JWT, 'cualquier_jwt_valido')
            .send(baseData);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe(ERR_INVALID_AUTH);
    });
});