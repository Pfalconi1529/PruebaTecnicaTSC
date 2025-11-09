// genera el jwt 

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; 
import { JWT_TRANSACTION_SECRET } from '../context/envVariables';


const generateUniqueTransactionJwt = (): string => {

    const transactionId = uuidv4(); 

    const payload = {
        jti: transactionId, 
        iat: Date.now(),    
    };

    const token = jwt.sign(
        payload, 
        JWT_TRANSACTION_SECRET,
        { expiresIn: '60m' } 
    );
    
    return token;
};

export { generateUniqueTransactionJwt };