import { createClient } from 'redis';

// Leer variables de entorno (serán inyectadas por Docker o K8s)
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

const redisClient = createClient({
    url: `redis://${redisHost}:${redisPort}`
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Redis conectado exitosamente.');
    }
};

export default redisClient;