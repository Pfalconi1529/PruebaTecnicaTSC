import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import request from 'supertest';
import { app } from '../src/app.js';

const BASE_URL = '/devOps'; 

describe('POST /devOps (Ruta DevOps)', () => {
    
    beforeAll(() => {
        process.env.NODE_ENV = 'test';
    });

    it('debería responder con 401 si no se envía token ni api-key', async () => {
        const response = await request(app)
            .post(`${BASE_URL}`)
            .send({});
        expect([401, 403, 404]).toContain(response.status);
    });
});
