/**
 * Genera un JWT único con un JTI (UUID) para el seguimiento de la blacklist de Redis.
 * @param timeToLifeSec - Tiempo de vida del token en segundos (opcional, por defecto 60).
 */
export declare const generateUniqueTransactionJwt: (timeToLifeSec?: number) => string;
//# sourceMappingURL=jwtGenerator.d.ts.map