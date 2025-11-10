// src/server.ts 

import * as dotenv from 'dotenv';
import { app } from './app.js';
import { connectRedis, disconnectRedis } from './domain/services/redisClient.js'; 
import { ENVIRONMENT } from './infrastructure/context/envVariables.js'; 

dotenv.config();

const PORT: number = parseInt(process.env.APP_PORT || '3001'); 

console.log(`[${ENVIRONMENT.toUpperCase()}] Servidor iniciando...`);

const startServer = async () => {
    try {
        // 1. CONEXIÓN A REDIS: Obligatorio antes de iniciar el servidor
        await connectRedis(); 

        // 2. Iniciar el servidor Express
        const server = app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });

        // Manejo de cierre (SIGTERM, SIGINT)
        const handleShutdown = async () => {
            console.log('\n🛑 Recibida señal de cierre. Iniciando apagado...');
            await disconnectRedis(); 
            server.close(() => {
                console.log('Servidor Express cerrado.');
                process.exit(0);
            });
        };

        process.on('SIGTERM', handleShutdown);
        process.on('SIGINT', handleShutdown);

    } catch (error) {
        console.error('❌ Error fatal al iniciar la aplicación:', error);
        process.exit(1); 
    }
};

startServer();