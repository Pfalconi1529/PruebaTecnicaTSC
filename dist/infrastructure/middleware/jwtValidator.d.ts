import type { Request, Response, NextFunction } from 'express';
interface RequestWithTransaction extends Request {
    transactionId?: string;
}
declare const checkJwtTransaction: (req: RequestWithTransaction, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export { checkJwtTransaction };
//# sourceMappingURL=jwtValidator.d.ts.map