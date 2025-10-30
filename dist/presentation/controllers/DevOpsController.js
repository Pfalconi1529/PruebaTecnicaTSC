// controlador para la respuesta 
import { responseMessage } from "../../domain/services/devOpsService.js";
import { handleHttp } from "../../infrastructure/utils/utils.js";
const postMessage = async (req, res) => {
    try {
        const transactionId = req.transactionId;
        const payload = req.body;
        const responseData = responseMessage(payload, transactionId);
        res.status(200).send(responseData);
    }
    catch (error) {
        handleHttp(res, error);
    }
};
export { postMessage };
//# sourceMappingURL=DevOpsController.js.map