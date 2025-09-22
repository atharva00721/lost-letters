import { ImageResponse } from "next/og";
import { getLetterById } from "@/actions/letter";
import { formatLetterTitle } from "@/lib/utils";

export const runtime = "nodejs";

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Fetch the letter data
    const result = await getLetterById(id);

    if (!result.success || !result.data) {
      // Simple fallback for missing letters
      return new ImageResponse(
        (
          <div
            style={{
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Instrument Sans, sans-serif",
              position: "relative",
            }}
          >
            {/* Letter paper texture overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255, 255, 255, 0.1)",
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "60px",
                maxWidth: "900px",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 700,
                  color: "#2d3748",
                  marginBottom: "20px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                  display: "flex",
                }}
              >
                Lost Letters
              </div>
              <div
                style={{
                  fontSize: 36,
                  color: "#4a5568",
                  marginBottom: "40px",
                  display: "flex",
                }}
              >
                Letter Not Found
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#718096",
                  display: "flex",
                }}
              >
                This letter may have been lost in the digital void
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    const letter = result.data;
    const recipient = letter.name;
    const formattedTitle = formatLetterTitle(letter.name);
    const message =
      letter.message.length > 300
        ? letter.message.substring(0, 300) + "..."
        : letter.message;
    const formattedDate = new Date(letter.createdAt).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    // Prepare text for font loading
    const allText = `${formattedTitle} ${message} ${formattedDate} Sincerely, Anonymous Lost Letters`;

    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Instrument Sans, sans-serif",
            position: "relative",
            padding: "40px",
          }}
        >
          {/* Letter Card Container */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "3px solid rgba(0, 0, 0, 0.08)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "2000px",
              height: "1100px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              boxShadow:
                "0 40px 80px rgba(0, 0, 0, 0.15), 0 20px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
            }}
          >
            {/* Letter paper texture overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255, 255, 255, 0.1)",
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)",
                backgroundSize: "20px 20px",
                pointerEvents: "none",
                display: "flex",
              }}
            />

            {/* Card Header */}
            <div
              style={{
                padding: "80px 100px 40px 100px",
                borderBottom: "2px solid rgba(0, 0, 0, 0.08)",
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Letter greeting */}
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 400,
                  color: "#1f2937",
                  marginBottom: "24px",
                  fontStyle: "italic",
                  fontFamily: '"Instrument Serif", serif',
                  letterSpacing: "-0.02em",
                  display: "flex",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                {formattedTitle}
              </div>
              {/* Date */}
              <div
                style={{
                  fontSize: 36,
                  color: "#6b7280",
                  fontFamily: '"Instrument Serif", serif',
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  display: "flex",
                }}
              >
                {formattedDate}
              </div>
            </div>

            {/* Card Content */}
            <div
              style={{
                padding: "60px 100px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Letter content */}
              <div
                style={{
                  fontSize: 64,
                  color: "#374151",
                  lineHeight: 1.7,
                  flex: 1,
                  display: "flex",
                  alignItems: "flex-start",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: '"Instrument Serif", serif',
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                }}
              >
                {message}
              </div>

              {/* Letter signature area */}
              <div
                style={{
                  marginTop: "60px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    textAlign: "right",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      fontSize: 40,
                      color: "#4b5563",
                      marginBottom: "8px",
                      fontFamily: '"Instrument Serif", serif',
                      fontWeight: 400,
                      fontStyle: "italic",
                      letterSpacing: "0.01em",
                      display: "flex",
                    }}
                  >
                    Sincerely,
                  </div>
                  <div
                    style={{
                      fontSize: 36,
                      color: "#6b7280",
                      fontFamily: '"Instrument Serif", serif',
                      fontWeight: 400,
                      letterSpacing: "0.01em",
                      display: "flex",
                    }}
                  >
                    Anonymous
                  </div>
                </div>
              </div>
            </div>

            {/* Lost Letters branding */}
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: "60px",
                fontSize: 32,
                color: "#9ca3af",
                fontWeight: 500,
                display: "flex",
              }}
            >
              Lost Letters
            </div>
          </div>
        </div>
      ),
      {
        width: 2400,
        height: 1260,
        fonts: [
          {
            name: "Instrument Serif",
            data: await loadGoogleFont("Instrument+Serif", allText),
            style: "normal",
          },
        ],
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Simple error fallback
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
            color: "#2d3748",
            fontFamily: "Instrument Sans, sans-serif",
          }}
        >
          <div style={{ display: "flex" }}>Lost Letters</div>
        </div>
      ),
      {
        width: 2400,
        height: 1260,
      }
    );
  }
}
