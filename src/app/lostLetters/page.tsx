export const revalidate = 60;

import { getPaginatedLetters } from "@/actions/letter";
import Link from "next/link";
import LetterCard from "@/components/LetterCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  searchParams?: { page?: string; search?: string };
};

export default async function LostLettersPage({ searchParams }: Props) {
  const page = parseInt(searchParams?.page || "1", 10);
  const pageSize = 10;
  const searchTerm = searchParams?.search || "";

  const result = await getPaginatedLetters(page, pageSize, searchTerm);
  const letters = result.success && result.data ? result.data : [];
  const pagination = result.pagination || { totalPages: 1 };
  const totalPages = pagination.totalPages || 1;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // If there are few pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      if (page > 3) {
        // Add ellipsis if current page is far from start
        pageNumbers.push("ellipsis-start");
      }

      // Pages around current page
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (page < totalPages - 2) {
        // Add ellipsis if current page is far from end
        pageNumbers.push("ellipsis-end");
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

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
        <div className="mt-12 mb-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {page > 1 ? (
                  <PaginationPrevious
                    href={`/lostLetters?page=${page - 1}${
                      searchTerm
                        ? `&search=${encodeURIComponent(searchTerm)}`
                        : ""
                    }`}
                  />
                ) : (
                  <PaginationPrevious
                    href="#"
                    className="pointer-events-none opacity-50"
                  />
                )}
              </PaginationItem>

              {pageNumbers.map((pageNumber, index) => {
                if (
                  pageNumber === "ellipsis-start" ||
                  pageNumber === "ellipsis-end"
                ) {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={`/lostLetters?page=${pageNumber}${
                        searchTerm
                          ? `&search=${encodeURIComponent(searchTerm)}`
                          : ""
                      }`}
                      isActive={page === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                {page < totalPages ? (
                  <PaginationNext
                    href={`/lostLetters?page=${page + 1}${
                      searchTerm
                        ? `&search=${encodeURIComponent(searchTerm)}`
                        : ""
                    }`}
                  />
                ) : (
                  <PaginationNext
                    href="#"
                    className="pointer-events-none opacity-50"
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
