import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
console.log('✅ MODO TEST: Cargando rutas estáticas');
const routesPath = path.join(__dirname);
for (const file of fs.readdirSync(routesPath)) {
    if (file === 'index.ts' || file === 'index.js' || file.endsWith('.d.ts'))
        continue;
    const fullPath = path.join(routesPath, file);
    if (!/\.(js|ts)$/.test(file))
        continue;
    const cleanName = path.basename(file, path.extname(file));
    try {
        const moduleURL = pathToFileURL(fullPath).href;
        const moduleRouter = await import(moduleURL);
        const route = moduleRouter.router ||
            moduleRouter.default ||
            moduleRouter[cleanName] ||
            Object.values(moduleRouter).find((exp) => exp?.use);
        if (!route) {
            console.warn(`⚠️ El módulo ${cleanName} no exporta un router válido.`);
            continue;
        }
        router.use(`/${cleanName}`, route);
        console.log(`✅ Ruta cargada: /${cleanName}`);
    }
    catch (error) {
        console.error(`❌ Error al cargar la ruta ${cleanName}:`, error.message);
    }
}
export { router };
//# sourceMappingURL=index.js.map