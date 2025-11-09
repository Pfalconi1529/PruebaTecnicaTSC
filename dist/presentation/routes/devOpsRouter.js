//devOpsRouter.ts
import { Router } from "express";
import { postMessage } from "../controllers/DevOpsController.js";
import { checkHttpMethod } from "../../infrastructure/middleware/methodValidator.js";
import { checkApiKey } from "../../infrastructure/middleware/apiKeyValidator.js";
import { checkJwtTransaction } from "../../infrastructure/middleware/jwtValidator.js";
const router = Router();
router.post("/devOps", checkJwtTransaction, checkHttpMethod, checkApiKey, postMessage);
export { router };
//# sourceMappingURL=devOpsRouter.js.map