// src/domain/services/__mocks__/redisClient.js
import { jest } from '@jest/globals';

// Define las funciones mockeadas
export const get = jest.fn().mockResolvedValue(null); 
export const set = jest.fn().mockResolvedValue('OK'); 

export const connectRedis = jest.fn().mockResolvedValue(true); 
export const disconnectRedis = jest.fn().mockResolvedValue(undefined); 

export const __esModule = true;