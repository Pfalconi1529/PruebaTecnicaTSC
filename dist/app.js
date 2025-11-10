import express from 'express';
import cors from 'cors';
import { router } from './presentation/routes/index.js';
import { notFoundHandler } from './infrastructure/middleware/checkUrlOrHeader.js';
export const app = express();
app.use(cors());
app.use(express.json());
// Aquí cargamos todas las rutas
app.use('/devOps', router); // Asegúrate de que tu router tenga POST/GET '/'
app.use(notFoundHandler); // middleware para 404
console.log('✅ Rutas cargadas correctamente para tests');
//# sourceMappingURL=app.js.map