import { responseMessage } from "../../domain/services/devOpsService.js";
const postMessage = async ({ body }, res) => {
    try {
        const dataMessage = responseMessage(body);
        res.status(200).send(dataMessage);
    }
    catch (error) {
        // Delegar el error a la función de manejo HTTP
        //handleHttp(res, error as Error);
    }
};
export { postMessage };
//# sourceMappingURL=DevOpsController.js.map