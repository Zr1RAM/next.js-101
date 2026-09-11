import { NextResponse } from "next/server";

/**
 * Base custom error class for all API errors.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(
    message: string = "An unexpected error occurred",
    statusCode: number = 500,
    code: string = "INTERNAL_SERVER_ERROR"
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * 400 Bad Request error.
 */
export class BadRequestError extends ApiError {
  constructor(message: string = "Bad request", code: string = "BAD_REQUEST") {
    super(message, 400, code);
  }
}

/**
 * 401 Unauthorized error.
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized", code: string = "UNAUTHORIZED") {
    super(message, 401, code);
  }
}

/**
 * 403 Forbidden error.
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden", code: string = "FORBIDDEN") {
    super(message, 403, code);
  }
}

/**
 * 404 Not Found error.
 */
export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found", code: string = "NOT_FOUND") {
    super(message, 404, code);
  }
}

/**
 * 500 Internal Server Error.
 */
export class InternalServerError extends ApiError {
  constructor(
    message: string = "Internal server error",
    code: string = "INTERNAL_SERVER_ERROR"
  ) {
    super(message, 500, code);
  }
}

export type RouteHandler<TContext = unknown> = (
  request: Request,
  context: TContext
) => Promise<Response | NextResponse | void> | Response | NextResponse | void;

/**
 * Higher-order function to wrap route handlers with production-grade error handling.
 * Automatically catches custom ApiError instances, known service errors, and unexpected exceptions,
 * converting them into standardized JSON error responses:
 * { success: false, error: { code: string, message: string } }
 */
export function withErrorHandler<TContext = unknown>(
  handler: RouteHandler<TContext>
) {
  return async (request: Request, context: TContext): Promise<Response> => {
    try {
      const response = await handler(request, context);
      if (response instanceof Response) {
        return response;
      }
      return NextResponse.json({ success: true, data: response ?? null }, { status: 200 });
    } catch (error: unknown) {
      // 1. Handled custom ApiError instances (or duck-typed ApiErrors)
      if (
        error instanceof ApiError ||
        (error &&
          typeof error === "object" &&
          "statusCode" in error &&
          "code" in error &&
          "message" in error)
      ) {
        const apiErr = error as ApiError;
        return NextResponse.json(
          {
            success: false,
            error: {
              code: apiErr.code,
              message: apiErr.message,
            },
          },
          { status: apiErr.statusCode }
        );
      }

      // 2. Handled service-layer errors (e.g. ValidationError, NotFoundError, ForbiddenError)
      if (error && typeof error === "object" && "name" in error) {
        const namedErr = error as { name: string; message: string };
        if (namedErr.name === "ValidationError") {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "BAD_REQUEST",
                message: namedErr.message || "Validation failed",
              },
            },
            { status: 400 }
          );
        }
        if (namedErr.name === "NotFoundError") {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "NOT_FOUND",
                message: namedErr.message || "Resource not found",
              },
            },
            { status: 404 }
          );
        }
        if (namedErr.name === "ForbiddenError") {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "FORBIDDEN",
                message: namedErr.message || "Access denied",
              },
            },
            { status: 403 }
          );
        }
      }

      // 3. Fallback for unexpected internal errors
      console.error("[withErrorHandler] Uncaught error:", error);
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message,
          },
        },
        { status: 500 }
      );
    }
  };
}
