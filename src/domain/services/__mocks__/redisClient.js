// src/domain/services/__mocks__/redisClient.js
import { jest } from '@jest/globals';

// Define las funciones mockeadas
export const get = jest.fn().mockResolvedValue(null); 
export const set = jest.fn().mockResolvedValue('OK'); 

// Incluye las funciones de conexión
// Las tiparemos en el archivo de prueba si es necesario (para TS)
export const connectRedis = jest.fn().mockResolvedValue(true); // <--- Corregido para devolver Promise<true>
export const disconnectRedis = jest.fn().mockResolvedValue(undefined); // <--- Corregido

// Asegura la compatibilidad con ES Modules
export const __esModule = true;