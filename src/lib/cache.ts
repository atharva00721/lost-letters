import { NextRequest, NextResponse } from "next/server";

// Cache store (in production, use Redis or Memcached)
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
  hits: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 1000; // Maximum cache entries
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  // Set cache entry
  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    });
  }

  // Get cache entry
  get(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count
    entry.hits++;
    return entry.data;
  }

  // Delete cache entry
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache stats
  getStats(): {
    size: number;
    hitRate: number;
    topKeys: Array<{ key: string; hits: number }>;
  } {
    const entries = Array.from(this.cache.entries());
    const totalHits = entries.reduce((sum, [, entry]) => sum + entry.hits, 0);
    const hitRate =
      totalHits > 0
        ? entries.reduce((sum, [, entry]) => sum + entry.hits, 0) /
          entries.length
        : 0;

    const topKeys = entries
      .map(([key, entry]) => ({ key, hits: entry.hits }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 10);

    return {
      size: this.cache.size,
      hitRate,
      topKeys,
    };
  }

  // Clean expired entries
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const cacheManager = new CacheManager();

// Cache middleware for API routes
export function withCache(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    ttl?: number;
    keyGenerator?: (request: NextRequest) => string;
    skipCache?: (request: NextRequest) => boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Skip cache if specified
    if (options.skipCache && options.skipCache(request)) {
      return handler(request);
    }

    // Generate cache key
    const cacheKey = options.keyGenerator
      ? options.keyGenerator(request)
      : `api:${request.method}:${request.url}`;

    // Try to get from cache
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "X-Cache": "HIT",
          "X-Cache-Key": cacheKey,
        },
      });
    }

    // Execute handler
    const response = await handler(request);

    // Cache successful responses
    if (response.status === 200) {
      try {
        const data = await response.json();
        cacheManager.set(cacheKey, data, options.ttl || 5 * 60 * 1000);
      } catch (error) {
        // If response is not JSON, don't cache
        console.warn("Failed to cache non-JSON response");
      }
    }

    // Add cache headers
    response.headers.set("X-Cache", "MISS");
    response.headers.set("X-Cache-Key", cacheKey);

    return response;
  };
}

// Cache headers for static content
export function getCacheHeaders(
  type: "static" | "dynamic" | "api"
): Record<string, string> {
  switch (type) {
    case "static":
      return {
        "Cache-Control": "public, max-age=31536000, immutable", // 1 year
        Expires: new Date(Date.now() + 31536000 * 1000).toUTCString(),
      };
    case "dynamic":
      return {
        "Cache-Control": "public, max-age=300, s-maxage=600", // 5 minutes, 10 minutes on CDN
        Expires: new Date(Date.now() + 300 * 1000).toUTCString(),
      };
    case "api":
      return {
        "Cache-Control": "private, max-age=60, s-maxage=120", // 1 minute, 2 minutes on CDN
        Expires: new Date(Date.now() + 60 * 1000).toUTCString(),
      };
    default:
      return {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      };
  }
}

// CDN cache headers
export function getCDNHeaders(): Record<string, string> {
  return {
    "CDN-Cache-Control": "max-age=3600", // 1 hour on CDN
    "CDN-Cache-TTL": "3600",
    "CDN-Cache-Key": "v1",
  };
}

// Cache invalidation
export function invalidateCache(pattern: string): void {
  const regex = new RegExp(pattern);
  for (const key of cacheManager["cache"].keys()) {
    if (regex.test(key)) {
      cacheManager.delete(key);
    }
  }
}

// Cache warming
export async function warmCache(urls: string[]): Promise<void> {
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`Cache warmed for: ${url}`);
      }
    } catch (error) {
      console.warn(`Failed to warm cache for: ${url}`, error);
    }
  }
}

// Cache statistics endpoint
export function getCacheStats(): any {
  return cacheManager.getStats();
}

// Cleanup expired cache entries (run periodically)
export function cleanupCache(): void {
  cacheManager.cleanExpired();
}

// Cache key generators
export const cacheKeys = {
  letter: (id: string) => `letter:${id}`,
  letters: (page: number, limit: number) => `letters:${page}:${limit}`,
  search: (query: string, page: number) => `search:${query}:${page}`,
  user: (id: string) => `user:${id}`,
  stats: () => "stats",
  count: () => "count",
};

// Cache TTL constants
export const CACHE_TTL = {
  LETTER: 5 * 60 * 1000, // 5 minutes
  LETTERS: 2 * 60 * 1000, // 2 minutes
  SEARCH: 1 * 60 * 1000, // 1 minute
  STATS: 10 * 60 * 1000, // 10 minutes
  COUNT: 30 * 1000, // 30 seconds
} as const;
