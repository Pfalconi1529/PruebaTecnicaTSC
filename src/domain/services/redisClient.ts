// src/domain/services/redisClient.ts

import { createClient } from 'redis';
import type { RedisClientType } from 'redis'; 

// Usamos las variables definidas por Docker Compose.
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || '6379';
const REDIS_URL = `redis://${REDIS_HOST}:${REDIS_PORT}`;

// 🚨 Inicialización diferida: el cliente es null al inicio.
let redisClient: RedisClientType | null = null; 

export const connectRedis = async (): Promise<void> => {
    if (redisClient) {
        return;
    }

    try {
        redisClient = createClient({
            url: REDIS_URL
        }) as RedisClientType;

        redisClient.on('error', (err) => {
            console.error('Redis Client Error', err);
            redisClient = null; 
        });

        await redisClient.connect();
        console.log(`Redis client connected successfully to ${REDIS_URL}.`);
    } catch (error) {
        console.error(`Failed to connect to Redis at ${REDIS_URL}:`, error);
        if (redisClient) {
            await redisClient.quit();
        }
        redisClient = null; 
        // Relanzamos el error para que server.ts detenga el inicio
        throw error; 
    }
};

export const disconnectRedis = async (): Promise<void> => {
    if (redisClient && redisClient.isOpen) {
        try {
            await redisClient.quit();
            console.log('Redis client disconnected.');
        } catch (error) {
            console.error('Error disconnecting Redis client:', error);
        } finally {
            redisClient = null;
        }
    }
};

/**
 * Obtiene el valor de una clave. Retorna string o null si no existe.
 * 💡 Tipo de retorno corregido a Promise<string | null>.
 */
export const get = (key: string): Promise<string | null> => {
    if (!redisClient || !redisClient.isOpen) {
        throw new Error('ClientClosedError: The client is closed'); 
    }
    return redisClient.get(key); 
};

/**
 * Establece el valor de una clave. Retorna Promise<string> (generalmente 'OK').
 */
export const set = (key: string, value: string, options: { EX: number }): Promise<string> => {
    if (!redisClient || !redisClient.isOpen) {
        throw new Error('ClientClosedError: The client is closed');
    }
    // Aseguramos que solo se devuelva string, ya que Redis devuelve 'OK'
    return redisClient.set(key, value, options) as Promise<string>;
};