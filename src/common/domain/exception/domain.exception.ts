interface DomainExceptionOptions {
  message: string;
  errorCode: string;
  statusCode: number;
}

export class DomainException extends Error {
  readonly errorCode: string;
  readonly statusCode: number;

  constructor(options: DomainExceptionOptions) {
    super(options.message);
    this.name = this.constructor.name;
    this.errorCode = options.errorCode;
    this.statusCode = options.statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
