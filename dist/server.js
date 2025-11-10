// src/server.ts (Punto de entrada para el inicio)
import * as dotenv from 'dotenv';
import { app } from './app.js'; // Importa la aplicación
import { ENVIRONMENT } from './infrastructure/context/envVariables.js'; // Importa tus variables de entorno
import { connectRedis } from './domain/services/redisClient.js';
dotenv.config();
// Usamos el mismo puerto definido en el .env
const PORT = parseInt(process.env.APP_PORT || '3001');
console.log(`[${ENVIRONMENT.toUpperCase()}] Servidor iniciando...`);
// Definimos una función asíncrona para manejar el inicio
const startServer = async () => {
    try {
        // 1. Conectar a Redis antes de iniciar el servidor
        await connectRedis();
        // 2. Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    }
    catch (error) {
        // Manejo de errores si Redis falla o la aplicación no puede iniciar
        console.error("❌ Error fatal al iniciar la aplicación (Redis o Express):", error);
        process.exit(1);
    }
};
startServer(); // 👈 Llamamos a la función para arrancar el proceso
//# sourceMappingURL=server.js.map