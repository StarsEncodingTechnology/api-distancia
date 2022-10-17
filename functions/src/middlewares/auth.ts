import { NextFunction, Request, Response } from 'express';
import Authservice from '@src/services/auth';

// faz o test do token
export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  const token = req.headers?.['x-acess-token'];
  // captura o token no header
  try {
    const decoded = Authservice.decodeToken(token as string);
    // decoda o token
    req.decoded = decoded;
    // adiciona os dados no decoded
    next();
} catch (err) {
    res.status?.(401).send({
        code: 401, error: (err as Error).message
    })
  }
}