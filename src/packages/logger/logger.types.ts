import { RequestHandler } from "express";
import winston from "winston";
interface Logger {
  middleware: () => RequestHandler;
  /* NOTE: only to be used for testing purposes. */
  addTransport: (transport: winston.transport) => void;
  debug: (message: string, extraData?: any) => void;
  info: (message: string, extraData?: any) => void;
  warn: (message: string, extraData?: any) => void;
  error: (error: Error, extraData?: any) => void;
  fatal: (error: Error, extraData?: any) => void;
}

export type { Logger };



