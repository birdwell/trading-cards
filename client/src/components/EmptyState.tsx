interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 dark:text-gray-400 text-lg">{message}</p>
    </div>
  );
}
