//verifica la url para que no pase otras rutas 

import type { Request, Response } from 'express';

const notFoundHandler = (req: Request, res: Response) => {
    return res.status(404).send({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method,
        message: `La ruta solicitada ${req.method} ${req.originalUrl} no está definida.`
    });
};

export { notFoundHandler };