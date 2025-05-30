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
  // For mobile, show fewer page numbers
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const maxVisiblePages = isMobile ? 3 : 5

  const getVisiblePages = () => {
    const pages = []
    
    // Always show first page
    pages.push(1)
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      
      // Adjust for mobile
      if (isMobile) {
        start = Math.max(2, currentPage)
        end = Math.min(totalPages - 1, currentPage)
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('ellipsis-start')
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis-end')
      }
      
      // Always show last page if more than 1
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <Pagination className="mt-2 sm:mt-4">
      <PaginationContent className="gap-1 sm:gap-2">
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage - 1)
              }}
              className="h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm"
            />
          </PaginationItem>
        )}
        
        {visiblePages.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <PaginationItem key={`ellipsis-${index}`} className="hidden sm:block">
                <PaginationEllipsis className="h-8 sm:h-10 w-8 sm:w-10" />
              </PaginationItem>
            )
          }
          
          return (
            <PaginationItem key={page}>
              <PaginationLink 
                href="#" 
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(page as number)
                }}
                className="h-8 sm:h-10 w-8 sm:w-10 text-xs sm:text-sm"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage + 1)
              }}
              className="h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
