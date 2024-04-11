import { NextFunction, Request, Response } from "express";
import { AsyncHooksRequestContextProvider } from "./requestContext.asyncHooks";
import { RequestContextProvider } from "./requestContext.types";

const getContextProvider = (
  contextProvider: RequestContextProvider | undefined
) =>
  contextProvider
    ? contextProvider
    : AsyncHooksRequestContextProvider.getInstance();

const makeRequestContextMiddleware = (
  customContextProvider?: RequestContextProvider
) => {
  const contextProvider = getContextProvider(customContextProvider);
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      contextProvider.setAndContinueMiddlewareChain(req, res, next, {
        originalUrl: req.originalUrl,
        headers: req.headers,
        query: req.query,
        params: req.params,
      });
    } catch (error) {
      next(error);
    }
  };
};

export { makeRequestContextMiddleware };

