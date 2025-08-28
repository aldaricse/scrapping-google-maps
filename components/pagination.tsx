import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationData } from '@/types/places';

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function Pagination({ pagination, onPageChange, loading }: PaginationProps) {
  const { current, total, pages, hasNext, hasPrevious } = pagination;

  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(current - 1)}
        disabled={!hasPrevious || loading}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>
      
      <div className="flex items-center space-x-1">
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          let pageNumber;
          if (pages <= 5) {
            pageNumber = i + 1;
          } else if (current <= 3) {
            pageNumber = i + 1;
          } else if (current >= pages - 2) {
            pageNumber = pages - 4 + i;
          } else {
            pageNumber = current - 2 + i;
          }

          return (
            <Button
              key={pageNumber}
              variant={current === pageNumber ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              disabled={loading}
              className="min-w-[40px]"
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(current + 1)}
        disabled={!hasNext || loading}
        className="flex items-center gap-1"
      >
        Siguiente
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}