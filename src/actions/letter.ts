"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { moderateContent } from "@/lib/gemini";

// Type definition for letter data
interface LetterData {
  name: string;
  message: string;
  ip: string;
}

/**
 * Creates a new letter in the database
 *
 * @param data Letter data containing name, message, and IP address
 * @returns The created letter object or moderation error
 */
export async function createLetter(data: LetterData) {
  console.log(`[createLetter] Attempting to create letter for IP: ${data.ip}`);

  try {
    // First, moderate the content using Gemini AI
    console.log(`[createLetter] Moderating content for letter from: ${data.name}`);
    
    // Check name for inappropriate content
    const nameModeration = await moderateContent(data.name);
    if (!nameModeration.isValid) {
      console.log(`[createLetter] Name rejected by content moderation: ${nameModeration.message}`);
      return { 
        success: false, 
        error: "Your name contains inappropriate content",
        moderationDetails: nameModeration 
      };
    }
    
    // Check message for inappropriate content
    const messageModeration = await moderateContent(data.message);
    if (!messageModeration.isValid) {
      console.log(`[createLetter] Message rejected by content moderation: ${messageModeration.message}`);
      return { 
        success: false, 
        error: "Your message contains inappropriate content", 
        moderationDetails: messageModeration 
      };
    }
    
    // Use filtered versions of name and message if they were modified
    const filteredName = nameModeration.filteredText;
    const filteredMessage = messageModeration.filteredText;
    
    // Create new letter in database with filtered content
    console.log(
      `[createLetter] Creating new letter from: ${filteredName} (IP: ${data.ip})`
    );

    const letter = await prisma.letter.create({
      data: {
        name: filteredName,
        message: filteredMessage,
        ip: data.ip,
      },
    });

    console.log(
      `[createLetter] Letter created successfully with ID: ${letter.id}`
    );

    // Revalidate the path to update the UI
    revalidatePath("/");

    // If content was filtered but still acceptable, include a warning
    const wasContentFiltered = 
      filteredName !== data.name || 
      filteredMessage !== data.message;
    
    return { 
      success: true, 
      data: letter,
      wasContentFiltered,
      message: wasContentFiltered ? 
        "Your message was filtered to remove potentially inappropriate content" : 
        undefined
    };
  } catch (error) {
    console.error("[createLetter] Failed to create letter:", error);
    return { success: false, error: "Failed to create letter" };
  }
}

/**
 * Retrieves all letters from the database
 * @returns Array of letter objects
 */
export async function getLetters() {
  console.log("[getLetters] Fetching all letters");

  try {
    // Add a retry mechanism for production database connections
    let retries = 3;
    interface Letter {
      id: string;
      name: string;
      message: string;
      ip: string;
      createdAt: Date;
    }

    let letters: Letter[] = []; // Initialize with empty array

    while (retries > 0) {
      try {
        letters = await prisma.letter.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
        break; // Success, exit the retry loop
      } catch (retryError) {
        retries--;
        console.log(
          `[getLetters] Retrying database connection (${retries} attempts left)`
        );

        if (retries === 0) {
          console.error("[getLetters] All retry attempts failed:", retryError);
          throw retryError; // Last attempt failed, rethrow
        }

        // Wait before retrying
        await new Promise((r) => setTimeout(r, 500));
      }
    }

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

    // Add retry mechanism for production
    let retries = 3;
    let totalCount = 0;
    interface Letter {
      id: string;
      name: string;
      message: string;
      ip: string;
      createdAt: Date;
    }

    let letters: Letter[] = []; // Initialize letters array

    while (retries > 0) {
      try {
        // Get total count for pagination
        totalCount = await prisma.letter.count({ where });

        // Get paginated data
        letters = await prisma.letter.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: pageSize,
        });

        break; // Success, exit retry loop
      } catch (retryError) {
        retries--;
        if (retries === 0) throw retryError; // Last attempt failed, rethrow
        console.log(
          `[getPaginatedLetters] Retrying database connection (${retries} attempts left)`
        );
        // Wait before retrying
        await new Promise((r) => setTimeout(r, 500));
      }
    }

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
