import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface DataTablePaginationProps {
  pageIndex: number
  pageCount: number
  pageSize?: number
  totalItems?: number
  canPreviousPage: boolean
  canNextPage: boolean
  setPageIndex: (index: number) => void
  previousPage: () => void
  nextPage: () => void
}

export function DataTablePagination({
  pageIndex,
  pageCount,
  pageSize = 10,
  totalItems = 0,
  canPreviousPage,
  canNextPage,
  setPageIndex,
  previousPage,
  nextPage,
}: DataTablePaginationProps) {
  if (pageCount <= 1 && totalItems === 0) return null;

  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (pageCount <= 7) {
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      if (pageIndex <= 3) {
        for (let i = 0; i < 5; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(pageCount - 1);
      } else if (pageIndex >= pageCount - 4) {
        pages.push(0);
        pages.push("ellipsis");
        for (let i = pageCount - 5; i < pageCount; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push("ellipsis");
        for (let i = pageIndex - 1; i <= pageIndex + 1; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(pageCount - 1);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4">
      <div className="flex-1 text-sm text-muted-foreground font-medium">
        {totalItems > 0 ? (
          <>
            Showing <span className="text-foreground">{startItem}-{endItem}</span> of{" "}
            <span className="text-foreground">{totalItems}</span>
          </>
        ) : (
          <>
            Página <span className="text-foreground">{pageIndex + 1}</span> de{" "}
            <span className="text-foreground">{pageCount}</span>
          </>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="h-8 px-2 lg:px-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        
        <div className="hidden md:flex items-center space-x-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "ellipsis") {
              return (
                <div key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              );
            }
            const pageNum = p as number;
            return (
              <Button
                key={pageNum}
                variant={pageIndex === pageNum ? "default" : "outline"}
                size="sm"
                className={`h-8 w-8 p-0 ${pageIndex === pageNum ? 'bg-violet-600 hover:bg-violet-500 text-white border-transparent' : ''}`}
                onClick={() => setPageIndex(pageNum)}
              >
                {pageNum + 1}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="h-8 px-2 lg:px-3"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
