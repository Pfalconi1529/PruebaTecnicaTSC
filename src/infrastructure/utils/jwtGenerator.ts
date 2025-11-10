// src/infrastructure/utils/jwtGenerator.ts

import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid'; // Asegúrate de tener instalado 'uuid'
import { JWT_TRANSACTION_SECRET } from '../context/envVariables.js';

/**
 * Genera un JWT único con un JTI (UUID) para el seguimiento de la blacklist de Redis.
 * @param timeToLifeSec - Tiempo de vida del token en segundos.
 */
export const generateUniqueTransactionJwt = (timeToLifeSec: number): string => {
    // Esto debería estar seteado gracias a 'dotenv/config' en Jest.
    if (!JWT_TRANSACTION_SECRET) {
        // En un entorno de prueba donde dotenv/config falló, esto podría lanzar un error.
        throw new Error("JWT_TRANSACTION_SECRET no está configurado.");
    }
    
    // El payload DEBE incluir 'jti' (JWT ID) para que el middleware lo lea
    const payload = {
        jti: uuid(), 
    };

    const token = jwt.sign(payload, JWT_TRANSACTION_SECRET, {
        expiresIn: `${timeToLifeSec}s`, // Ejemplo: '45s'
    });

    return token;
};