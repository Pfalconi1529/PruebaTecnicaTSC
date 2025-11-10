
// valida la key del header

import type { Request, Response, NextFunction } from 'express';
import { DEV_OPS_API_KEY, ERR_INVALID_AUTH, HEADER_KEY } from '../context/envVariables.js';



const checkApiKey = (req: Request, res: Response, next: NextFunction) => {

    console.log("Estas son las variables", HEADER_KEY, DEV_OPS_API_KEY)

    const providedKey = req.header(HEADER_KEY!);
    if (!providedKey || providedKey !== DEV_OPS_API_KEY) {
        return res.status(401).send({ 
            message: ERR_INVALID_AUTH
        });
    }
    next(); 
    
};

export { checkApiKey };