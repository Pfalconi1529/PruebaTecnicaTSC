import type { Request, Response, NextFunction } from 'express';
declare const checkJwtTransaction: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export { checkJwtTransaction };
//# sourceMappingURL=jwtValidator.d.ts.map