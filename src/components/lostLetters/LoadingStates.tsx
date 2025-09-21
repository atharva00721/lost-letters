interface LoadingStatesProps {
  isInitialLoading: boolean;
  lettersCount: number;
}

export function LoadingStates({
  isInitialLoading,
  lettersCount,
}: LoadingStatesProps) {
  if (!isInitialLoading || lettersCount > 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {Array.from({ length: 9 }).map((_, idx) => (
        <div key={idx} className="animate-pulse">
          <div className="bg-white/70 backdrop-blur-sm border rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-4/6" />
            </div>
            <div className="mt-4 h-px bg-gray-100" />
            <div className="mt-3 h-3 bg-gray-200 rounded w-1/4 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
