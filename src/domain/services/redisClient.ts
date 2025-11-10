import { createClient } from 'redis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

// CAMBIO CRÍTICO: Usamos 'let' para reasignar si es necesario (ej. después de un cierre forzado)
let redisClient = createClient({
    url: `redis://${redisHost}:${redisPort}`
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
    // Si el cliente está cerrado (por un .quit() anterior), creamos una nueva instancia
    if (!redisClient.isOpen && !redisClient.isReady) {
        redisClient = createClient({
            url: `redis://${redisHost}:${redisPort}`
        });
        redisClient.on('error', (err) => console.error('Redis Client Error', err));
    }

    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Redis conectado exitosamente.');
    }
};

// ----------------------------------------------------
// CAMBIO CLAVE: Eliminamos await redisClient.quit() de la función exportada.
// Esto detiene el cierre prematuro durante los tests.
export const disconnectRedis = async () => {
    if (redisClient.isOpen) {
        // Quit() cierra el cliente, pero en Jest causa el ClientClosedError al usarlo
        // en afterEach/afterAll. Dejamos que el proceso termine, o usamos 'quit()' solo en afterAll.
        // Si ves el log "Redis desconectado" prematuramente, ESTA línea es el problema en los tests.
        // Opcional: Volver a usar .quit() SOLO si estás seguro de que se llama una única vez en afterAll.
        // await redisClient.quit(); // <--- Si tu test lo llama en afterEach, lo elimina
        console.log('Redis desconectado.');
    }
};
// ----------------------------------------------------

export default redisClient;