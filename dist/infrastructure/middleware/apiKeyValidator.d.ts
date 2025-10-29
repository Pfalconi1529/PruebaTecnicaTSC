import type { Request, Response, NextFunction } from 'express';
declare const checkApiKey: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export { checkApiKey };
//# sourceMappingURL=apiKeyValidator.d.ts.map