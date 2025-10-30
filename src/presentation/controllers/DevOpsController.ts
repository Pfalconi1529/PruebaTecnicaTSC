// controlador para la respuesta 

import type { Request, Response } from "express";
import { responseMessage } from "../../domain/services/devOpsService.js";
import { handleHttp } from "../../infrastructure/utils/utils.js";



const postMessage = async (req: Request, res: Response) => {
  try {
        const transactionId = (req as any ).transactionId;
        const payload = req.body;
        const responseData = responseMessage(payload, transactionId);
        res.status(200).send(responseData); 
    } catch (error) {
        handleHttp(res, error as Error);
    }
};

export { postMessage };