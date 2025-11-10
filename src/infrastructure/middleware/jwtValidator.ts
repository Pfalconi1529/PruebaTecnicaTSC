import type { Request, Response, NextFunction } from 'express';
import {
  ERR_MISSING_JWT,
  ERROR_TOKEN,
  HEADER_JWT,
  JWT_TRANSACTION_SECRET,
} from '../context/envVariables.js';
import jwt from 'jsonwebtoken';

interface RequestWithTransaction extends Request {
  transactionId?: string;
}

interface JwtPayload {
  jti: string;
  iat: number;
}

const checkJwtTransaction = (req: RequestWithTransaction, res: Response, next: NextFunction) => {
  const jwtToken = req.header(HEADER_JWT);
  if (!jwtToken) {
    return res.status(403).send({
      message: ERR_MISSING_JWT,
    });
  }

  try {
    const decoded = jwt.verify(jwtToken, JWT_TRANSACTION_SECRET) as JwtPayload;
    req.transactionId = decoded.jti;
  } catch (err) {
    console.error('❌ JWT Verify error:', err);
    return res.status(401).send({ message: ERROR_TOKEN });
  }

  next();
};

export { checkJwtTransaction };
