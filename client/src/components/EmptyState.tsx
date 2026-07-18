interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
      <p className="text-base font-medium">{message}</p>
    </div>
  );
}
