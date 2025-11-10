import type { Application } from 'express';
import express from 'express';
import cors from 'cors';
import { router } from './presentation/routes/index.js';
import { notFoundHandler } from './infrastructure/middleware/checkUrlOrHeader.js';
export const app: Application = express(); 

app.use(cors());
app.use(express.json());
app.use(router);
app.use(notFoundHandler);
