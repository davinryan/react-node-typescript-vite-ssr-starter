import TransportStream from "winston-transport";
import {
  RequestContextProvider,
  RequestContext, WinstonLogger,
} from './logger.winston'
import { Logger } from "./logger.types";
import { Request, Response } from "express";

/**
 * Adds a custom transport to allow us to intercept calls to logger.info/debug/error/warn etc...
 * @param requestContext {@link RequestContext}
 * @param autoTraceHeaders {@link {[key: string]: string}}
 * @param assertionFunction {@link (loggedObject: any} => void}
 */
const createUnitTestableLogger = (
  requestContext: RequestContext,
  autoTraceHeaders: { [key: string]: string },
  assertionFunction: (loggedObject: any) => void
): Logger => {
  const contextProvider: RequestContextProvider = {
    get: () => requestContext,
  };
  WinstonLogger.configure(autoTraceHeaders, "INFO", contextProvider);
  const logger: Logger = new WinstonLogger("logger.unitTesting");
  const unitTestingTransport = new TransportStream({
    log: assertionFunction,
  });
  logger.addTransport(unitTestingTransport);
  return logger;
};

describe("Winston logger implementation", () => {
  it("should be able to log standard message with correlation id request header", () => {
    // Assemble
    const correlationId = "12345";
    const expectedLogMessage = "some log message";
    const mockRequestContext: RequestContext = {
      headers: {
        "X-Organisation-Correlation-Id": correlationId,
      },
    };
    const assertionFunction = (loggedObject: any) => {
      // Assert
      expect(loggedObject.message).toEqual(expectedLogMessage);
      expect(loggedObject.correlationId).toEqual(correlationId);
    };
    const logger: Logger = createUnitTestableLogger(
      mockRequestContext,
      { "X-Organisation-Correlation-Id": "correlationId" },
      assertionFunction
    );

    // Act
    logger.info(expectedLogMessage);
  });

  it("should not log sensitive headers like Token and Authorisation as part of middleware", (done) => {
    // Assemble
    const token = "12345";
    const authorisation = "12345";
    const mockRequestContext: RequestContext = {
      headers: {
        token,
        authorisation,
        authorization: authorisation,
        Token: token,
        Authorisation: authorisation,
        Authorization: authorisation,
      },
    };
    const assertionFunction = (loggedObject: any) => {
      // Assert
      expect(loggedObject.token).toBeUndefined();
      expect(loggedObject.Token).toBeUndefined();
      expect(loggedObject.authorisation).toBeUndefined();
      expect(loggedObject.authorization).toBeUndefined();
      expect(loggedObject.Authorisation).toBeUndefined();
      expect(loggedObject.Authorization).toBeUndefined();
    };
    const logger: Logger = createUnitTestableLogger(
      mockRequestContext,
      {
        token: "token",
        Token: "Token",
        authorisation: "authorisation",
        authorization: "authorization",
        Authorisation: "Authorisation",
        Authorization: "Authorization",
      },
      assertionFunction
    );
    const loggerMiddleware = logger.middleware();

    // Act
    loggerMiddleware({} as Request, {} as Response, done as any);
  });
});
