import { Button } from "@/components/ui/button";

interface InfiniteScrollProps {
  hasNextPage: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

export function InfiniteScroll({
  hasNextPage,
  isFetchingMore,
  onLoadMore,
  loadMoreRef,
}: InfiniteScrollProps) {
  return (
    <>
      {/* Infinite scroll sentinel and fallback */}
      <div ref={loadMoreRef} className="h-1" />
      {hasNextPage && (
        <div className="flex justify-center mt-10 sm:mt-12">
          <Button
            variant="neutral"
            onClick={onLoadMore}
            disabled={isFetchingMore}
            className="px-6 h-10"
          >
            {isFetchingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </>
  );
}
