import { NextRequest, NextResponse } from "next/server";
import { withApiProtection } from "@/lib/api-protection";
import {
  letterSchema,
  validateRequestBody,
  sanitizeInput,
} from "@/lib/security";

// Letter submission handler
async function handler(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const { data: letterData, error } = validateRequestBody(
      request,
      letterSchema,
      { sanitize: true }
    );

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error,
        },
        { status: 400 }
      );
    }

    // Additional sanitization
    const sanitizedLetter = {
      content: sanitizeInput(letterData.content),
      author: sanitizeInput(letterData.author),
      recipient: letterData.recipient
        ? sanitizeInput(letterData.recipient)
        : undefined,
    };

    // Here you would typically save to your database
    // For now, we'll just return a success response
    console.log("Letter submitted:", {
      content: sanitizedLetter.content.substring(0, 100) + "...",
      author: sanitizedLetter.author,
      recipient: sanitizedLetter.recipient,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Letter submitted successfully!",
      data: {
        id: `letter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Letter submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit letter",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Export with letter-specific rate limiting
export const POST = withApiProtection(handler, {
  isLetterSubmission: true,
  maxBodySize: 1024 * 1024, // 1MB max letter size
});
