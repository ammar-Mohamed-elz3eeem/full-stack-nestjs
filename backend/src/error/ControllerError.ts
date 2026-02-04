import { ServiceError } from './ServiceError';

export class ControllerError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ControllerError';
  }

  public static fromError(error: Error): ControllerError {
    if (error instanceof ServiceError)
      return new ControllerError(error.message, 400);
    return new ControllerError(error.message, 500);
  }
}
