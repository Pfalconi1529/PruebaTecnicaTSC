/**
 * todo: Manejador de errores
 */

import type { Response } from "express";

const handleHttp = (res: Response, error: Error) => {
    res.status(500);
    res.send({
        error: error.message,
    })
}

export { handleHttp }