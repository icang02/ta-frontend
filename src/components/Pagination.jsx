import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import { editingItemState, pageState } from "../lib/recoil";

const Pagination = ({ totalPages }) => {
  const [currentPage, setCurrentPage] = useRecoilState(pageState);

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPage = totalPages;
    let startPage = currentPage > 8 ? currentPage - 4 : 1;
    let endPage = currentPage > 8 ? currentPage + 3 : 8;

    if (endPage > maxPage) {
      endPage = maxPage;
      startPage = maxPage - 7 > 0 ? maxPage - 7 : 1;
    }

    if (startPage > 1 && totalPages > 8) {
      pages.push(
        <button
          key={1}
          onClick={() => handleClick(1)}
          className={`${
            currentPage == 1
              ? "bg-gray-500 text-white"
              : "ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-600"
          } relative z-1 inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
        >
          1
        </button>
      );
      pages.push(
        <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
          ...
        </span>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={`${
            currentPage == i
              ? "bg-gray-500 text-white"
              : "ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-600"
          } relative z-1 inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
        >
          {i}
        </button>
      );
    }

    if (endPage < maxPage) {
      pages.push(
        <span
          key="ellipsis-end ring-1 ring-inset ring-gray-300 bg-blue-500"
          className="px-2"
        >
          ...
        </span>
      );
      pages.push(
        <button
          key={maxPage}
          onClick={() => handleClick(maxPage)}
          className={`${
            currentPage == maxPage
              ? "bg-indigo-600 text-white"
              : "ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-600"
          } relative z-1 inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
        >
          {maxPage}
        </button>
      );
    }

    return pages;
  };

  const editingItem = useRecoilValue(editingItemState);

  return (
    <nav
      className={`${
        editingItem != null && "pointer-events-none"
      } select-none mt-5 flex justify-center -space-x-px rounded-md shadow-sm`}
    >
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      >
        <span className="sr-only">Prev</span>
        <FaChevronLeft />
      </button>

      {renderPageNumbers()}

      {currentPage <= totalPages && (
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span className="sr-only">Next</span>
          <FaChevronRight />
        </button>
      )}
    </nav>
  );
};

export default Pagination;
