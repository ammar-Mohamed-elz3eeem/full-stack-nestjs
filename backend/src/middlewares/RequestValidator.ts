import { NextFunction, Request, Response } from 'express';
import { BaseMiddleware } from './BaseMiddleware';
import { ZodType } from 'zod';
import { Injectable } from '@nestjs/common';
// import { ServiceError } from '../error/ServiceError';

@Injectable()
export class RequestValidator extends BaseMiddleware {
  constructor(private readonly schema: ZodType) {
    super();
  }

  public async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    // try {
    //   await this.schema.parseAsync(req.body);
    //   next();
    // } catch (error) {
    //   res.status(400).json({
    //     message: 'Invalid request data',
    //     errors: error.,
    //   });
    // }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const bodyToValidate: any = req.method === 'GET' ? req.query : req.body;

    const parsedBody = await this.schema.safeParseAsync(bodyToValidate);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: 'Invalid request data',
        errors: parsedBody.error.issues[0].message,
      });
    }

    next();
  }

  public static with(
    schema: ZodType,
  ): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return new RequestValidator(schema).use;
  }
}
