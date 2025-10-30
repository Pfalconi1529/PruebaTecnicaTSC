// valida el metodo http que se usa 

import type { Request, Response, NextFunction } from 'express';
import { ERR_GENERIC_METHOD } from '../context/envVariables.js';

const checkHttpMethod = (req: Request, res: Response, next: NextFunction) => {
    
    if (req.method !== 'POST') {
        return res.status(405).send(ERR_GENERIC_METHOD); 
    }

    next(); 
};

export { checkHttpMethod };