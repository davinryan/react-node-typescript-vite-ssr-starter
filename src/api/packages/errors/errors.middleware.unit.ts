import {
  makeErrorHandlerMiddleware,
  withErrorHandlerSupport,
} from "./errors.middleware";
import { Request, Response } from "express";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./errors";
import {vitest} from 'vitest'

class MockResponse {
  statusValue?: string;
  contentTypeValue?: string;
  sendValue?: string;

  status(statusCode: string) {
    this.statusValue = statusCode;
    return this;
  }

  contentType(type: string) {
    this.contentTypeValue = type;
    return this;
  }

  send(value: string) {
    this.sendValue = value;
    return this;
  }
  json(value: object) {
    this.contentTypeValue = "application/json";
    this.sendValue = JSON.stringify(value);
    return this;
  }
}

describe("Errors Middleware Test Suite", () => {
  it("should provide higher order function to ensure errors are caught and sent to express middleware error handler", async () => {
    // Assemble
    const mockAsyncError = new Error("Asynchronous BOOOM...");
    const mockAsyncControllerThatThrowsError = async (): Promise<void> => {
      throw mockAsyncError;
    };
    const errorAwareMockAsyncControllerThatThrowsError =
      withErrorHandlerSupport(mockAsyncControllerThatThrowsError);
    const mockSyncError = new Error("Synchronous BOOOM...");
    const mockSyncControllerThatThrowsError = () => {
      throw mockSyncError;
    };
    const errorAwareMockSyncControllerThatThrowsError = withErrorHandlerSupport(
      mockSyncControllerThatThrowsError
    );

    const mockSyncNext = vitest.fn() as any;
    const mockAsyncNext = vitest.fn() as any;
    const mockRequest = {} as Request;
    const mockResponse = {} as Response;

    // Act
    try {
      await errorAwareMockSyncControllerThatThrowsError(
        mockRequest,
        mockResponse,
        mockSyncNext
      );
      await errorAwareMockAsyncControllerThatThrowsError(
        mockRequest,
        mockResponse,
        mockAsyncNext
      );
    } catch (error) {
      throw Error("Shouldn't have thrown an error but used express.next");
    }

    // Assert
    expect(mockSyncNext).toHaveBeenCalledWith(mockSyncError);
    expect(mockAsyncNext).toHaveBeenCalledWith(mockAsyncError);
  });

  it("middleware handles all error cases correctly", () => {
    // Assemble
    const errorOptions = { message: "some message", details: "some details" };
    const badRequestError = new BadRequestError(errorOptions);
    const notFoundError = new NotFoundError(errorOptions);
    const unauthorisedError = new UnauthorizedError(errorOptions);
    const internalError = new InternalServerError(errorOptions);
    const forbiddenError = new ForbiddenError(errorOptions);
    const validationError = new ValidationError(errorOptions);
    const unknownError = new Error("some message");

    const mockNext = vitest.fn() as any;
    const mockLogger = { error: vitest.fn() } as any;
    const mockRequest = { header: vitest.fn() } as any;
    const errorMiddleware = makeErrorHandlerMiddleware(mockLogger);

    // Act/Assert - BadRequest
    const mockBadRequestResponse = new MockResponse() as any;
    errorMiddleware(
      badRequestError,
      mockRequest,
      mockBadRequestResponse,
      mockNext
    );
    expect(mockBadRequestResponse.statusValue).toEqual(400);
    expect(mockBadRequestResponse.contentTypeValue).toEqual("application/json");
    expect(mockBadRequestResponse.sendValue).toEqual(
      JSON.stringify({
        error: {
          statusCode: 400,
          name: "BadRequestError",
          message: "some message",
          details: "some details",
        },
      })
    );

    // Act/Assert - NotFound
    const mockNotFoundResponse = new MockResponse() as any;
    errorMiddleware(notFoundError, mockRequest, mockNotFoundResponse, mockNext);
    expect(mockNotFoundResponse.statusValue).toEqual(404);
    expect(mockNotFoundResponse.contentTypeValue).toEqual("application/json");
    expect(mockNotFoundResponse.sendValue).toEqual(
      JSON.stringify({
        error: {
          statusCode: 404,
          name: "NotFoundError",
          message: "some message",
          details: "some details",
        },
      })
    );

    // Act/Assert - Unauthorized
    const mockUnauthorisedErrorResponse = new MockResponse() as any;
    errorMiddleware(
      unauthorisedError,
      mockRequest,
      mockUnauthorisedErrorResponse,
      mockNext
    );
    expect(mockUnauthorisedErrorResponse.statusValue).toEqual(401);
    expect(mockUnauthorisedErrorResponse.contentTypeValue).toEqual(
      "application/json"
    );
    expect(mockUnauthorisedErrorResponse.sendValue).toEqual(
      JSON.stringify({
        error: {
          statusCode: 401,
          name: "UnauthorizedError",
          message: "some message",
          details: "some details",
        },
      })
    );

    // Act/Assert - Internal Server Error
    const mockInternalErrorResponse = new MockResponse() as any;
    errorMiddleware(
      internalError,
      mockRequest,
      mockInternalErrorResponse,
      mockNext
    );
    expect(mockInternalErrorResponse.statusValue).toEqual(500);
    expect(mockInternalErrorResponse.contentTypeValue).toEqual(
      "application/json"
    );
    expect(mockInternalErrorResponse.sendValue).toEqual(
      JSON.stringify({
        error: {
          statusCode: 500,
          name: "InternalServerError",
          message: "some message",
          details: "some details",
        },
      })
    );

    // Act/Assert - Forbidden
    const mockForbiddenErrorResponse = new MockResponse() as any;
    errorMiddleware(
      forbiddenError,
      mockRequest,
      mockForbiddenErrorResponse,
      mockNext
    );
    expect(mockForbiddenErrorResponse.statusValue).toEqual(403);
    expect(mockForbiddenErrorResponse.contentTypeValue).toEqual(
      "application/json"
    );
    expect(mockForbiddenErrorResponse.sendValue).toEqual(
      JSON.stringify({
        error: {
          statusCode: 403,
          name: "ForbiddenError",
          message: "some message",
          details: "some details",
        },
      })
    );

    // Act/Assert - ValidationError
    const mockValidationErrorResponse = new MockResponse() as any;
    errorMiddleware(
      validationError,
      mockRequest,
      mockValidationErrorResponse,
      mockNext
    );
    expect(mockValidationErrorResponse.statusValue).toEqual(400);
    expect(mockValidationErrorResponse.contentTypeValue).toEqual(
      "application/json"
    );
    expect(mockValidationErrorResponse.sendValue).toEqual(
      JSON.stringify({
        error: {
          statusCode: 400,
          name: "ValidationError",
          message: "some message",
          details: "some details",
        },
      })
    );

    // Act/Assert - UnknownError
    const mockUnknownErrorResponse = new MockResponse() as any;
    errorMiddleware(
      unknownError,
      mockRequest,
      mockUnknownErrorResponse,
      mockNext
    );
    expect(mockUnknownErrorResponse.statusValue).toEqual(520);
    expect(mockUnknownErrorResponse.contentTypeValue).toEqual(
      "application/json"
    );
    expect(mockUnknownErrorResponse.sendValue).toEqual(
      JSON.stringify({
        error: {
          statusCode: 520,
          name: "UnknownError",
          message: "Error",
          details: "some message",
        },
      })
    );
  });
});