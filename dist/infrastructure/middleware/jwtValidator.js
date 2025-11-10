import { ERR_MISSING_JWT, ERROR_TOKEN, HEADER_JWT, JWT_TRANSACTION_SECRET, TOKEN_DUPLICATE } from '../context/envVariables.js';
import jwt from 'jsonwebtoken';
import redisClient from '../../domain/services/redisClient.js';
// 👈 CORRECCIÓN FINAL: La función usa el tipo estándar 'Request' de Express en la firma.
const checkJwtTransaction = async (req, res, next) => {
    // 👈 Convertimos 'req' a nuestro tipo aumentado para usar 'transactionId'
    const request = req;
    const headerName = HEADER_JWT.toLowerCase();
    // Usamos la doble aserción para manejar el conflicto de 'headers'
    const headers = request.headers;
    const jwtToken = headers[headerName];
    if (!jwtToken) {
        return res.status(403).send({
            message: ERR_MISSING_JWT
        });
    }
    try {
        const decoded = jwt.verify(jwtToken, JWT_TRANSACTION_SECRET);
        const transactionId = decoded.jti;
        const expirationTime = decoded.exp;
        // 🛑 LÓGICA DE SEGURIDAD (Anti-Replay Attack)
        const isUsed = await redisClient.get(transactionId);
        if (isUsed) {
            return res.status(409).send({ message: TOKEN_DUPLICATE });
        }
        // Calcular el TTL (Time To Live)
        const now = Math.floor(Date.now() / 1000);
        const ttl = expirationTime - now;
        // Guardar el jti en Redis
        if (ttl > 0) {
            await redisClient.set(transactionId, 'used', {
                EX: ttl,
            });
        }
        request.transactionId = transactionId; // 👈 Asignamos la propiedad en el request casteado
    }
    catch (_) {
        return res.status(401).send({ message: ERROR_TOKEN });
    }
    next();
};
export { checkJwtTransaction };
//# sourceMappingURL=jwtValidator.js.map