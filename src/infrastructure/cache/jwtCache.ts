
const usedTransactionIds = new Set<string>();

const markAsUsed = (jti: string): void => {
    usedTransactionIds.add(jti);
};

const isUsed = (jti: string): boolean => {
    return usedTransactionIds.has(jti);
};

export { markAsUsed, isUsed };