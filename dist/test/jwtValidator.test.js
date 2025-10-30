import jwt from 'jsonwebtoken';
import { checkJwtTransaction } from '../infrastructure/middleware/jwtValidator';
import { ERR_MISSING_JWT, ERROR_TOKEN, HEADER_JWT, JWT_TRANSACTION_SECRET } from '../infrastructure/context/envVariables.js';
describe('checkJwtTransaction Middleware', () => {
    let req;
    let res;
    let next;
    const validPayload = { jti: 'test-transaction-id', iat: Math.floor(Date.now() / 1000) };
    beforeEach(() => {
        req = {
            header: jest.fn(),
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        next = jest.fn();
        process.env.JWT_TRANSACTION_SECRET = 'Pfalconi_1529';
    });
    it('permite acceso si el JWT es válido', () => {
        // Generamos un JWT válido usando la misma secret que el middleware
        const token = jwt.sign(validPayload, process.env.JWT_TRANSACTION_SECRET, { expiresIn: '5m' });
        req.header.mockReturnValue(token);
        checkJwtTransaction(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.transactionId).toBe(validPayload.jti);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });
    it('retorna 403 si no se provee token', () => {
        req.header.mockReturnValue(undefined);
        checkJwtTransaction(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ message: ERR_MISSING_JWT });
    });
    it('retorna 401 si el token es inválido', () => {
        req.header.mockReturnValue('invalid-token');
        checkJwtTransaction(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: ERROR_TOKEN });
    });
    it('permite usar un token expirado si quieres mockear expiración (opcional)', () => {
        const expiredToken = jwt.sign(validPayload, process.env.JWT_TRANSACTION_SECRET, { expiresIn: '-1s' });
        req.header.mockReturnValue(expiredToken);
        checkJwtTransaction(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: ERROR_TOKEN });
    });
});
//# sourceMappingURL=jwtValidator.test.js.map