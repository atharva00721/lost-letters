import { NextRequest } from "next/server";
import { z } from "zod";

// Rate limiting store (in production, use Redis)
const apiRateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();

// API Rate limiting configuration
const API_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const API_RATE_LIMIT_MAX_REQUESTS = 30; // 30 API requests per window
const API_RATE_LIMIT_MAX_WRITE_REQUESTS = 10; // 10 write requests per window
const LETTER_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const LETTER_RATE_LIMIT_MAX_REQUESTS = 3; // 3 letters per 15 minutes per IP

// Request validation schemas
export const letterSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content must be less than 5000 characters")
    .refine(
      (val) => !/<script|javascript:|on\w+\s*=/i.test(val),
      "Invalid content detected"
    ),
  author: z
    .string()
    .min(1, "Author is required")
    .max(100, "Author must be less than 100 characters")
    .refine(
      (val) => !/<script|javascript:|on\w+\s*=/i.test(val),
      "Invalid author name"
    ),
  recipient: z
    .string()
    .max(100, "Recipient must be less than 100 characters")
    .optional()
    .refine(
      (val) => !val || !/<script|javascript:|on\w+\s*=/i.test(val),
      "Invalid recipient name"
    ),
});

export const searchSchema = z.object({
  query: z
    .string()
    .max(200, "Search query must be less than 200 characters")
    .refine(
      (val) => !/<script|javascript:|on\w+\s*=/i.test(val),
      "Invalid search query"
    ),
  page: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), "Invalid page number"),
});

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, "")
    .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, "")
    .trim();
}

// Rate limiting for API routes
export function checkApiRateLimit(
  request: NextRequest,
  isWriteOperation: boolean = false
): { allowed: boolean; remaining: number; resetTime: number } {
  const clientIP = getClientIP(request);
  const now = Date.now();
  const key = `${clientIP}:${isWriteOperation ? "write" : "read"}`;
  const maxRequests = isWriteOperation
    ? API_RATE_LIMIT_MAX_WRITE_REQUESTS
    : API_RATE_LIMIT_MAX_REQUESTS;

  const current = apiRateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    apiRateLimitStore.set(key, {
      count: 1,
      resetTime: now + API_RATE_LIMIT_WINDOW,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + API_RATE_LIMIT_WINDOW,
    };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
    };
  }

  current.count++;
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetTime: current.resetTime,
  };
}

// Rate limiting specifically for letter submissions
export function checkLetterRateLimit(request: NextRequest): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const clientIP = getClientIP(request);
  const now = Date.now();
  const key = `${clientIP}:letters`;

  const current = apiRateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    apiRateLimitStore.set(key, {
      count: 1,
      resetTime: now + LETTER_RATE_LIMIT_WINDOW,
    });
    return {
      allowed: true,
      remaining: LETTER_RATE_LIMIT_MAX_REQUESTS - 1,
      resetTime: now + LETTER_RATE_LIMIT_WINDOW,
    };
  }

  if (current.count >= LETTER_RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
    };
  }

  current.count++;
  return {
    allowed: true,
    remaining: LETTER_RATE_LIMIT_MAX_REQUESTS - current.count,
    resetTime: current.resetTime,
  };
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}

// Validate request body
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): T {
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw error;
  }
}

// Check for suspicious patterns in request
export function isSuspiciousRequest(request: NextRequest): boolean {
  const url = request.url;
  const userAgent = request.headers.get("user-agent") || "";
  const contentType = request.headers.get("content-type") || "";

  // Check for common attack patterns
  const suspiciousPatterns = [
    /\.\./, // Directory traversal
    /<script/i, // XSS attempts
    /union\s+select/i, // SQL injection
    /javascript:/i, // JavaScript injection
    /on\w+\s*=/i, // Event handler injection
    /eval\s*\(/i, // Code injection
    /document\.cookie/i, // Cookie manipulation
    /window\.location/i, // Location manipulation
    /base64/i, // Base64 encoding (potential obfuscation)
    /char\s*\(/i, // Character function (SQL injection)
    /exec\s*\(/i, // Execution attempts
    /system\s*\(/i, // System calls
  ];

  // Check URL for suspicious patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      return true;
    }
  }

  // Check User-Agent for suspicious patterns
  const suspiciousUserAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /php/i,
    /go-http/i,
    /okhttp/i,
    /libwww/i,
    /lwp/i,
    /perl/i,
    /ruby/i,
    /scrapy/i,
    /mechanize/i,
    /selenium/i,
    /phantom/i,
    /headless/i,
  ];

  for (const pattern of suspiciousUserAgents) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }

  // Check content type for suspicious patterns
  if (
    contentType.includes("multipart/form-data") &&
    userAgent.includes("curl")
  ) {
    return true;
  }

  return false;
}

// Generate secure response headers
export function getSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
  };
}

// Log security events
export function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  request: NextRequest
): void {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";
  const timestamp = new Date().toISOString();

  console.warn(`[SECURITY] ${event}`, {
    timestamp,
    clientIP,
    userAgent,
    url: request.url,
    method: request.method,
    ...details,
  });
}
