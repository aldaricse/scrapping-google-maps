import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const Pagination = ({ pagination, onPageChange, loading }: PaginationProps) => {
  const { page, totalPages , total } = pagination;
  const hasPrev = pagination.hasPrev ?? page > 1;
  const hasNext = pagination.hasNext ?? page < totalPages;

  // Generar números de páginas para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Ajustar startPage si endPage es menor que maxVisiblePages
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      {/* Información de página */}
      <div className="text-sm text-gray-700">
        Página <span className="font-semibold">{page}</span> de{' '}
        <span className="font-semibold">{totalPages}</span>
        {' '}({total} lugares en total)
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center space-x-1">
        {/* Primera página */}
        {page > 1 && (
          <button
            onClick={() => onPageChange(1)}
            disabled={loading}
            className="p-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
          >
            <ChevronsLeft />
          </button>
        )}

        {/* Página anterior */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev || loading}
          className="p-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
        >
          <ChevronLeft />
        </button>

        {/* Números de página */}
        <div className="flex space-x-1">
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              disabled={loading}
              className={`px-3 py-2 text-sm font-medium rounded-md disabled:cursor-not-allowed ${pageNum === page
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Página siguiente */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext || loading}
          className="p-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
        >
          <ChevronRight />
        </button>

        {/* Última página */}
        {page < totalPages && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={loading}
            className="p-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
          >
            <ChevronsRight />
          </button>
        )}
      </div>
    </div>
  );
}
