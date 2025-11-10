



import * as dotenv from 'dotenv';
dotenv.config();
import { app } from './app.js';
import { ENVIRONMENT } from './infrastructure/context/envVariables.js'; 



const PORT: number = parseInt(process.env.APP_PORT || '3001'); 

console.log(`[${ENVIRONMENT.toUpperCase()}] Servidor iniciando...`);

const startServer = async () => {
    try {
        const server = app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });

        const handleShutdown = async () => {

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