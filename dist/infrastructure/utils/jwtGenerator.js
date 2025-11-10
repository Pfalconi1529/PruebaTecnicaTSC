import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { JWT_TRANSACTION_SECRET } from '../context/envVariables.js';
/**
 * Genera un JWT único con un JTI (UUID) para el seguimiento de la blacklist de Redis.
 * @param timeToLifeSec - Tiempo de vida del token en segundos (opcional, por defecto 60).
 */
export const generateUniqueTransactionJwt = (timeToLifeSec = 60) => {
    console.log("Generador: ", JWT_TRANSACTION_SECRET);
    // Esto debería estar seteado gracias a 'dotenv/config' en Jest.
    if (!JWT_TRANSACTION_SECRET) {
        throw new Error("JWT_TRANSACTION_SECRET no está configurado.");
    }
    // El payload DEBE incluir 'jti' (JWT ID) para que el middleware lo lea
    const payload = {
        jti: uuid(),
    };
    console.log("Payload: ", payload, JWT_TRANSACTION_SECRET);
    const token = jwt.sign(payload, JWT_TRANSACTION_SECRET, {
        expiresIn: `${timeToLifeSec}s`,
    });
    return token;
};
//# sourceMappingURL=jwtGenerator.js.map