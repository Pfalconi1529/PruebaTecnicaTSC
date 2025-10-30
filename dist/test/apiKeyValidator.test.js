import { jest } from '@jest/globals'; // 👈 CRÍTICO: Importar 'jest' para los mocks
import { checkApiKey } from '../infrastructure/middleware/apiKeyValidator.js';
// describe es una función global de Jest, no necesita ser importada
describe('checkApiKey Middleware', () => {
    test('llama next si la API key es válida', () => {
        // Mockear variables de entorno antes de importar el código real si es necesario.
        // Asumiendo que VALID_API_KEY se lee en el import/cuerpo del archivo.
        process.env.DEV_OPS_API_KEY = '12345';
        // Usamos jest.fn() para crear mocks
        const req = { header: jest.fn().mockReturnValue('12345') };
        const res = { status: jest.fn(), send: jest.fn() };
        const next = jest.fn();
        // Limpiar el caché de módulos para que se lea la variable de entorno mockeada
        // Esto es necesario solo si se importa antes de mockear el process.env
        // Para este caso de prueba simple, podemos asumir que se define antes de cualquier importación.
        checkApiKey(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });
    test('retorna 401 si la API key es inválida', () => {
        process.env.DEV_OPS_API_KEY = '12345';
        const req = { header: jest.fn().mockReturnValue('wrong') };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();
        checkApiKey(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Unauthorized: Invalid API Key');
    });
    test('retorna 401 si no se provee API key', () => {
        process.env.DEV_OPS_API_KEY = '12345';
        // header() retorna undefined
        const req = { header: jest.fn().mockReturnValue(undefined) };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();
        checkApiKey(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Unauthorized: API Key is missing');
    });
});
//# sourceMappingURL=apiKeyValidator.test.js.map