// simula cache para identificar los jwt que ya fueron usados
const usedTransactionIds = new Set();
const markAsUsed = (jti) => {
    usedTransactionIds.add(jti);
};
const isUsed = (jti) => {
    return usedTransactionIds.has(jti);
};
export { markAsUsed, isUsed };
//# sourceMappingURL=jwtCache.js.map