interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm">
      <p className="text-sm font-medium">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
