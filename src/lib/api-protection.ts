import { NextRequest, NextResponse } from "next/server";
import {
  checkApiRateLimit,
  checkLetterRateLimit,
  isSuspiciousRequest,
  getSecurityHeaders,
  logSecurityEvent,
  sanitizeInput,
} from "./security";

// API protection wrapper
export function withApiProtection(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    isWriteOperation?: boolean;
    requireAuth?: boolean;
    maxBodySize?: number;
    isLetterSubmission?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Check for suspicious patterns
      if (isSuspiciousRequest(request)) {
        logSecurityEvent(
          "Suspicious request blocked",
          {
            reason: "Suspicious patterns detected",
            url: request.url,
          },
          request
        );

        return new NextResponse("Access Denied", {
          status: 403,
          headers: getSecurityHeaders(),
        });
      }

      // Check rate limiting - use letter-specific rate limiting for letter submissions
      const rateLimitResult = options.isLetterSubmission
        ? checkLetterRateLimit(request)
        : checkApiRateLimit(request, options.isWriteOperation);

      if (!rateLimitResult.allowed) {
        logSecurityEvent(
          "Rate limit exceeded",
          {
            reason: options.isLetterSubmission
              ? "Too many letter submissions"
              : "Too many requests",
            remaining: rateLimitResult.remaining,
            resetTime: rateLimitResult.resetTime,
          },
          request
        );

        const limitMessage = options.isLetterSubmission
          ? "You can only submit 3 letters per 15 minutes. Please wait before submitting another letter."
          : "Too many requests";

        return new NextResponse(limitMessage, {
          status: 429,
          headers: {
            ...getSecurityHeaders(),
            "Retry-After": "900", // 15 minutes
            "X-RateLimit-Limit": options.isLetterSubmission
              ? "3"
              : options.isWriteOperation
              ? "10"
              : "30",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(
              rateLimitResult.resetTime
            ).toISOString(),
          },
        });
      }

      // Check request size
      const contentLength = request.headers.get("content-length");
      if (contentLength && options.maxBodySize) {
        const size = parseInt(contentLength, 10);
        if (size > options.maxBodySize) {
          logSecurityEvent(
            "Request too large",
            {
              reason: "Request body exceeds maximum size",
              size,
              maxSize: options.maxBodySize,
            },
            request
          );

          return new NextResponse("Request Too Large", {
            status: 413,
            headers: getSecurityHeaders(),
          });
        }
      }

      // Add security headers to response
      const response = await handler(request);

      // Add rate limit headers
      response.headers.set(
        "X-RateLimit-Limit",
        options.isLetterSubmission
          ? "3"
          : options.isWriteOperation
          ? "10"
          : "30"
      );
      response.headers.set(
        "X-RateLimit-Remaining",
        rateLimitResult.remaining.toString()
      );
      response.headers.set(
        "X-RateLimit-Reset",
        new Date(rateLimitResult.resetTime).toISOString()
      );

      // Add security headers
      Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      logSecurityEvent(
        "API error",
        {
          reason: "Internal server error",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        request
      );

      return new NextResponse("Internal Server Error", {
        status: 500,
        headers: getSecurityHeaders(),
      });
    }
  };
}

// Request validation helper
export function validateRequest<T>(
  request: NextRequest,
  schema: any,
  options: { sanitize?: boolean } = {}
): { data: T; error?: string } {
  try {
    const body = request.json ? request.json() : {};
    const validatedData = schema.parse(body);

    if (options.sanitize) {
      // Sanitize string fields
      const sanitizedData = { ...validatedData };
      for (const [key, value] of Object.entries(sanitizedData)) {
        if (typeof value === "string") {
          sanitizedData[key] = sanitizeInput(value);
        }
      }
      return { data: sanitizedData as T };
    }

    return { data: validatedData };
  } catch (error) {
    return {
      data: {} as T,
      error: error instanceof Error ? error.message : "Validation failed",
    };
  }
}

// CORS configuration
export function getCorsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin":
      process.env.NODE_ENV === "production"
        ? "https://lostletters.arvie.tech"
        : "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}

// Handle preflight requests
export function handleCors(request: NextRequest): NextResponse | null {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        ...getSecurityHeaders(),
      },
    });
  }
  return null;
}
