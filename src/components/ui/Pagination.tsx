import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import type { PaginationMeta } from '@/types';

type PaginationProps = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
};

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, hasNextPage, hasPrevPage, total } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-gray-600">
        Page {page} of {totalPages} ({total} total)
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
