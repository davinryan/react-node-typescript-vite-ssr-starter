/* eslint-disable @typescript-eslint/no-explicit-any */
export type ErrorPayloadOptions = {
  message: string;
  details: string | null;
};

type ErrorOptions = {
  statusCode: number;
  name: string;
  payload: ErrorPayloadOptions;
};

type HttpErrorResponse = {
  error: Pick<ErrorOptions, 'statusCode' | 'name'> & ErrorPayloadOptions;
};

export abstract class BaseError extends Error {
  private readonly options: ErrorOptions
  readonly status: number;

  constructor(options: ErrorOptions) {
    super()
    this.name = options.name
    this.options = options
    this.status = options.statusCode
  }

  toLog(): ErrorOptions {
    return this.options
  }

  toHttpResponse(): HttpErrorResponse {
    const {statusCode, payload} = this.options
    return {
      error: {
        statusCode,
        name: this.name,
        ...payload,
      },
    }
  }
}