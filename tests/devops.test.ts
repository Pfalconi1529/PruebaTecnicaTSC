// tests/devops.test.ts
import { router as devOpsRouter } from '../src/presentation/routes/devOpsRouter.js';
import { Router } from 'express'; 
import { jest } from '@jest/globals'; 
jest.mock('../src/presentation/routes/index.js', () => { 
    
    const mockRouter = Router();
    
    mockRouter.use('/devOpsRouter', devOpsRouter); 
    
    return { router: mockRouter };
});

import supertest from 'supertest'; 
import { app } from '../src/app'; 
import { DEV_OPS_API_KEY, HEADER_JWT, HEADER_KEY, SUCCESS_GREETING } from '../src/infrastructure/context/envVariables'; 
import { ERR_INVALID_AUTH } from '../src/infrastructure/context/envVariables';
import { generateUniqueTransactionJwt } from '../src/infrastructure/utils/jwtGenerator';

const apiKey: string = DEV_OPS_API_KEY as string; 
const baseData = {
    message: 'Esto es una prueba',
    to: 'Juan Perez',
    from: 'Rita Asturia',
    timeToLifeSec: 45,
};

const request = supertest(app);

describe('Microservicio /DevOps', () => {
    
    test('POST /DevOps debe devolver el mensaje de éxito', async () => {
        
        const validToken = await generateUniqueTransactionJwt();

        const response = await request
            .post('/devOpsRouter/devOps') 
            .set(HEADER_KEY as string, apiKey) 
            .set(HEADER_JWT as string, validToken)
            
            .send(baseData);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain(SUCCESS_GREETING + baseData.to);
    });
    test('POST /DevOps debe devolver 401 si falta la API Key', async () => {
        const validToken = await generateUniqueTransactionJwt();
        
        const response = await request
            .post('/devOpsRouter/devOps')
            .set(HEADER_JWT as string, validToken)
            .send(baseData); 
            
        expect(response.statusCode).toBe(401); 
        
        expect(response.body.message).toBe(ERR_INVALID_AUTH); 
    });
});

//cambio de rama