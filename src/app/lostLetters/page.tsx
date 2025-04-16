import Link from "next/link";
import { getPaginatedLetters } from "@/actions/letter";

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

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
type Props = {
  // fully compatible with Next's built‑in `PageProps`
  searchParams?: Record<string, string | string[]>;
};

export const revalidate = 60; // ISR every 60 s

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default async function LostLettersPage({ searchParams }: Props) {
  /* --------- query helpers --------- */
  const rawPage = searchParams?.page;
  const rawSearch = searchParams?.search;

  const page = parseInt(
    Array.isArray(rawPage) ? rawPage[0] ?? "1" : rawPage ?? "1",
    10
  );
  const pageSize = 10;
  const searchTerm = Array.isArray(rawSearch)
    ? rawSearch[0] ?? ""
    : rawSearch ?? "";

  /* --------- data fetch ---------- */
  const result = await getPaginatedLetters(page, pageSize, searchTerm);

  const letters = result.success && result.data ? result.data : [];
  const totalPages = result.pagination?.totalPages ?? 1;
  const pageNumbers = computePageNumbers(page, totalPages);

  /* --------- render ---------- */
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-center sm:text-left">
        Lost Letters
      </h1>

      {/* ---------- Search bar ---------- */}
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

      {/* ---------- List / Empty state ---------- */}
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

      {/* ---------- Pagination ---------- */}
      {totalPages > 1 && (
        <div className="mt-12 mb-4">
          <Pagination>
            <PaginationContent>
              {/* Previous */}
              <PaginationItem>
                {page > 1 ? (
                  <PaginationPrevious href={buildHref(page - 1, searchTerm)} />
                ) : (
                  <PaginationPrevious
                    href="#"
                    className="pointer-events-none opacity-50"
                  />
                )}
              </PaginationItem>

              {/* Page numbers / ellipses */}
              {pageNumbers.map((num, idx) =>
                typeof num === "number" ? (
                  <PaginationItem key={num}>
                    <PaginationLink
                      href={buildHref(num, searchTerm)}
                      isActive={page === num}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              )}

              {/* Next */}
              <PaginationItem>
                {page < totalPages ? (
                  <PaginationNext href={buildHref(page + 1, searchTerm)} />
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

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */
function computePageNumbers(
  current: number,
  total: number
): (number | "ellipsis-start" | "ellipsis-end")[] {
  const out: (number | "ellipsis-start" | "ellipsis-end")[] = [];
  const maxVisible = 5;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) out.push(i);
    return out;
  }

  out.push(1); // always first

  if (current > 3) out.push("ellipsis-start");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) out.push(i);

  if (current < total - 2) out.push("ellipsis-end");

  out.push(total); // always last
  return out;
}

function buildHref(page: number, search: string) {
  return `/lostLetters?page=${page}${
    search ? `&search=${encodeURIComponent(search)}` : ""
  }`;
}
