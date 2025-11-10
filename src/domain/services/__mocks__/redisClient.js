// src/domain/services/__mocks__/redisClient.js

import { jest } from '@jest/globals';

// Mocks de las funciones de datos
export const get = jest.fn().mockResolvedValue(null);
export const set = jest.fn().mockResolvedValue('OK');

// Mocks de las funciones de conexión (no hacen nada)
export const connectRedis = jest.fn().mockResolvedValue(undefined);
export const disconnectRedis = jest.fn().mockResolvedValue(undefined);