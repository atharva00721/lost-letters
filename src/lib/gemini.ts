import { generateText } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Content moderation interface to define the structure of moderation results
 */
export interface ModerationResult {
  isValid: boolean;
  message?: string;
  filteredText: string;
  moderationDetails?: {
    isHarmful: boolean;
    harmTypes: string[];
    confidenceScore: number;
    isGibberish?: boolean;
  };
}

/**
 * Check if a string might be gibberish using various heuristics
 * @param text - Text to check for gibberish patterns
 * @returns Boolean indicating if text appears to be gibberish
 */
export function isLikelyGibberish(text: string): boolean {
  // Skip short texts
  if (text.length < 5) return false;

  // Check for random character sequences
  const normalizedText = text.toLowerCase().trim();

  // 1. Check for unusual character repetitions
  const repeatPattern = /(.)\1{3,}/;
  if (repeatPattern.test(normalizedText)) return true;

  // 2. Check for lack of vowels in longer segments
  const segments = normalizedText.split(/\s+/);
  const longConsonantSegments = segments.filter((segment) => {
    if (segment.length < 5) return false;
    // Count vowels
    const vowelCount = (segment.match(/[aeiou]/g) || []).length;
    // If less than 1/5 of the chars are vowels, likely gibberish
    return vowelCount / segment.length < 0.2;
  });

  if (longConsonantSegments.length >= 2) return true;

  // 3. Check for high consonant-to-vowel ratio overall for longer text
  if (normalizedText.length > 10) {
    const vowelCount = (normalizedText.match(/[aeiou]/g) || []).length;
    const consonantCount =
      normalizedText.replace(/[^a-z]/g, "").length - vowelCount;

    // If text has very few vowels proportionally, likely gibberish
    if (consonantCount > 0 && vowelCount / consonantCount < 0.25) return true;
  }

  return false;
}

/**
 * Moderate content using Gemini AI to detect inappropriate content
 * @param content - Text content to moderate
 * @returns Promise with moderation results
 */
export async function moderateContent(
  content: string
): Promise<ModerationResult> {
  // Skip empty content
  if (!content || content.trim() === "") {
    return {
      isValid: false,
      message: "Content cannot be empty",
      filteredText: "",
    };
  }

  // Check for gibberish text first (faster than AI call)
  if (isLikelyGibberish(content)) {
    return {
      isValid: false,
      message:
        "Your message appears to be gibberish or random text. Please provide meaningful content.",
      filteredText: "",
      moderationDetails: {
        isHarmful: true,
        harmTypes: ["gibberish"],
        confidenceScore: 1.0,
        isGibberish: true,
      },
    };
  }

  try {
    const prompt = `
      Please analyze the following message for harmful content such as:
      - Hate speech or slurs
      - Harassment or bullying
      - Explicit sexual content
      - Violence or threats
      - Spam or excessive repetition
      - Gibberish or nonsensical text that doesn't form coherent communication
      
      Message: "${content}"
      
      Respond with a JSON object containing:
      {
        "isHarmful": boolean,
        "harmTypes": [array of detected issue categories],
        "confidenceScore": number between 0-1,
        "filteredVersion": censored version with asterisks replacing harmful words,
        "isGibberish": boolean (true if text appears to be random keystrokes or meaningless text)
      }
    `;

    const { text } = await generateText({
      model: google("models/gemini-2.0-flash-exp"),
      prompt,
      temperature: 0.1, // Low temperature for more consistent results
    });

    let moderationData;
    try {
      // Extract JSON from the response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        moderationData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse JSON from response");
      }
    } catch (parseError) {
      console.error("Error parsing moderation result:", parseError);
      // Default to allowing content if parsing fails
      return {
        isValid: true,
        filteredText: content,
        message: "Content moderation parsing error",
      };
    }

    // Define a threshold for confidence
    const MODERATION_THRESHOLD = 0.7;

    // Check specifically for gibberish content
    if (moderationData.isGibberish) {
      return {
        isValid: false,
        message:
          "Your message appears to be random text or gibberish. Please provide meaningful content.",
        filteredText: "",
        moderationDetails: {
          isHarmful: true,
          harmTypes: ["gibberish"],
          confidenceScore: moderationData.confidenceScore || 0.9,
          isGibberish: true,
        },
      };
    }

    return {
      isValid:
        !moderationData.isHarmful ||
        moderationData.confidenceScore < MODERATION_THRESHOLD,
      message: moderationData.isHarmful
        ? `Your content was flagged for: ${moderationData.harmTypes.join(", ")}`
        : undefined,
      filteredText: moderationData.isHarmful
        ? moderationData.filteredVersion
        : content,
      moderationDetails: {
        isHarmful: moderationData.isHarmful,
        harmTypes: moderationData.harmTypes,
        confidenceScore: moderationData.confidenceScore,
        isGibberish: moderationData.isGibberish,
      },
    };
  } catch (error) {
    console.error("Content moderation error:", error);

    // If API call fails, still check for gibberish using our local function
    if (isLikelyGibberish(content)) {
      return {
        isValid: false,
        message:
          "Your message appears to be gibberish or random text. Please provide meaningful content.",
        filteredText: "",
        moderationDetails: {
          isHarmful: true,
          harmTypes: ["gibberish"],
          confidenceScore: 1.0,
          isGibberish: true,
        },
      };
    }

    // Fallback to allow content through if API fails and it's not obvious gibberish
    return {
      isValid: true,
      message: "Content moderation service unavailable",
      filteredText: content,
    };
  }
}

/**
 * Test example (can be commented out in production)
 */
// const testModeration = async () => {
//   const { text } = await generateText({
//     model: google("models/gemini-2.0-flash-exp"),
//     prompt: "What is love?",
//   });
//   console.log(text);
//
//   const modResult = await moderateContent("This is a test message");
//   console.log("Moderation result:", modResult);
// };
//
// testModeration().catch(console.error);
