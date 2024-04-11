import { RequestContextProvider, RequestContext } from "./requestContext.types";
import { createNamespace } from "cls-hooked";
import { NextFunction, Request, Response } from "express";

class AsyncHooksRequestContextProvider implements RequestContextProvider {
  private static instance: AsyncHooksRequestContextProvider;
  private contextName: string = "requestContext";
  private asyncLocalStorage = createNamespace("requestContextMiddleware");
  static getInstance(): AsyncHooksRequestContextProvider {
    if (!AsyncHooksRequestContextProvider.instance) {
      AsyncHooksRequestContextProvider.instance =
        new AsyncHooksRequestContextProvider();
    }
    return AsyncHooksRequestContextProvider.instance;
  }
  setAndContinueMiddlewareChain(
    req: Request,
    res: Response,
    nextFunction: NextFunction,
    context: RequestContext
  ) {
    this.asyncLocalStorage.bindEmitter(req);
    this.asyncLocalStorage.bindEmitter(res);
    this.asyncLocalStorage.run(() => {
      this.asyncLocalStorage.set(this.contextName, context);
      nextFunction();
    });
  }

  get(): RequestContext {
    return <RequestContext>this.asyncLocalStorage.get(this.contextName);
  }
}

export { AsyncHooksRequestContextProvider };