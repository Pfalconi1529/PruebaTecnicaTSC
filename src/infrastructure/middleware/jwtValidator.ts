import type { Request, Response, NextFunction } from 'express'; // 👈 Aseguramos la importación de Request
import { ERR_MISSING_JWT, ERROR_TOKEN, HEADER_JWT, JWT_TRANSACTION_SECRET, TOKEN_DUPLICATE } from '../context/envVariables.js';
import jwt from 'jsonwebtoken';
import redisClient from '../../domain/services/redisClient.js';


// Interfaz que define las propiedades que queremos agregar al request (puedes moverla a express.d.ts)
interface RequestAugmented extends Request {
    transactionId?: string;
}

// Interfaz actualizada para el payload decodificado
interface JwtPayloadCustom extends jwt.JwtPayload {
    jti: string; // Transaction ID
    iat: number;
    exp: number; // Expiration time (Timestamp UNIX)
}

// 👈 CORRECCIÓN FINAL: La función usa el tipo estándar 'Request' de Express en la firma.
const checkJwtTransaction = async (req: Request, res: Response, next: NextFunction) => {
    
    // 👈 Convertimos 'req' a nuestro tipo aumentado para usar 'transactionId'
    const request = req as RequestAugmented;
    
    const headerName = HEADER_JWT!.toLowerCase();
    
    // Usamos la doble aserción para manejar el conflicto de 'headers'
    const headers = request.headers as unknown as { [key: string]: string | string[] | undefined };
    const jwtToken = headers[headerName] as string | undefined; 

    if (!jwtToken) {
        return res.status(403).send({ 
            message: ERR_MISSING_JWT
        });
    }

    try {
        const decoded = jwt.verify(jwtToken, JWT_TRANSACTION_SECRET!) as JwtPayloadCustom;
        
        const transactionId = decoded.jti;
        const expirationTime = decoded.exp;

        // 🛑 LÓGICA DE SEGURIDAD (Anti-Replay Attack)
        const isUsed = await redisClient.get(transactionId); 
        
        if (isUsed) {
            return res.status(409).send({ message: TOKEN_DUPLICATE });
        }
        
        // Calcular el TTL (Time To Live)
        const now = Math.floor(Date.now() / 1000);
        const ttl = expirationTime - now;
        
        // Guardar el jti en Redis
        if (ttl > 0) {
            await redisClient.set(transactionId, 'used', {
                EX: ttl,
            });
        }
        
        request.transactionId = transactionId; // 👈 Asignamos la propiedad en el request casteado
    
    } catch (_) {
        return res.status(401).send({ message: ERROR_TOKEN });
    }

    next(); 
};

export { checkJwtTransaction };