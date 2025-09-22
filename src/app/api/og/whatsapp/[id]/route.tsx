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
      const response = new ImageResponse(
        (
          <div
            tw="w-full h-full flex items-center justify-center relative"
            style={{ backgroundColor: "#d0fbea" }}
          >
            {/* Letter paper texture overlay */}
            <div
              tw="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Content */}
            <div tw="flex flex-col items-center justify-center text-center px-16 max-w-4xl relative z-10">
              <div
                tw="text-6xl font-bold text-foreground mb-5 drop-shadow-sm flex"
                style={{
                  fontFamily: "var(--font-instrument-sans), sans-serif",
                }}
              >
                Lost Letters
              </div>
              <div
                tw="text-3xl text-foreground mb-10 flex"
                style={{
                  fontFamily: "var(--font-instrument-sans), sans-serif",
                }}
              >
                Letter Not Found
              </div>
              <div
                tw="text-xl text-foreground flex"
                style={{
                  fontFamily: "var(--font-instrument-sans), sans-serif",
                }}
              >
                This letter may have been lost in the digital void
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 300,
        }
      );

      // Add cache headers
      response.headers.set(
        "Cache-Control",
        "public, max-age=31536000, immutable"
      );
      response.headers.set("Content-Type", "image/png");
      return response;
    }

    const letter = result.data;
    const recipient = letter.name;
    const formattedTitle = formatLetterTitle(letter.name);
    const message =
      letter.message.length > 200
        ? letter.message.substring(0, 200) + "..."
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

    const response = new ImageResponse(
      (
        <div
          tw="w-full h-full flex items-center justify-center p-4"
          style={{ backgroundColor: "#d0fbea" }}
        >
          {/* Letter Card Container - WhatsApp optimized */}
          <div
            tw="bg-white/90 backdrop-blur-sm border-2 border-black rounded-2xl relative overflow-hidden max-w-5xl mx-auto w-full h-full flex flex-col"
            style={{ boxShadow: "3px 3px 0px 0px #000000" }}
          >
            {/* Letter paper texture overlay */}
            <div tw="absolute inset-0 opacity-8 bg-gradient-to-br from-gray-100 via-transparent to-gray-200 pointer-events-none" />

            {/* Header - Greeting and Date */}
            <div tw="px-6 pt-4 pb-1 relative z-10 flex flex-col">
              <div
                tw="text-4xl font-normal text-foreground leading-tight italic mb-1 flex"
                style={{ fontFamily: "var(--font-instrument-serif), serif" }}
              >
                {formattedTitle}
              </div>
              <div
                tw="text-sm text-foreground flex"
                style={{ fontFamily: "var(--font-instrument-serif), serif" }}
              >
                {formattedDate}
              </div>
            </div>

            {/* Message */}
            <div tw="flex-1 px-6 py-1 relative z-10 flex flex-col justify-start">
              <div
                tw="text-4xl text-foreground whitespace-pre-wrap leading-relaxed flex text-center mt-2"
                style={{ fontFamily: "var(--font-instrument-serif), serif" }}
              >
                {message}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 300,
        fonts: [
          {
            name: "Instrument Serif",
            data: await loadGoogleFont("Instrument+Serif", allText),
            style: "normal",
          },
        ],
      }
    );

    // Add optimized cache headers for WhatsApp
    response.headers.set(
      "Cache-Control",
      "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"
    );
    response.headers.set("Content-Type", "image/png");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    return response;
  } catch (error) {
    console.error("Error generating WhatsApp OG image:", error);

    // Simple error fallback
    const errorResponse = new ImageResponse(
      (
        <div
          tw="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: "#d0fbea" }}
        >
          <div
            tw="text-5xl font-bold text-foreground flex"
            style={{ fontFamily: "var(--font-instrument-sans), sans-serif" }}
          >
            Lost Letters
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 300,
      }
    );

    // Add cache headers
    errorResponse.headers.set("Cache-Control", "public, max-age=3600");
    errorResponse.headers.set("Content-Type", "image/png");
    return errorResponse;
  }
}
