// src/infrastructure/middleware/jwtValidator.ts

import type { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { 
    HEADER_JWT, JWT_TRANSACTION_SECRET, ERROR_TOKEN, ERR_MISSING_JWT, TOKEN_DUPLICATE 
} from '../context/envVariables.js';
// 🚨 CRÍTICO: Importar las funciones de Redis (que Jest está mockeando)
import { get, set } from '../../domain/services/redisClient.js'; 

// Este es el TTL por defecto, si no se encuentra en el payload
const DEFAULT_TTL_SECONDS = 60; 

// 🚨 La función DEBE ser asíncrona para usar await con Redis
export const checkJwtTransaction = async (req: Request, res: Response, next: NextFunction) => {
    // Es mejor acceder a headers directamente en Express, sin el tipo 'as string'
    const jwtToken = req.headers[HEADER_JWT] as string | undefined;

    if (!jwtToken) {
        return res.status(403).send({ message: ERR_MISSING_JWT });
    }

    try {
        // 1. Verificar y decodificar el token
        const decoded = jwt.verify(jwtToken, JWT_TRANSACTION_SECRET) as jwt.JwtPayload;
        const jti = decoded.jti;
        const exp = decoded.exp;

        if (!jti) {
            return res.status(400).send({ message: ERROR_TOKEN });
        }
        
        // 2. VERIFICACIÓN DE BLACKLIST (Llama a mockGet)
        const isUsed = await get(jti); 

        if (isUsed) {
            // Token duplicado: Aquí es donde debería fallar el test 409
            return res.status(409).send({ message: TOKEN_DUPLICATE });
        }
        
        // 3. AGREGAR A LA BLACKLIST (Llama a mockSet)
        let ttl = DEFAULT_TTL_SECONDS;
        if (exp) {
            // Calcular el TTL real basado en la expiración del token
            ttl = exp - Math.floor(Date.now() / 1000);
            if (ttl <= 0) {
                return res.status(400).send({ message: ERROR_TOKEN });
            }
        }
        
        // El TTL se calcula como el tiempo restante de vida del token
        await set(jti, 'true', { EX: ttl }); 

        next();

    } catch (error) {
        // Manejo de errores de JWT (expiración, firma inválida, etc.)
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send({ message: ERROR_TOKEN });
        } 
        
        // Este error solo ocurriría si el mock falla o si Redis real está caído
        if (error instanceof Error && error.message.includes('ClientClosedError')) {
            console.error('Error de Redis (ClientClosedError):', error);
            return res.status(500).send({ message: 'Error interno de servidor. Problema de caché.' });
        }

        console.error('Error no controlado en checkJwtTransaction:', error);
        return res.status(500).send({ message: 'Error interno de servidor.' });
    }
};