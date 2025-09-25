import { NextRequest } from "next/server";

// Monitoring store (in production, use a proper database)
interface SecurityEvent {
  id: string;
  timestamp: Date;
  type:
    | "rate_limit"
    | "suspicious_request"
    | "blocked_ip"
    | "validation_error"
    | "api_error";
  severity: "low" | "medium" | "high" | "critical";
  clientIP: string;
  userAgent: string;
  url: string;
  method: string;
  details: Record<string, any>;
}

interface Metrics {
  totalRequests: number;
  blockedRequests: number;
  rateLimitedRequests: number;
  suspiciousRequests: number;
  errors: number;
  topIPs: Record<string, number>;
  topUserAgents: Record<string, number>;
  hourlyStats: Record<string, number>;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private metrics: Metrics = {
    totalRequests: 0,
    blockedRequests: 0,
    rateLimitedRequests: 0,
    suspiciousRequests: 0,
    errors: 0,
    topIPs: {},
    topUserAgents: {},
    hourlyStats: {},
  };

  // Log security event
  logEvent(
    type: SecurityEvent["type"],
    severity: SecurityEvent["severity"],
    request: NextRequest,
    details: Record<string, any> = {}
  ): void {
    const event: SecurityEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type,
      severity,
      clientIP: this.getClientIP(request),
      userAgent: request.headers.get("user-agent") || "unknown",
      url: request.url,
      method: request.method,
      details,
    };

    this.events.push(event);
    this.updateMetrics(event);
    this.checkForAlerts(event);

    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  // Update metrics
  private updateMetrics(event: SecurityEvent): void {
    this.metrics.totalRequests++;

    switch (event.type) {
      case "rate_limit":
        this.metrics.rateLimitedRequests++;
        break;
      case "suspicious_request":
        this.metrics.suspiciousRequests++;
        break;
      case "blocked_ip":
        this.metrics.blockedRequests++;
        break;
      case "api_error":
        this.metrics.errors++;
        break;
    }

    // Track top IPs
    this.metrics.topIPs[event.clientIP] =
      (this.metrics.topIPs[event.clientIP] || 0) + 1;

    // Track top User Agents
    this.metrics.topUserAgents[event.userAgent] =
      (this.metrics.topUserAgents[event.userAgent] || 0) + 1;

    // Track hourly stats
    const hour = event.timestamp.getHours().toString();
    this.metrics.hourlyStats[hour] = (this.metrics.hourlyStats[hour] || 0) + 1;
  }

  // Check for alerts
  private checkForAlerts(event: SecurityEvent): void {
    // Alert on critical events
    if (event.severity === "critical") {
      this.sendAlert("Critical security event detected", event);
    }

    // Alert on high rate of requests from single IP
    const ipCount = this.metrics.topIPs[event.clientIP] || 0;
    if (ipCount > 100) {
      this.sendAlert(`High request rate from IP: ${event.clientIP}`, event);
    }

    // Alert on high error rate
    const errorRate = this.metrics.errors / this.metrics.totalRequests;
    if (errorRate > 0.1) {
      // 10% error rate
      this.sendAlert("High error rate detected", event);
    }

    // Alert on high suspicious request rate
    const suspiciousRate =
      this.metrics.suspiciousRequests / this.metrics.totalRequests;
    if (suspiciousRate > 0.05) {
      // 5% suspicious rate
      this.sendAlert("High suspicious request rate detected", event);
    }
  }

  // Send alert (in production, integrate with email/SMS/slack)
  private sendAlert(message: string, event: SecurityEvent): void {
    console.error(`[SECURITY ALERT] ${message}`, {
      eventId: event.id,
      timestamp: event.timestamp,
      clientIP: event.clientIP,
      userAgent: event.userAgent,
      url: event.url,
      details: event.details,
    });

    // In production, you would:
    // - Send email to admin
    // - Send SMS alert
    // - Post to Slack/Discord
    // - Create incident ticket
  }

  // Get client IP
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const cfConnectingIP = request.headers.get("cf-connecting-ip");

    if (cfConnectingIP) return cfConnectingIP;
    if (realIP) return realIP;
    if (forwarded) return forwarded.split(",")[0].trim();

    return request.ip || "unknown";
  }

  // Get metrics
  getMetrics(): Metrics {
    return { ...this.metrics };
  }

  // Get recent events
  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Get events by type
  getEventsByType(
    type: SecurityEvent["type"],
    limit: number = 50
  ): SecurityEvent[] {
    return this.events
      .filter((event) => event.type === type)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Get events by severity
  getEventsBySeverity(
    severity: SecurityEvent["severity"],
    limit: number = 50
  ): SecurityEvent[] {
    return this.events
      .filter((event) => event.severity === severity)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Clear old events (run periodically)
  clearOldEvents(maxAge: number = 24 * 60 * 60 * 1000): void {
    // 24 hours
    const cutoff = new Date(Date.now() - maxAge);
    this.events = this.events.filter((event) => event.timestamp > cutoff);
  }

  // Export events for analysis
  exportEvents(): SecurityEvent[] {
    return [...this.events];
  }
}

// Global monitor instance
export const securityMonitor = new SecurityMonitor();

// Helper functions
export function logSecurityEvent(
  type: SecurityEvent["type"],
  severity: SecurityEvent["severity"],
  request: NextRequest,
  details: Record<string, any> = {}
): void {
  securityMonitor.logEvent(type, severity, request, details);
}

export function getSecurityMetrics(): Metrics {
  return securityMonitor.getMetrics();
}

export function getRecentSecurityEvents(limit: number = 50): SecurityEvent[] {
  return securityMonitor.getRecentEvents(limit);
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Record response time
  recordResponseTime(endpoint: string, responseTime: number): void {
    if (!this.metrics.has(endpoint)) {
      this.metrics.set(endpoint, []);
    }

    const times = this.metrics.get(endpoint)!;
    times.push(responseTime);

    // Keep only last 100 measurements
    if (times.length > 100) {
      times.shift();
    }
  }

  // Get average response time for endpoint
  getAverageResponseTime(endpoint: string): number {
    const times = this.metrics.get(endpoint) || [];
    if (times.length === 0) return 0;

    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  // Get all metrics
  getAllMetrics(): Record<
    string,
    { average: number; count: number; max: number; min: number }
  > {
    const result: Record<
      string,
      { average: number; count: number; max: number; min: number }
    > = {};

    for (const [endpoint, times] of this.metrics.entries()) {
      if (times.length === 0) continue;

      result[endpoint] = {
        average: times.reduce((sum, time) => sum + time, 0) / times.length,
        count: times.length,
        max: Math.max(...times),
        min: Math.min(...times),
      };
    }

    return result;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
