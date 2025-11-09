// src/server.ts (Punto de entrada para el inicio)

import * as dotenv from 'dotenv';
import { app } from './app.js'; // Importa la aplicación
import { ENVIRONMENT } from './infrastructure/context/envVariables.js'; // Importa tus variables de entorno

dotenv.config();

// Usamos el mismo puerto definido en el .env
const PORT: number = parseInt(process.env.APP_PORT || "3001"); 

console.log(`[${ENVIRONMENT.toUpperCase()}] Servidor iniciando...`);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});