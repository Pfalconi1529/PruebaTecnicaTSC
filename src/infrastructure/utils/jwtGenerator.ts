// src/infrastructure/utils/jwtGenerator.ts

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; // Necesitas instalar 'uuid'
import { JWT_TRANSACTION_SECRET } from '../context/envVariables.ts';


const generateUniqueTransactionJwt = (): string => {

    const transactionId = uuidv4(); 

    const payload = {
        jti: transactionId, 
        iat: Date.now(),    
    };

    const token = jwt.sign(
        payload, 
        JWT_TRANSACTION_SECRET,
        { expiresIn: '5m' } // Válido por 5 minutos
    );
    
    return token;
};

export { generateUniqueTransactionJwt };