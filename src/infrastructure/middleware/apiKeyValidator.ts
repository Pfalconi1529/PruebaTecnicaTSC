

import type { Request, Response, NextFunction } from 'express';
import { ERR_INVALID_AUTH, HEADER_KEY } from '../context/envVariables.js';

const VALID_API_KEY = process.env.DEV_OPS_API_KEY; 

const checkApiKey = (req: Request, res: Response, next: NextFunction) => {

    const providedKey = req.header(HEADER_KEY!);
    if (!providedKey || providedKey !== VALID_API_KEY) {
        return res.status(401).send({ 
            message: ERR_INVALID_AUTH
        });
    }
    next(); 
};

export { checkApiKey };