// manejo de errores
const handleHttp = (res, error) => {
    res.status(500);
    res.send({
        error: error.message,
    });
};
export { handleHttp };
//# sourceMappingURL=utils.js.map