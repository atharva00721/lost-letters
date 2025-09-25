// DDoS Protection Configuration
export const DDOS_CONFIG = {
  // Rate Limiting
  RATE_LIMITS: {
    // General web requests
    WEB: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requests per window
    },
    // API requests
    API: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 50, // 50 API requests per window
    },
    // Write operations (POST, PUT, DELETE)
    WRITE: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 10, // 10 write requests per window
    },
    // Letter submissions (specific to your use case)
    LETTERS: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 3, // 3 letters per 15 minutes per IP
    },
    // Bot detection
    BOT: {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxAttempts: 5, // 5 bot detection attempts per window
    },
  },

  // Request size limits
  REQUEST_LIMITS: {
    maxBodySize: 1024 * 1024, // 1MB
    maxUrlLength: 2048, // 2KB
    maxHeadersSize: 8192, // 8KB
  },

  // Cache TTL
  CACHE_TTL: {
    static: 31536000, // 1 year
    dynamic: 300, // 5 minutes
    api: 60, // 1 minute
    error: 3600, // 1 hour
  },

  // Security patterns
  SECURITY_PATTERNS: {
    // XSS patterns
    xss: [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /document\.cookie/i,
      /window\.location/i,
    ],
    // SQL injection patterns
    sql: [
      /union\s+select/i,
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      /update\s+set/i,
      /char\s*\(/i,
      /exec\s*\(/i,
      /system\s*\(/i,
    ],
    // Directory traversal patterns
    traversal: [/\.\./, /\.\.%2f/i, /\.\.%5c/i, /\.\.%252f/i, /\.\.%255c/i],
    // Bot patterns
    bot: [
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
    ],
  },

  // Honeypot fields
  HONEYPOT_FIELDS: [
    "website",
    "url",
    "homepage",
    "phone",
    "fax",
    "address",
    "company",
    "organization",
    "business",
    "workplace",
  ],

  // Blocked IPs (in production, use a database)
  BLOCKED_IPS: new Set<string>(),

  // Allowed origins for CORS
  ALLOWED_ORIGINS: [
    "https://lostletters.arvie.tech",
    "https://www.lostletters.arvie.tech",
    "http://localhost:3000",
    "http://localhost:3001",
  ],

  // Monitoring thresholds
  MONITORING: {
    // Alert thresholds
    ALERTS: {
      highErrorRate: 0.1, // 10% error rate
      highSuspiciousRate: 0.05, // 5% suspicious rate
      highRequestRate: 100, // 100 requests per minute from single IP
      highResponseTime: 5000, // 5 seconds
    },
    // Cleanup intervals
    CLEANUP: {
      events: 24 * 60 * 60 * 1000, // 24 hours
      cache: 60 * 60 * 1000, // 1 hour
      metrics: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },

  // Performance optimizations
  PERFORMANCE: {
    // Compression
    compression: {
      enabled: true,
      level: 6,
      threshold: 1024, // 1KB
    },
    // Image optimization
    images: {
      formats: ["image/webp", "image/avif"],
      quality: 80,
      maxWidth: 1920,
      maxHeight: 1080,
    },
    // Bundle optimization
    bundle: {
      splitChunks: true,
      treeShaking: true,
      minification: true,
    },
  },

  // CDN configuration
  CDN: {
    enabled: true,
    cacheControl: "public, max-age=3600, s-maxage=86400",
    headers: {
      "CDN-Cache-Control": "max-age=3600",
      "CDN-Cache-TTL": "3600",
      "CDN-Cache-Key": "v1",
    },
  },

  // Security headers
  SECURITY_HEADERS: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
  },

  // CAPTCHA configuration
  CAPTCHA: {
    enabled: true,
    provider: "simple", // 'simple', 'recaptcha', 'hcaptcha'
    difficulty: "medium",
    timeout: 300, // 5 minutes
  },

  // Logging configuration
  LOGGING: {
    level: "warn", // 'error', 'warn', 'info', 'debug'
    format: "json",
    includeStack: true,
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
  },
} as const;

// Environment-specific overrides
export function getConfig() {
  const isProduction = process.env.NODE_ENV === "production";
  const isDevelopment = process.env.NODE_ENV === "development";

  const config = JSON.parse(JSON.stringify(DDOS_CONFIG)); // Deep clone

  if (isDevelopment) {
    // Relaxed limits for development
    config.RATE_LIMITS.WEB.maxRequests = 1000;
    config.RATE_LIMITS.API.maxRequests = 500;
    config.RATE_LIMITS.WRITE.maxRequests = 100;
    config.LOGGING.level = "debug";
  }

  if (isProduction) {
    // Stricter limits for production
    config.RATE_LIMITS.WEB.maxRequests = 50;
    config.RATE_LIMITS.API.maxRequests = 25;
    config.RATE_LIMITS.WRITE.maxRequests = 5;
    config.LOGGING.level = "warn";
  }

  return config;
}

// Export the configuration
export const config = getConfig();
