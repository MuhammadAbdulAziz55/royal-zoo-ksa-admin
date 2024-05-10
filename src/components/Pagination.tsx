"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CPagination = ({ totalPages }: { totalPages: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const router = useRouter();

  // url set
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Number of page links to display at once
  const pageLinksToShow = 5;

  // Calculate the range of page numbers to display
  const startPage = Math.max(1, currentPage - Math.floor(pageLinksToShow / 2));
  const endPage = Math.min(totalPages, startPage + pageLinksToShow - 1);

  console.log("totalPages totalPages", totalPages);

  const handlePageChange = (page: number) => {
    const newURL = createPageURL(page);
    router.push(newURL);
  };

  return (
    <Pagination >
      <PaginationContent>
        <PaginationItem>
          {currentPage === 1 ? (
            <PaginationPrevious />
          ) : (
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
            />
          )}
        </PaginationItem>

        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}

        {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={() => handlePageChange(startPage + index)}
              isActive={currentPage === startPage + index}
            >
              {startPage + index}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPages > 5 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          {currentPage === totalPages ? (
            <PaginationNext />
          ) : (
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    // <Pagination>
    //   <PaginationContent>
    //     <PaginationItem>
    //       {currentPage == 1 ? (
    //         <PaginationPrevious />
    //       ) : (
    //         <PaginationPrevious
    //           onClick={() => handlePageChange(currentPage - 1)}
    //         />
    //       )}
    //     </PaginationItem>
    //     {Array.from({ length: totalPages }).map((_, index) => (
    //       <PaginationItem key={index}>
    //         <PaginationLink
    //           onClick={() => handlePageChange(index + 1)}
    //           isActive={currentPage === index + 1}
    //         >
    //           {index + 1}
    //         </PaginationLink>
    //       </PaginationItem>
    //     ))}
    //     <PaginationItem>
    //       {currentPage == totalPages ? (
    //         <PaginationNext />
    //       ) : (
    //         <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
    //       )}
    //     </PaginationItem>
    //   </PaginationContent>
    // </Pagination>
  );
};
export default CPagination;
