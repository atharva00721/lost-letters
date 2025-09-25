import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const letterRateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per window
const RATE_LIMIT_MAX_API_REQUESTS = 50; // 50 API requests per window

// Suspicious patterns to block
const SUSPICIOUS_PATTERNS = [
  /\.\./, // Directory traversal
  /<script/i, // XSS attempts
  /union\s+select/i, // SQL injection
  /javascript:/i, // JavaScript injection
  /on\w+\s*=/i, // Event handler injection
  /eval\s*\(/i, // Code injection
  /document\.cookie/i, // Cookie manipulation
  /window\.location/i, // Location manipulation
];

// Bot detection patterns
const BOT_PATTERNS = [
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

// Blocked IPs (in production, use a database)
const BLOCKED_IPS = new Set<string>();

// Rate limiting function
function checkRateLimit(ip: string, isApiRoute: boolean = false): boolean {
  const now = Date.now();
  const key = `${ip}:${isApiRoute ? "api" : "web"}`;
  const maxRequests = isApiRoute
    ? RATE_LIMIT_MAX_API_REQUESTS
    : RATE_LIMIT_MAX_REQUESTS;

  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(",")[0].trim();

  return request.ip || "unknown";
}

// Check for suspicious patterns
function isSuspiciousRequest(request: NextRequest): boolean {
  const url = request.url;
  const userAgent = request.headers.get("user-agent") || "";

  // Check URL for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(url)) {
      return true;
    }
  }

  // Check User-Agent for bot patterns
  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }

  return false;
}

// Security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent XSS attacks
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
  );

  // HSTS (HTTP Strict Transport Security)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Permissions Policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
  );

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);

  // Log middleware execution for debugging
  console.log(
    `[MIDDLEWARE] Processing request from ${clientIP} to ${pathname}`
  );

  // Block known malicious IPs
  if (BLOCKED_IPS.has(clientIP)) {
    console.log(`[MIDDLEWARE] Blocked malicious IP: ${clientIP}`);
    return new NextResponse("Access Denied", { status: 403 });
  }

  // Check for suspicious patterns
  if (isSuspiciousRequest(request)) {
    console.warn(
      `[MIDDLEWARE] Suspicious request blocked from IP: ${clientIP}, URL: ${request.url}`
    );
    return new NextResponse("Access Denied", { status: 403 });
  }

  // Rate limiting
  const isApiRoute = pathname.startsWith("/api/");
  const isLetterSubmission = pathname === "/api/letters/submit";

  console.log(
    `[MIDDLEWARE] Rate limiting check - IP: ${clientIP}, isApiRoute: ${isApiRoute}, isLetterSubmission: ${isLetterSubmission}`
  );

  if (!checkRateLimit(clientIP, isApiRoute)) {
    console.warn(`[MIDDLEWARE] Rate limit exceeded for IP: ${clientIP}`);
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "900", // 15 minutes
        "X-RateLimit-Limit": isApiRoute
          ? RATE_LIMIT_MAX_API_REQUESTS.toString()
          : RATE_LIMIT_MAX_REQUESTS.toString(),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": new Date(
          Date.now() + RATE_LIMIT_WINDOW
        ).toISOString(),
      },
    });
  }

  // Additional rate limiting for letter submissions
  if (isLetterSubmission) {
    const LETTER_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
    const LETTER_RATE_LIMIT_MAX_REQUESTS = 3; // 3 letters per 15 minutes

    const letterKey = `${clientIP}:letters`;
    const now = Date.now();
    const current = letterRateLimitStore.get(letterKey);

    if (!current || now > current.resetTime) {
      letterRateLimitStore.set(letterKey, {
        count: 1,
        resetTime: now + LETTER_RATE_LIMIT_WINDOW,
      });
    } else if (current.count >= LETTER_RATE_LIMIT_MAX_REQUESTS) {
      console.warn(`Letter rate limit exceeded for IP: ${clientIP}`);
      return new NextResponse(
        "You can only submit 3 letters per 15 minutes. Please wait before submitting another letter.",
        {
          status: 429,
          headers: {
            "Retry-After": "900", // 15 minutes
            "X-RateLimit-Limit": "3",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(current.resetTime).toISOString(),
          },
        }
      );
    } else {
      current.count++;
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
