import { generateUniqueTransactionJwt } from "../../infrastructure/utils/jwtGenerator.js";
import { isUsed, markAsUsed } from "../../infrastructure/cache/jwtCache.js";
import { ERR_MISSING_FIELDS, SUCCESS_GREETING, SUCCESS_SUFFIX, TOKEN_DUPLICATE } from "../../infrastructure/context/envVariables.js";
// logica para el mensaje y las validaciones
const responseMessage = (payload, transactionId) => {
    if (transactionId) {
        if (isUsed(transactionId)) {
            return {
                message: TOKEN_DUPLICATE,
            };
        }
    }
    const { to } = payload;
    if (!payload || !to) {
        return { message: ERR_MISSING_FIELDS };
    }
    if (transactionId) {
        markAsUsed(transactionId);
    }
    const newToken = generateUniqueTransactionJwt();
    const successMessage = `${SUCCESS_GREETING}${to}${SUCCESS_SUFFIX}`;
    return {
        message: successMessage,
        newJwt: newToken
    };
};
export { responseMessage };
//# sourceMappingURL=devOpsService.js.map