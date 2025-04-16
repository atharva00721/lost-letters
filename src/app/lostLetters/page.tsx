export const revalidate = 60;

import { getPaginatedLetters } from "@/actions/letter";
import { LETTERS_PAGE_SIZE } from "@/constants/letter";
import Link from "next/link";
import LetterCard from "@/components/LetterCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function LostLettersPage({
  searchParams,
}: {
  searchParams?: { page?: string; search?: string };
}) {
  const page = parseInt(searchParams?.page || "1", 10);
  const pageSize = LETTERS_PAGE_SIZE;
  const searchTerm = searchParams?.search || "";

  const result = await getPaginatedLetters(page, pageSize, searchTerm);
  const letters = result.success && result.data ? result.data : [];
  const totalPages = result.pagination?.totalPages || 1;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-center sm:text-left">
        Lost Letters
      </h1>

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

      {letters.length === 0 ? (
        <div className="text-center py-16 text-lg text-gray-500">
          {searchTerm
            ? `No letters found matching "${searchTerm}"`
            : "No letters found"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {letters.map((letter) => (
            <LetterCard key={letter.id} letter={letter} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-12 mb-4">
          {page > 1 && (
            <Link
              href={`/lostLetters?page=${page - 1}${
                searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
              }`.replace(/\s+/, "")}
            >
              <Button variant="neutral" className="px-5">
                Previous
              </Button>
            </Link>
          )}
          <span className="py-2 px-4 bg-gray-100 rounded-md flex items-center">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/lostLetters?page=${page + 1}${
                searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
              }`.replace(/\s+/, "")}
            >
              <Button variant="neutral" className="px-5">
                Next
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
