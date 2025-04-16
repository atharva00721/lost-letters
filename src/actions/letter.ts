"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// Type definition for letter data
interface LetterData {
  name: string;
  message: string;
  ip: string;
}

/**
 * Creates a new letter in the database, with rate limiting
 * Users can only post once every 6 hours from the same IP address
 *
 * @param data Letter data containing name, message, and IP address
 * @returns The created letter object or error if rate limited
 */
export async function createLetter(data: LetterData) {
  console.log(`[createLetter] Attempting to create letter for IP: ${data.ip}`);

  try {
    // Check if this IP has posted in the last 6 hours
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    console.log(
      `[createLetter] Checking for posts since: ${sixHoursAgo.toISOString()}`
    );

    const recentPost = await prisma.letter.findFirst({
      where: {
        ip: data.ip,
        createdAt: {
          gte: sixHoursAgo,
        },
      },
    });

    // If a recent post exists from this IP, return an error
    if (recentPost) {
      const waitTime = calculateWaitTime(recentPost.createdAt);
      const timeRemaining = getTimeRemainingMs(recentPost.createdAt);

      console.log(
        `[createLetter] Rate limit exceeded for IP: ${
          data.ip
        }. Previous post at: ${recentPost.createdAt.toISOString()}`
      );
      console.log(
        `[createLetter] Time remaining: ${timeRemaining}ms (${waitTime})`
      );

      return {
        success: false,
        error: "Rate limit exceeded",
        message: `You can only post once every 6 hours. Please try again in ${waitTime}.`,
        timeRemaining: timeRemaining,
      };
    }

    // Create new letter in database
    console.log(
      `[createLetter] Creating new letter from: ${data.name} (IP: ${data.ip})`
    );

    const letter = await prisma.letter.create({
      data: {
        name: data.name,
        message: data.message,
        ip: data.ip,
      },
    });

    console.log(
      `[createLetter] Letter created successfully with ID: ${letter.id}`
    );

    // Revalidate the path to update the UI
    revalidatePath("/");

    return { success: true, data: letter };
  } catch (error) {
    console.error("[createLetter] Failed to create letter:", error);
    return { success: false, error: "Failed to create letter" };
  }
}

/**
 * Calculate readable wait time string
 */
function calculateWaitTime(postTime: Date): string {
  const remainingMs = getTimeRemainingMs(postTime);

  if (remainingMs <= 0) return "a moment";

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""} and ${minutes} minute${
      minutes !== 1 ? "s" : ""
    }`;
  } else {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
}

/**
 * Get remaining milliseconds until 6 hours from post time
 */
function getTimeRemainingMs(postTime: Date): number {
  const sixHoursInMs = 6 * 60 * 60 * 1000;
  const postTimeMs = postTime.getTime();
  const now = Date.now();

  return Math.max(0, postTimeMs + sixHoursInMs - now);
}

/**
 * Retrieves all letters from the database
 * @returns Array of letter objects
 */
export async function getLetters() {
  console.log("[getLetters] Fetching all letters");

  try {
    const letters = await prisma.letter.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`[getLetters] Successfully fetched ${letters.length} letters`);
    return { success: true, data: letters };
  } catch (error) {
    console.error("[getLetters] Failed to fetch letters:", error);
    return { success: false, error: "Failed to fetch letters" };
  }
}

/**
 * Retrieves a single letter by ID
 * @param id The ID of the letter to fetch
 */
export async function getLetterById(id: string) {
  try {
    const letter = await prisma.letter.findUnique({ where: { id } });
    if (!letter) {
      return { success: false, error: "Letter not found" };
    }
    return { success: true, data: letter };
  } catch (error) {
    console.error(`[getLetterById] Failed to fetch letter ${id}:`, error);
    return { success: false, error: "Failed to fetch letter" };
  }
}

/**
 * Updates an existing letter in the database
 * @param id The ID of the letter to update
 * @param data Updated letter data
 * @returns The updated letter object
 */
export async function updateLetter(id: string, data: Partial<LetterData>) {
  console.log(`[updateLetter] Attempting to update letter with ID: ${id}`);

  try {
    const letter = await prisma.letter.update({
      where: { id },
      data,
    });

    console.log(`[updateLetter] Successfully updated letter: ${id}`);
    revalidatePath("/");

    return { success: true, data: letter };
  } catch (error) {
    console.error(`[updateLetter] Failed to update letter ${id}:`, error);
    return { success: false, error: "Failed to update letter" };
  }
}

/**
 * Deletes a letter from the database
 * @param id The ID of the letter to delete
 * @returns Success status
 */
export async function deleteLetter(id: string) {
  console.log(`[deleteLetter] Attempting to delete letter with ID: ${id}`);

  try {
    await prisma.letter.delete({
      where: { id },
    });

    console.log(`[deleteLetter] Successfully deleted letter: ${id}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(`[deleteLetter] Failed to delete letter ${id}:`, error);
    return { success: false, error: "Failed to delete letter" };
  }
}

/**
 * Searches for letters based on a search term
 * @param searchTerm The term to search for in letter names and messages
 * @returns Filtered array of letter objects that match the search term
 */
export async function searchLetters(searchTerm: string) {
  console.log(`[searchLetters] Searching for letters with term: ${searchTerm}`);

  try {
    const letters = await prisma.letter.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" as any } },
          { message: { contains: searchTerm, mode: "insensitive" as any } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`[searchLetters] Found ${letters.length} matching letters`);
    return { success: true, data: letters };
  } catch (error) {
    console.error("[searchLetters] Failed to search letters:", error);
    return { success: false, error: "Failed to search letters" };
  }
}

/**
 * Retrieves letters with pagination
 * @param page Page number (starting from 1)
 * @param pageSize Number of items per page
 * @param searchTerm Optional search term to filter results
 * @returns Paginated array of letter objects and metadata
 */
export async function getPaginatedLetters(
  page: number = 1,
  pageSize: number = 10,
  searchTerm?: string
) {
  console.log(
    `[getPaginatedLetters] Fetching page ${page} with size ${pageSize}${
      searchTerm ? ` and search term: ${searchTerm}` : ""
    }`
  );

  const skip = (page - 1) * pageSize;

  try {
    // Build where condition based on whether search term is provided
    const where = searchTerm
      ? {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" as any } },
            { message: { contains: searchTerm, mode: "insensitive" as any } },
          ],
        }
      : {};

    // Get total count for pagination
    const totalCount = await prisma.letter.count({ where });

    // Get paginated data
    const letters = await prisma.letter.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    console.log(
      `[getPaginatedLetters] Successfully fetched ${letters.length} letters (page ${page}/${totalPages})`
    );

    return {
      success: true,
      data: letters,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error(
      "[getPaginatedLetters] Failed to fetch paginated letters:",
      error
    );
    return { success: false, error: "Failed to fetch paginated letters" };
  }
}
