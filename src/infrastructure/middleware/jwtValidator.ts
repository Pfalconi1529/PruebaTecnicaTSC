// src/infrastructure/middleware/jwtValidator.ts

import * as jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express'; 
import { ERROR_TOKEN, HEADER_JWT, JWT_TRANSACTION_SECRET, TOKEN_DUPLICATE } from '../context/envVariables.js';
import redisClient from '../../domain/services/redisClient.js';

// ✅ CORRECCIÓN CRÍTICA 1 (RUNTIME/CJS-ESM): Desempaquetar el objeto para acceder a verify y sign.
// Usamos este const para las llamadas a funciones.
const jsonwebtokenExports = (jwt as any).default || jwt;

// Desestructurar las clases de error del objeto *desempaquetado*
const { JsonWebTokenError, TokenExpiredError } = jsonwebtokenExports; 

interface RequestAugmented extends Request {
    transactionId?: string;
}

// ✅ CORRECCIÓN CRÍTICA 2 (TYPESCRIPT): Usar el import 'jwt' para las definiciones de tipo (JwtPayload).
interface JwtPayloadCustom extends jwt.JwtPayload {
    jti: string;
    iat: number;
    exp: number;
}


const checkJwtTransaction = async (req: Request, res: Response, next: NextFunction) => {

    const request = req as RequestAugmented;
    
    // 1. LECTURA DEL ENCABEZADO
    const headerName = HEADER_JWT!.toLowerCase();
    const headers = request.headers as unknown as { [key: string]: string | string[] | undefined };
    const jwtToken = headers[headerName] as string | undefined; 

    // console.log("esta es lo que viene en el jwt", jwtToken, "y esto es el header ", headers);

    if (!jwtToken) {
        return res.status(401).send({ 
            message: ERROR_TOKEN
        });
    }

    try {
        // 2. VERIFICAR TOKEN (Usando el objeto desempaquetado)
        const decoded = jsonwebtokenExports.verify(jwtToken, JWT_TRANSACTION_SECRET!) as JwtPayloadCustom;
        
        const transactionId = decoded.jti;
        const expirationTime = decoded.exp;
        
        // 3. VERIFICAR BLACKLIST 
        const isUsed = await redisClient.get(transactionId); 
        
        if (isUsed) {
            return res.status(409).send({ message: TOKEN_DUPLICATE });
        }
        
        // 4. ESTABLECER TTL Y MARCAR COMO USADO 
        const now = Math.floor(Date.now() / 1000);
        const ttl = expirationTime - now;
        
        if (ttl > 0) {
            await redisClient.set(transactionId, 'used', {
                EX: ttl,
            });
        }
        
        request.transactionId = transactionId; 
        
        next(); 
    
    } catch (error) {
        // 5. MANEJO ESPECÍFICO DE ERRORES DE JWT
        if (error instanceof TokenExpiredError) {
             return res.status(401).send({ message: 'Token de transacción expirado.' });
        }
        
        if (error instanceof JsonWebTokenError) {
            return res.status(401).send({ message: ERROR_TOKEN });
        }

        // Error general
        console.error('Error no controlado en checkJwtTransaction:', error);
        return res.status(500).send({ message: 'Error interno de servidor.' });
    }
};

export { checkJwtTransaction };