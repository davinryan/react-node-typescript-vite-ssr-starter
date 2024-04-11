import { NextFunction, Request, Response } from "express";

/**
 * Interface for context provider used for setting and continuing middleware chain and getting current request context.
 */
export interface RequestContextProvider {
  setAndContinueMiddlewareChain(
    req: Request,
    res: Response,
    nextFunction: NextFunction,
    context: RequestContext
  ): void;
  get(): RequestContext;
}

export type RequestContext = {
  originalUrl: string;
  headers: { [key: string]: any };
  query: { [key: string]: any };
  params: { [key: string]: any };
};