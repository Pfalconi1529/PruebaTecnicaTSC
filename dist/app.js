import * as dotenv from 'dotenv';
import express from 'express';
import cors from "cors";
import { router } from './presentation/routes/index.js';
import { notFoundHandler } from './infrastructure/middleware/checkUrlOrHeader.js';
dotenv.config();
const PORT = parseInt(process.env.APP_PORT || "3001");
const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use(notFoundHandler);
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map