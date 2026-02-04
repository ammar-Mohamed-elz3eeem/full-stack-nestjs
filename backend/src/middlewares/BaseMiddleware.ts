import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export abstract class BaseMiddleware implements NestMiddleware {
  constructor() {
    this.use = this.use.bind(this);
  }

  public abstract use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> | void;
}
