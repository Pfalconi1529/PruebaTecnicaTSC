/**
 * todo: Manejador de rutas
 */
import { Router } from "express";
import { readdirSync } from "fs"
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const PATH_ROUTER = path.join(path.dirname(__filename));
const router = Router();

const cleanFileName = (fileName: string) => {
    const file = fileName.split(".").shift()
    return file;
}

// src/presentation/routes/index.ts (SOLUCIÓN FINAL)

readdirSync(PATH_ROUTER).filter((fileName) => {
    const cleanName = cleanFileName(fileName);
  
    
    if(cleanName !== "index"){
        import(`./${cleanName}.ts`).then((moduleRouter) => {
            router.use(`/${cleanName}`, moduleRouter.router)
        })
        .catch(error => {
            console.error(`Error al cargar la ruta ${cleanName}:`, error.message);
        });
    }
});

export { router };