export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#f97316]" />
      <p className="mt-3 text-sm font-medium text-slate-600">Loading...</p>
    </div>
  );
}
