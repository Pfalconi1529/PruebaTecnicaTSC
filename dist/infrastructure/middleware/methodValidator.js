// valida el metodo http que se usa 
import { ERR_GENERIC_METHOD } from '../context/envVariables.js';
const checkHttpMethod = (req, res, next) => {
    if (req.method !== 'POST') {
        return res.status(405).send(ERR_GENERIC_METHOD);
    }
    next();
};
export { checkHttpMethod };
//# sourceMappingURL=methodValidator.js.map