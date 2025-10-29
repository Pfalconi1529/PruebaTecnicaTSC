// src/infrastructure/middleware/jwtValidator.ts
import { ERR_MISSING_JWT, ERROR_TOKEN, HEADER_JWT, JWT_TRANSACTION_SECRET } from '../context/envVariables.js';
import jwt from 'jsonwebtoken';
const checkJwtTransaction = (req, res, next) => {
    const jwtToken = req.header(HEADER_JWT);
    console.log("Este es el que me viene", jwtToken);
    if (!jwtToken) {
        return res.status(403).send({
            message: ERR_MISSING_JWT
        });
    }
    try {
        const decoded = jwt.verify(jwtToken, JWT_TRANSACTION_SECRET);
        console.log(decoded);
        req.transactionId = decoded.jti;
        console.log("decodificado", req.transactionId);
    }
    catch (error) {
        console.error("JWT Invalido o expirado", error.message);
        return res.status(401).send({ message: ERROR_TOKEN });
    }
    next();
};
export { checkJwtTransaction };
//# sourceMappingURL=jwtValidator.js.map