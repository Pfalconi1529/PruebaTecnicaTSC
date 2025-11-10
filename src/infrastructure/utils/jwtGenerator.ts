import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid'; 
import { JWT_TRANSACTION_SECRET } from '../context/envVariables.js';


export const generateUniqueTransactionJwt = (timeToLifeSec: number = 60): string => {
    if (!JWT_TRANSACTION_SECRET) {
        throw new Error("JWT_TRANSACTION_SECRET no está configurado.");
    }
    const payload = {
        jti: uuid(), 
    };

    const token = jwt.sign(payload, JWT_TRANSACTION_SECRET, {
        expiresIn: `${timeToLifeSec}s`, 
    });
    
    return token;
};