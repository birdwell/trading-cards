interface ErrorMessageProps {
  error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
      <p className="text-red-700 dark:text-red-400">Error: {error}</p>
      <p className="text-sm text-red-600 dark:text-red-500 mt-2">
        Make sure the tRPC server is running on port 3002
      </p>
    </div>
  );
}
