/* eslint-disable @typescript-eslint/unbound-method */
import { NextFunction, Request, Response } from 'express';
import { BaseMiddleware } from './BaseMiddleware';
import { verify as JWTVerify } from 'jsonwebtoken';
import { User } from '@/auth/interfaces/user.interface';

export class AuthMiddleware extends BaseMiddleware {
  constructor(
    private readonly requireAuth: boolean = true,
    private readonly requireSuper: boolean = true,
  ) {
    super();
  }

  public static optionalAuth() {
    return new AuthMiddleware(false, false).use;
  }

  public static requiredAuth() {
    return new AuthMiddleware(true, false).use;
  }

  public static requiredSuperAuth() {
    return new AuthMiddleware(true, true).use;
  }

  public use(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        if (this.requireAuth) {
          res.status(401).json({ message: 'Authorization header missing' });
          return;
        } else {
          next();
          return;
        }
      }

      const token = authHeader?.split(' ')[1];
      if (!token) {
        if (this.requireAuth) {
          res.status(401).json({ message: 'Token missing' });
          return;
        } else {
          next();
          return;
        }
      }

      const decoded = JWTVerify(
        token || '',
        process.env.JWT_SECRET as string,
      ) as User;
      req.user = decoded;

      if (this.requireSuper && decoded.role !== 'admin') {
        res.status(403).json({ message: 'Admin privileges required' });
        return;
      }

      next();
    } catch (error) {
      res.status(401).json({
        message: error instanceof Error ? error.message : 'Unauthorized',
      });
    }
  }
}
