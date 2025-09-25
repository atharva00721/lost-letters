import { NextRequest, NextResponse } from "next/server";
import { withApiProtection } from "@/lib/api-protection";
import { getSecurityMetrics, getRecentSecurityEvents } from "@/lib/monitoring";

// Admin security dashboard endpoint
async function handler(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "50");

    let data;

    if (type === "metrics") {
      data = getSecurityMetrics();
    } else if (type === "events") {
      data = getRecentSecurityEvents(limit);
    } else {
      data = {
        metrics: getSecurityMetrics(),
        events: getRecentSecurityEvents(limit),
      };
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Export with protection
export const GET = withApiProtection(handler, {
  isWriteOperation: false,
  requireAuth: true, // In production, add proper authentication
});
