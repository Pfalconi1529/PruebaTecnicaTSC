import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { JWT_TRANSACTION_SECRET } from '../context/envVariables.js';
export const generateUniqueTransactionJwt = (timeToLifeSec = 60) => {
    if (!JWT_TRANSACTION_SECRET) {
        throw new Error('JWT_TRANSACTION_SECRET no está configurado.');
    }
    const payload = {
        jti: uuid(),
    };
    const token = jwt.sign(payload, JWT_TRANSACTION_SECRET, {
        expiresIn: `${timeToLifeSec}s`,
    });
    return token;
};
//# sourceMappingURL=jwtGenerator.js.map