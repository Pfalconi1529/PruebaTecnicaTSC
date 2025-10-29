import { Router } from "express";
import { postMessage } from "../controllers/DevOpsController.ts";
import { checkHttpMethod } from "../../infrastructure/middleware/methodValidator.ts";
import { checkApiKey } from "../../infrastructure/middleware/apiKeyValidator.ts";
import { checkJwtTransaction } from "../../infrastructure/middleware/jwtValidator.ts";


const router = Router();

router.post(
  "/devOps", checkJwtTransaction, checkHttpMethod, checkApiKey, postMessage
);

export { router };
