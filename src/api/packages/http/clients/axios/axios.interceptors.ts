import { AxiosError, AxiosResponse } from "axios";
import { HttpClientResponse } from "../clients.types.ts";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "@packages-be/errors";

const wrapAxiosErrorsInterceptor = {
  onFulfilled: (response: AxiosResponse<any, any>): HttpClientResponse => ({
    originalUrl: response.config.url ?? "unknown",
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers as any,
    config: response.config,
  }),
  onRejected: (error: AxiosError) => {
    if (error.status === 400) {
      return Promise.reject(new BadRequestError({message: error.message, details: ''}));
    } else if (error.status === 404) {
      return Promise.reject(new NotFoundError({message: error.message, details: ''}));
    } else if (error.status === 401) {
      return Promise.reject(new UnauthorizedError({message: error.message, details: ''}));
    } else if (error.status === 403) {
      return Promise.reject(new ForbiddenError({message: error.message, details: ''}));
    } else {
      // This will become the new UnknownError made by Max
      return Promise.reject(new InternalServerError({message: error.message, details: ''}));
    }
  },
};

export { wrapAxiosErrorsInterceptor };
