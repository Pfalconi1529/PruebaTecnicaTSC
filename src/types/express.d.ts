// src/types/express.d.ts

// Extiende el namespace de 'express' para agregar propiedades a Request y tipar el Body
declare namespace Express {
    // 1. Extiende la interfaz Request para incluir la propiedad inyectada por el middleware
    export interface Request {
        transactionId?: string; 
    }

    // 2. Define la interfaz del Body (payload) para tipar req.body
    export interface RequestBody {
        message: string;
        to: string;
        from: string;
        timeToLifeSec: number;
    }
}