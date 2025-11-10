import type { Request, Response, NextFunction } from 'express';
declare const checkJwtTransaction: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export { checkJwtTransaction };
//# sourceMappingURL=jwtValidator.d.ts.map