import { Router } from 'express';
import { checkApiKey } from '../../infrastructure/middleware/apiKeyValidator.js';
import { checkJwtTransaction } from '../../infrastructure/middleware/jwtValidator.js';
import { checkHttpMethod } from '../../infrastructure/middleware/methodValidator.js';
import { postMessage } from '../controllers/DevOpsController.js';


const router = Router();

router.post(
  '/devOps',
  checkHttpMethod,
  checkApiKey,
  checkJwtTransaction,
  postMessage
);


export { router };
