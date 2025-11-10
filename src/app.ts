// src/app.ts (Refactorizado para ser probado)

import type { Application } from 'express';
import express from 'express';
import cors from 'cors';
// Asumiendo que estas son importaciones de la estructura de tu proyecto:
import { router } from './presentation/routes/index.js';
import { notFoundHandler } from './infrastructure/middleware/checkUrlOrHeader.js';
// import { ENVIRONMENT } from './infrastructure/context/envVariables.js'; // Ya no se necesita aquí

export const app: Application = express(); // <--- CRÍTICO: Exportamos la APP

app.use(cors());
app.use(express.json());
app.use(router);
app.use(notFoundHandler);
