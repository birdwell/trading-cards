import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

interface DataStateWrapperProps<T> {
  isLoading: boolean;
  error?: string | null;
  data?: T[] | T | null;
  isEmpty?: (data: T[] | T | null | undefined) => boolean;
  loadingComponent?: React.ReactNode;
  errorComponent?: (error: string) => React.ReactNode;
  emptyComponent?: React.ReactNode;
  children: React.ReactNode;
}

export default function DataStateWrapper<T>({
  isLoading,
  error,
  data,
  isEmpty = (data) => !data || (Array.isArray(data) && data.length === 0),
  loadingComponent,
  errorComponent,
  emptyComponent,
  children,
}: DataStateWrapperProps<T>) {
  // Show loading state
  if (isLoading) {
    return <>{loadingComponent || <LoadingSpinner />}</>;
  }

  // Show error state
  if (error) {
    return <>{errorComponent ? errorComponent(error) : <ErrorMessage error={error} />}</>;
  }

  // Show empty state
  if (isEmpty(data)) {
    return <>{emptyComponent || <EmptyState />}</>;
  }

  // Show children (the actual data)
  return <>{children}</>;
}
