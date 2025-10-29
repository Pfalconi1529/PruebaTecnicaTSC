import type { Request, Response, NextFunction } from 'express';
declare const checkHttpMethod: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export { checkHttpMethod };
//# sourceMappingURL=methodValidator.d.ts.map