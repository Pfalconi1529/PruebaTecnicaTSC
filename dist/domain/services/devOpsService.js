// src/domain/services/devOpsService.ts
const responseMessage = (body) => {
    const { to } = body;
    let res;
    if (!body || !to) {
        res = "Estimado usuario faltan campos por llenar.";
    }
    else {
        res = `Hola ${to}, tu mensaje será enviado`;
    }
    return { message: res };
};
export { responseMessage };
//# sourceMappingURL=devOpsService.js.map