import { checkApiKey } from '../infrastructure/middleware/apiKeyValidator';
describe('checkApiKey Middleware', () => {
    it('llama next si la API key es válida', () => {
        process.env.DEV_OPS_API_KEY = '12345';
        const req = { header: jest.fn().mockReturnValue('12345') };
        const res = { status: jest.fn(), send: jest.fn() };
        const next = jest.fn();
        checkApiKey(req, res, next);
        expect(next).toHaveBeenCalled();
    });
    it('retorna 401 si la API key es inválida', () => {
        process.env.DEV_OPS_API_KEY = '12345';
        const req = { header: jest.fn().mockReturnValue('wrong') };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();
        checkApiKey(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: 'Clave de autenticación inválida o faltante (API Key).' });
        expect(next).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=apiKeyValidator.test.js.map