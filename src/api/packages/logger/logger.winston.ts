import winston, { LoggerOptions } from "winston";
import { Logger } from "./logger.types";
import { RequestHandler } from "express";
import { logger as expressWinstonlogger } from "./logger.middleware";

type RequestContext = {
  headers: {
    [key: string]: any;
  };
};

interface RequestContextProvider {
  get(): RequestContext;
}

class WinstonLogger implements Logger {
  private static loggerOptions: LoggerOptions;
  private static logger: winston.Logger;
  private static autoTraceHeaders: {
    [key: string]: any;
  };
  private static level: string;
  private static contextProvider?: RequestContextProvider;
  private readonly location: string;

  /**
   * Configure your logger.
   *
   * @param autoTraceHeaders list of request headers you'd like to log if using requestContext middleware. Object is
   * a key value pair object where the key is the header in your request and the value is the name you would like that
   * header to be called when logged. e.g. {"X-Organisation-Correlation-Id": "correlationId"} will look for the request header
   * 'X-Organisation-Correlation-Id' and log it with the key 'correlationId' for better readability
   * @param level log level. Supported levels are DEBUG, debug, INFO, info, WARN, warn, Error, error
   * @param context IRequestContext is a async-hooks contextProvider aware middleware handler that supports the following interface
   *      type RequestContext = {
   *          headers: { [key: string]: any }; // list of headers we can log
   *      };
   *
   *      interface IRequestContextProvider {
   *          get(): RequestContext; // Get request contextProvider for logging
   *      }
   */
  static configure(
    autoTraceHeaders: { [key: string]: string },
    level: string,
    context?: RequestContextProvider
  ) {
    WinstonLogger.contextProvider = context;
    WinstonLogger.autoTraceHeaders = autoTraceHeaders;
    WinstonLogger.level = level.toLowerCase();
    const { combine, errors, json, timestamp } = winston.format;
    WinstonLogger.loggerOptions = {
      level: WinstonLogger.level,
      transports: [new winston.transports.Console()],
      format: combine(
        errors({ stack: true }),
        timestamp(),
        winston.format((info: winston.Logform.TransformableInfo) => {
          const {
            timestamp,
            level,
            correlationId,
            location,
            message,
            ...rest
          } = info;
          return {
            level,
            timestamp,
            location,
            correlationId,
            message,
            ...rest,
          };
        })(),
        json({ deterministic: false })
      ),
    };
    WinstonLogger.logger = winston.createLogger(WinstonLogger.loggerOptions);
  }

  constructor(location: string) {
    this.location = location;
  }

  private getRequestContext(): {
    [key: string]: string;
  } {
    if (WinstonLogger.contextProvider) {
      const requestContext = WinstonLogger.contextProvider.get();
      if (requestContext) {
        const { headers } = requestContext;
        const logHeaders = {};
        if (Object.keys(WinstonLogger.autoTraceHeaders).length > 0) {
          Object.keys(WinstonLogger.autoTraceHeaders).map((headerName) => {
            // This is important as express's request.headers converts all headers to lowercase
            const headerValue =
              headers[headerName] ?? headers[headerName.toLowerCase()];
            if (headerValue) {
              logHeaders[WinstonLogger.autoTraceHeaders[headerName]] =
                headerValue;
            }
          });
        }
        return { ...logHeaders };
      }
      return {};
    }
    return {};
  }

  /**
   * Provides Express middleware specially designed to log requests and response as a single entry with metrics,
   * requestContext, originalURL and other useful activity information.
   *
   * @param customHeaderBlacklist {@link string[]} You can provide a list of request headers that should not be logged e.g.
   * sensitive security headers. By default, the following headers are already ignored
   *             token,
   *             Token,
   *             Authorisation,
   *             authorisation,
   *             Authorization,
   *             authorization
   */
  public middleware(customHeaderBlacklist?: string[]): RequestHandler {
    const defaultHeaderBlacklist = [
      "token",
      "Token",
      "Authorisation",
      "authorisation",
      "Authorization",
      "authorization",
    ];
    return expressWinstonlogger({
      ...WinstonLogger.loggerOptions,
      baseMeta: { location: this.location },
      expressFormat: true,
      headerBlacklist: customHeaderBlacklist
        ? [...defaultHeaderBlacklist, ...customHeaderBlacklist]
        : defaultHeaderBlacklist,
    });
  }

  /**
   * Only to be used for unit testing purposes so that you can provide you own Winston transport to intercept logging
   * calls.
   * @param transport {@link winston.transport}
   */
  public addTransport(transport: winston.transport) {
    WinstonLogger.logger.add(transport);
  }

  public debug(message: string, meta?: any): void {
    WinstonLogger.logger.debug(
      message,
      { location: this.location, ...meta, ...this.getRequestContext() },
      () => {}
    );
  }

  public info(message: string, meta?: any): void {
    WinstonLogger.logger.info(
      message,
      { location: this.location, ...meta, ...this.getRequestContext() },
      () => {}
    );
  }

  public warn(message: string, meta?: any): void {
    WinstonLogger.logger.warn(
      message,
      { location: this.location, ...meta, ...this.getRequestContext() },
      () => {}
    );
  }

  public error(error: Error, meta?: any): void {
    WinstonLogger.logger.error(error.message, {
      location: this.location,
      ...this.getRequestContext(),
      ...meta,
      stack: error.stack ? error.stack.split("\n") : "No stack available",
    });
  }

  public fatal(error: Error, meta?: any): void {
    WinstonLogger.logger.crit(error.message, {
      location: this.location,
      ...this.getRequestContext(),
      ...meta,
      stack: error.stack ? error.stack.split("\n") : "No stack available",
    });
  }

  public get level() {
    return WinstonLogger.level;
  }
}

export { WinstonLogger }
export type { RequestContext, RequestContextProvider };