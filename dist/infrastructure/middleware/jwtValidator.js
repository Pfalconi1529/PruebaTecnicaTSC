import { ERROR_TOKEN, HEADER_JWT, JWT_TRANSACTION_SECRET, TOKEN_DUPLICATE } from '../context/envVariables.js';
import jwt from 'jsonwebtoken';
import redisClient from '../../domain/services/redisClient.js';
const checkJwtTransaction = async (req, res, next) => {
    const request = req;
    const headerName = HEADER_JWT.toLowerCase();
    const headers = request.headers;
    const jwtToken = headers[headerName];
    if (!jwtToken) {
        return res.status(401).send({
            message: ERROR_TOKEN
        });
    }
    try {
        const decoded = jwt.verify(jwtToken, JWT_TRANSACTION_SECRET);
        const transactionId = decoded.jti;
        const expirationTime = decoded.exp;
        const isUsed = await redisClient.get(transactionId);
        if (isUsed) {
            return res.status(409).send({ message: TOKEN_DUPLICATE });
        }
        const now = Math.floor(Date.now() / 1000);
        const ttl = expirationTime - now;
        if (ttl > 0) {
            await redisClient.set(transactionId, 'used', {
                EX: ttl,
            });
        }
        request.transactionId = transactionId;
    }
    catch (_) {
        return res.status(401).send({ message: ERROR_TOKEN });
    }
    next();
};
export { checkJwtTransaction };
//# sourceMappingURL=jwtValidator.js.map