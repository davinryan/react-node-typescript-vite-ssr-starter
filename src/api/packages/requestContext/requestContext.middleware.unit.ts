import {vitest} from 'vitest'

const mockRequestContextInit = vitest.fn();
const mockContextProvider = {
  setAndContinueMiddlewareChain: mockRequestContextInit,
} as any;
vitest.mock("./requestContext.asyncHooks", () => ({
  AsyncHooksRequestContextProvider: { getInstance: () => mockContextProvider },
}));
import { makeRequestContextMiddleware } from "./requestContext.middleware";
import { Response } from "express";

const mockNextFunction = vitest.fn() as any;
const mockRequest = {
  originalUrl: "originalUrl",
  headers: { header1: "header1", header2: "header2" },
  query: { query1: "query1", query2: "query2" },
  params: { param1: "param1", param2: "param2" },
} as any;
const mockResponse = {} as Response;

describe("Request Context middleware test suite", () => {
  beforeEach(() => {
    vitest.resetAllMocks();
  });

  it("should default to using the AsyncHooksRequestContextProvider", () => {
    // Assemble
    const requestContextMiddleware = makeRequestContextMiddleware();

    // Act
    requestContextMiddleware(mockRequest, mockResponse, mockNextFunction);

    // Assert
    expect(mockRequestContextInit.mock.calls[0][3]).toEqual(mockRequest);
  });

  it("should be able to override the default contextProvider", () => {
    // Assemble
    const mockRequestContextInitOverride = vitest.fn();
    const mockContextProviderOverride = {
      setAndContinueMiddlewareChain: mockRequestContextInitOverride,
    } as any;
    const requestContextMiddleware = makeRequestContextMiddleware(
      mockContextProviderOverride
    );

    // Act
    requestContextMiddleware(mockRequest, mockResponse, mockNextFunction);

    // Assert
    expect(mockRequestContextInitOverride.mock.calls[0][3]).toEqual(
      mockRequest
    );
  });
});