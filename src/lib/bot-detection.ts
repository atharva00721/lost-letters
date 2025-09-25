import { NextRequest } from "next/server";

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
  /chrome-lighthouse/i,
  /gtmetrix/i,
  /pingdom/i,
  /uptimerobot/i,
  /site24x7/i,
  /newrelic/i,
  /datadog/i,
  /sentry/i,
  /bugsnag/i,
  /rollbar/i,
];

// Suspicious behavior patterns
const SUSPICIOUS_BEHAVIORS = [
  "no-referer",
  "rapid-requests",
  "pattern-requests",
  "invalid-headers",
  "missing-headers",
  "suspicious-timing",
];

// Honeypot field names (hidden fields that bots fill but humans don't)
const HONEYPOT_FIELDS = [
  "website",
  "url",
  "homepage",
  "phone",
  "fax",
  "address",
  "company",
  "organization",
];

interface BotDetectionResult {
  isBot: boolean;
  confidence: number;
  reasons: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
}

// Detect bot based on User-Agent
export function detectBotByUserAgent(userAgent: string): BotDetectionResult {
  const reasons: string[] = [];
  let confidence = 0;

  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      reasons.push(`Bot pattern detected: ${pattern.source}`);
      confidence += 0.3;
    }
  }

  // Check for missing or suspicious User-Agent
  if (!userAgent || userAgent.length < 10) {
    reasons.push("Missing or suspicious User-Agent");
    confidence += 0.2;
  }

  // Check for common bot User-Agent patterns
  if (
    userAgent.includes("Mozilla") &&
    userAgent.includes("Chrome") &&
    !userAgent.includes("Safari")
  ) {
    reasons.push("Suspicious Chrome User-Agent without Safari");
    confidence += 0.1;
  }

  const isBot = confidence > 0.3;
  const riskLevel =
    confidence > 0.7
      ? "critical"
      : confidence > 0.5
      ? "high"
      : confidence > 0.3
      ? "medium"
      : "low";

  return {
    isBot,
    confidence,
    reasons,
    riskLevel,
  };
}

// Detect bot based on request patterns
export function detectBotByBehavior(
  request: NextRequest,
  requestHistory: any[] = []
): BotDetectionResult {
  const reasons: string[] = [];
  let confidence = 0;

  // Check for missing common headers
  const commonHeaders = [
    "accept",
    "accept-language",
    "accept-encoding",
    "connection",
  ];
  const missingHeaders = commonHeaders.filter(
    (header) => !request.headers.get(header)
  );

  if (missingHeaders.length > 2) {
    reasons.push(`Missing common headers: ${missingHeaders.join(", ")}`);
    confidence += 0.2;
  }

  // Check for suspicious header values
  const acceptHeader = request.headers.get("accept");
  if (acceptHeader && !acceptHeader.includes("text/html")) {
    reasons.push("Suspicious Accept header");
    confidence += 0.1;
  }

  // Check for rapid requests from same IP
  const clientIP = getClientIP(request);
  const recentRequests = requestHistory.filter(
    (req) => req.clientIP === clientIP && Date.now() - req.timestamp < 60000 // Last minute
  );

  if (recentRequests.length > 10) {
    reasons.push("Rapid requests from same IP");
    confidence += 0.3;
  }

  // Check for pattern in requests
  const urls = requestHistory.map((req) => req.url);
  if (urls.length > 5) {
    const uniquePaths = new Set(urls.map((url) => new URL(url).pathname));
    if (uniquePaths.size < urls.length * 0.3) {
      reasons.push("Repetitive request patterns");
      confidence += 0.2;
    }
  }

  // Check for missing referer on form submissions
  const referer = request.headers.get("referer");
  if (request.method === "POST" && !referer) {
    reasons.push("Missing referer on POST request");
    confidence += 0.1;
  }

  const isBot = confidence > 0.3;
  const riskLevel =
    confidence > 0.7
      ? "critical"
      : confidence > 0.5
      ? "high"
      : confidence > 0.3
      ? "medium"
      : "low";

  return {
    isBot,
    confidence,
    reasons,
    riskLevel,
  };
}

