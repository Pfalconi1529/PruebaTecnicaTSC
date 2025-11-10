// tests/devops.test.ts

// ==========================================================
// 1. MOCKEAR MIDDLEWARES DE VALIDACIÓN
// ==========================================================
// Jest interceptará estas importaciones y usará las funciones simuladas.
// Asegúrate de usar la ruta de importación correcta desde el punto de vista de 'devOpsRouter.ts'.

jest.mock('../src/infrastructure/middleware/methodValidator.js', () => ({
    checkHttpMethod: (req, res, next) => next(),
}));

jest.mock('../src/infrastructure/middleware/apiKeyValidator.js', () => ({
    checkApiKey: (req, res, next) => next(),
}));

jest.mock('../src/infrastructure/middleware/jwtValidator.js', () => ({
    checkJwtTransaction: (req, res, next) => next(),
}));

// ==========================================================
// 2. MOCKEAR EL CONTROLADOR (OPCIONAL PERO RECOMENDADO)
// ==========================================================
// Para aislar la prueba y asegurar que la ruta funciona, simularemos el controlador
// para que no ejecute lógica de negocio.

const mockPostMessage = jest.fn((req, res) => {
    // Simulamos una respuesta exitosa
    res.status(200).json({ 
        success: true, 
        message: 'Controller llamado correctamente (Mockeado)' 
    });
});

jest.mock('../src/presentation/controllers/DevOpsController.js', () => ({
    postMessage: mockPostMessage,
}));


// ==========================================================
// 3. INICIO DE LA PRUEBA (DESPUÉS DE TODOS LOS MOCKS)
// ==========================================================
import request from 'supertest';
import { app } from '../src/app.js'; 

const BASE_URL = '/devOpsRouter/devOps'; 

describe('POST /devOps (Ruta DevOps - Middlewares saltados)', () => {

    // Configuración crítica del entorno
    beforeAll(() => {
        // Establece la variable de entorno para forzar la carga síncrona en index.ts
        process.env.NODE_ENV = 'test_routes_enabled';
    });

    afterEach(() => {
        // Limpia el mock después de cada prueba
        mockPostMessage.mockClear();
    });

    it('debería saltar los middlewares y llamar al controlador correctamente', async () => {
        const testBody = { data: 'test message' };

        const response = await request(app)
            .post(BASE_URL)
            .send(testBody);

        // 1. Verificamos que la respuesta sea la simulada por el mock del controlador
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Controller llamado correctamente (Mockeado)');

        // 2. Verificamos que el controlador real fue llamado
        expect(mockPostMessage).toHaveBeenCalledTimes(1);
        
        // 3. Verificamos que recibió el cuerpo de la solicitud
        expect(mockPostMessage).toHaveBeenCalledWith(
            expect.objectContaining({ body: testBody }), // Verifica req.body
            expect.anything(), 
            expect.anything()
        );
    });

    // ... otras pruebas
});

// Finalizar la prueba