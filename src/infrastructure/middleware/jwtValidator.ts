// validacion de jwt para las rutas 

import type { Request, Response, NextFunction } from 'express';
import { ERR_MISSING_JWT, ERROR_TOKEN, HEADER_JWT, JWT_TRANSACTION_SECRET } from '../context/envVariables.js';
import  jwt  from 'jsonwebtoken';


const checkJwtTransaction = (req: Request, res: Response, next: NextFunction) => {
    
    const jwtToken = req.header(HEADER_JWT!);

    console.log(jwtToken)
    

    if (!jwtToken) {
        return res.status(403).send({ 
            message: ERR_MISSING_JWT
        });
    }

    try {

        const decoded = jwt.verify(jwtToken, JWT_TRANSACTION_SECRET) as { jti: string, iat: number };
        (req as any).transactionId = decoded.jti; 
        console.log(decoded);
    } catch (error) {
        return res.status(401).send({ message: ERROR_TOKEN });
    }

    next(); 
};

export { checkJwtTransaction };