import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export function EmptyState({ searchTerm, onClearSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-4xl mb-4">📭</div>
      <h3 className="text-xl font-medium mb-2">No letters found</h3>
      <p className="text-muted-foreground max-w-md">
        {searchTerm
          ? `No letters match "${searchTerm}". Try a different search term or clear the search.`
          : "There are no letters available at the moment. Be the first to write one!"}
      </p>
      {searchTerm && (
        <Button variant="reverse" onClick={onClearSearch} className="mt-6">
          Clear search
        </Button>
      )}
    </div>
  );
}
