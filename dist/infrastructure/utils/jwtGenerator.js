import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JWT_TRANSACTION_SECRET } from '../context/envVariables.js';
const generateUniqueTransactionJwt = () => {
    const transactionId = uuidv4();
    const payload = {
        jti: transactionId,
        iat: Date.now(),
    };
    const token = jwt.sign(payload, JWT_TRANSACTION_SECRET, { expiresIn: '5m' });
    return token;
};
export { generateUniqueTransactionJwt };
//# sourceMappingURL=jwtGenerator.js.map