// Check honeypot fields
export function checkHoneypotFields(formData: FormData): BotDetectionResult {
  const reasons: string[] = [];
  let confidence = 0;

  for (const field of HONEYPOT_FIELDS) {
    const value = formData.get(field);
    if (value && value.toString().trim() !== "") {
      reasons.push(`Honeypot field filled: ${field}`);
      confidence += 0.4;
    }
  }

  const isBot = confidence > 0.3;
  const riskLevel =
    confidence > 0.7
      ? "critical"
      : confidence > 0.5
      ? "high"
      : confidence > 0.3
      ? "medium"
      : "low";

  return {
    isBot,
    confidence,
    reasons,
    riskLevel,
  };
}

// Comprehensive bot detection
export function detectBot(
  request: NextRequest,
  formData?: FormData,
  requestHistory: any[] = []
): BotDetectionResult {
  const userAgent = request.headers.get("user-agent") || "";

  // Check User-Agent
  const uaResult = detectBotByUserAgent(userAgent);

  // Check behavior
  const behaviorResult = detectBotByBehavior(request, requestHistory);

  // Check honeypot if form data provided
  const honeypotResult = formData
    ? checkHoneypotFields(formData)
    : { isBot: false, confidence: 0, reasons: [], riskLevel: "low" as const };

  // Combine results
  const allReasons = [
    ...uaResult.reasons,
    ...behaviorResult.reasons,
    ...honeypotResult.reasons,
  ];
  const totalConfidence = Math.min(
    1,
    uaResult.confidence + behaviorResult.confidence + honeypotResult.confidence
  );

  const isBot = uaResult.isBot || behaviorResult.isBot || honeypotResult.isBot;

  let riskLevel: "low" | "medium" | "high" | "critical" = "low";
  if (totalConfidence > 0.7) riskLevel = "critical";
  else if (totalConfidence > 0.5) riskLevel = "high";
  else if (totalConfidence > 0.3) riskLevel = "medium";

  return {
    isBot,
    confidence: totalConfidence,
    reasons: allReasons,
    riskLevel,
  };
}

// Generate honeypot fields for forms
export function generateHoneypotFields(): Array<{
  name: string;
  type: string;
  style: string;
}> {
  return HONEYPOT_FIELDS.map((field) => ({
    name: field,
    type: "text",
    style:
      "position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0;",
  }));
}

// Simple CAPTCHA challenge (in production, use reCAPTCHA or hCaptcha)
export function generateSimpleCaptcha(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const operation = Math.random() > 0.5 ? "+" : "-";

  let question: string;
  let answer: number;

  if (operation === "+") {
    question = `What is ${a} + ${b}?`;
    answer = a + b;
  } else {
    question = `What is ${a} - ${b}?`;
    answer = a - b;
  }

  return { question, answer };
}

// Verify CAPTCHA answer
export function verifyCaptcha(
  userAnswer: string,
  correctAnswer: number
): boolean {
  const parsed = parseInt(userAnswer, 10);
  return !isNaN(parsed) && parsed === correctAnswer;
}

// Get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(",")[0].trim();

  return request.ip || "unknown";
}

// Rate limiting for bot detection
const botDetectionStore = new Map<
  string,
  { count: number; lastSeen: number }
>();

export function checkBotRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const window = 5 * 60 * 1000; // 5 minutes
  const maxAttempts = 5;

  const current = botDetectionStore.get(clientIP);

  if (!current || now - current.lastSeen > window) {
    botDetectionStore.set(clientIP, { count: 1, lastSeen: now });
    return true;
  }

  if (current.count >= maxAttempts) {
    return false;
  }

  current.count++;
  current.lastSeen = now;
  return true;
}
