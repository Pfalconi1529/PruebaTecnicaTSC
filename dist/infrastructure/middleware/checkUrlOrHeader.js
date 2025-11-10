//verifica la url para que no pase otras rutas
const notFoundHandler = (req, res) => {
    return res.status(404).send({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method,
        message: `La ruta solicitada ${req.method} ${req.originalUrl} no está definida.`,
    });
};
export { notFoundHandler };
//# sourceMappingURL=checkUrlOrHeader.js.map