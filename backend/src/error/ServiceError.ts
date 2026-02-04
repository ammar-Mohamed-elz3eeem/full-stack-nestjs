export class ServiceError extends Error {
  public readonly isOperational: boolean;
  public readonly comingFrom: string;

  constructor(message: string, comingFrom: string, isOperational = true) {
    super(message);
    this.isOperational = isOperational;
    this.comingFrom = comingFrom;
    this.name = 'ServiceError';
  }

  public static fromError(
    error: Error,
    comingFrom: string,
    isOperational = false,
  ): ServiceError {
    const serviceError = new ServiceError(
      error.message,
      comingFrom,
      isOperational,
    );
    serviceError.stack = error.stack;
    return serviceError;
  }

  toString(): string {
    return `${this.name}: ${this.message} (coming from: ${this.comingFrom})`;
  }
}
