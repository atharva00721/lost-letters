export const revalidate = 60;

import { getPaginatedLetters } from "@/actions/letter";
import { LETTERS_PAGE_SIZE } from "@/constants/letter";
import Link from "next/link";
import LetterCard from "@/components/LetterCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type Letter } from "@/generated/prisma";
import { JSX } from "react";

// Define API response types for better type safety
type PaginationMetadata = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type LetterApiResponse = {
  success: boolean;
  data?: Letter[];
  error?: string;
  pagination?: PaginationMetadata;
};

// Next.js App Router page props
interface PageProps {
  params: Record<string, string>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function LostLettersPage({
  searchParams,
}: PageProps): Promise<JSX.Element> {
  // Parse and validate query parameters
  const page = parsePageParam(searchParams.page);
  const searchTerm = parseSearchParam(searchParams.search);
  const pageSize = LETTERS_PAGE_SIZE;

  // Fetch data with proper typing
  const result: LetterApiResponse = await getPaginatedLetters(
    page,
    pageSize,
    searchTerm
  );

  // Use type guards to ensure data exists
  const letters: Letter[] = result.success && result.data ? result.data : [];
  const pagination = result.pagination || { totalPages: 1, page: 1 };
  const { totalPages } = pagination;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-center sm:text-left">
        Lost Letters
      </h1>

      <SearchForm searchTerm={searchTerm} />

      {renderLettersList(letters, searchTerm)}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
}

// Helper components for better organization and type safety

type SearchFormProps = {
  searchTerm: string;
};

function SearchForm({ searchTerm }: SearchFormProps): JSX.Element {
  return (
    <form method="get" className="flex flex-col sm:flex-row gap-3 mb-10">
      <Input
        name="search"
        defaultValue={searchTerm}
        placeholder="Search by receiver's name..."
        className="flex-grow"
      />
      <div className="flex gap-2">
        <Button type="submit" className="px-6">
          Search
        </Button>
        {searchTerm && (
          <Link href="/lostLetters">
            <Button variant="neutral">Clear</Button>
          </Link>
        )}
      </div>
    </form>
  );
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  searchTerm: string;
};

function Pagination({
  currentPage,
  totalPages,
  searchTerm,
}: PaginationProps): JSX.Element {
  return (
    <div className="flex justify-center gap-3 mt-12 mb-4">
      {currentPage > 1 && (
        <Link href={buildPageUrl(currentPage - 1, searchTerm)}>
          <Button variant="neutral" className="px-5">
            Previous
          </Button>
        </Link>
      )}
      <span className="py-2 px-4 bg-gray-100 rounded-md flex items-center">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link href={buildPageUrl(currentPage + 1, searchTerm)}>
          <Button variant="neutral" className="px-5">
            Next
          </Button>
        </Link>
      )}
    </div>
  );
}

// Helper functions for rendering and URL building
function renderLettersList(letters: Letter[], searchTerm: string): JSX.Element {
  if (letters.length === 0) {
    return (
      <div className="text-center py-16 text-lg text-gray-500">
        {searchTerm
          ? `No letters found matching "${searchTerm}"`
          : "No letters found"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {letters.map((letter) => (
        <LetterCard key={letter.id} letter={letter} />
      ))}
    </div>
  );
}

// Helper functions for parameter parsing and validation
function parsePageParam(pageParam: string | string[] | undefined): number {
  if (typeof pageParam !== "string") {
    return 1;
  }

  const parsed = parseInt(pageParam, 10);
  return isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

function parseSearchParam(searchParam: string | string[] | undefined): string {
  if (typeof searchParam === "string") {
    return searchParam;
  }

  if (Array.isArray(searchParam) && searchParam.length > 0) {
    return searchParam[0] || "";
  }

  return "";
}

function buildPageUrl(page: number, searchTerm: string): string {
  const baseUrl = `/lostLetters?page=${page}`;
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";
  return `${baseUrl}${searchParam}`.replace(/\s+/, "");
}
