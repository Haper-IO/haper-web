import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface HistoryPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function HistoryPagination({ currentPage, totalPages, onPageChange }: HistoryPaginationProps) {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href="#" onClick={(e) => {
              e.preventDefault()
              onPageChange(currentPage - 1)
            }} />
          </PaginationItem>
        )}
        
        {/* First page */}
        <PaginationItem>
          <PaginationLink 
            href="#" 
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault()
              onPageChange(1)
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
        
        {/* Show ellipsis if needed */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        
        {/* Pages around current page */}
        {totalPages > 1 && 
          Array.from({ length: Math.min(3, totalPages - 1) })
            .map((_, i) => {
              // Calculate page numbers to show around current page
              let pageNumber
              if (currentPage <= 2) {
                // Near beginning, show 2, 3 
                pageNumber = i + 2
              } else if (currentPage >= totalPages - 1) {
                // Near end, show totalPages-2, totalPages-1
                pageNumber = totalPages - 2 + i
              } else {
                // Middle, show currentPage-1, currentPage, currentPage+1
                pageNumber = currentPage - 1 + i
              }
              
              // Only show if within range and not already showing first/last page
              if (pageNumber > 1 && pageNumber < totalPages) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === pageNumber}
                      onClick={(e) => {
                        e.preventDefault()
                        onPageChange(pageNumber)
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              }
              return null
            }).filter(Boolean)
        }
        
        {/* Show ellipsis if needed */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        
        {/* Last page if more than one page */}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink 
              href="#" 
              isActive={currentPage === totalPages}
              onClick={(e) => {
                e.preventDefault()
                onPageChange(totalPages)
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href="#" onClick={(e) => {
              e.preventDefault()
              onPageChange(currentPage + 1)
            }} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
