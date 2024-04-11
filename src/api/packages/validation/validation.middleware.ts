import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@packages-be/errors";
const makeValidateRequestHeadersMiddleware =
  (requiredRequestHeaders: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
      requiredRequestHeaders.forEach((requestHeader: string) => {
        if (!req.header(requestHeader)) {
          next(
            new BadRequestError({
              message: "Headers Validation Error",
              details: `Missing header ${requestHeader}`,
            })
          );
        }
      });
      next();
    };

export { makeValidateRequestHeadersMiddleware };