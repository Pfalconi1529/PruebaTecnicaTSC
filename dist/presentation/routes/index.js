/**
 * todo: Manejador de rutas
 */
import { Router } from "express";
import { readdirSync } from "fs";
const PATH_ROUTER = `${__dirname}`;
const router = Router();
const cleanFileName = (fileName) => {
    const file = fileName.split(".").shift();
    return file;
};
readdirSync(PATH_ROUTER).filter((fileName) => {
    const cleanName = cleanFileName(fileName);
    if (cleanName !== "index") {
        import(`./${cleanName}`).then((moduleRouter) => {
            router.use(`/${cleanName}`, moduleRouter.router);
        });
    }
});
export { router };
//# sourceMappingURL=index.js.map