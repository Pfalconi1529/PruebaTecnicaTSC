import { ERR_MISSING_JWT, ERROR_TOKEN, HEADER_JWT, JWT_TRANSACTION_SECRET } from '../context/envVariables.js';
import jwt from 'jsonwebtoken';
const checkJwtTransaction = (req, res, next) => {
    const jwtToken = req.header(HEADER_JWT);
    if (!jwtToken) {
        return res.status(403).send({
            message: ERR_MISSING_JWT
        });
    }
    try {
        const decoded = jwt.verify(jwtToken, JWT_TRANSACTION_SECRET);
        req.transactionId = decoded.jti;
    }
    catch (err) {
        console.error("❌ JWT Verify error:", err);
        return res.status(401).send({ message: ERROR_TOKEN });
    }
    next();
};
export { checkJwtTransaction };
//# sourceMappingURL=jwtValidator.js.map