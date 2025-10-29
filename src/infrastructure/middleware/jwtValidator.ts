// src/infrastructure/middleware/jwtValidator.ts

import type { Request, Response, NextFunction } from 'express';
import { ERR_MISSING_JWT, ERROR_TOKEN, HEADER_JWT, JWT_TRANSACTION_SECRET } from '../context/envVariables.ts';
import  jwt  from 'jsonwebtoken';


const checkJwtTransaction = (req: Request, res: Response, next: NextFunction) => {
    
    const jwtToken = req.header(HEADER_JWT!);
    
    console.log("Este es el que me viene", jwtToken)
    if (!jwtToken) {
        return res.status(403).send({ 
            message: ERR_MISSING_JWT
        });
    }

    try {
        
        const decoded = jwt.verify(jwtToken, JWT_TRANSACTION_SECRET!) as { jti: string, iat: number };
        console.log(decoded);

        (req as any).transactionId = decoded.jti; 
        console.log("decodificado", (req as any).transactionId)

    } catch (error) {
     
        console.error("JWT Invalido o expirado", (error as Error).message);
        return res.status(401).send({ message: ERROR_TOKEN });
    }

    next(); 
};

export { checkJwtTransaction };