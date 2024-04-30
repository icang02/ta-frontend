import { useLocation, useNavigate } from "react-router-dom";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { dataKamusAtom } from "../views/Kamus";

export const pagesMinimAtom = atom({
  key: "pagesMinim",
  default: Array.from({ length: 8 }, (_, index) => index + 1),
});

export default function Pagination({ page, abjad, search }) {
  // use state
  const [pagesMinim, setPagesMinim] = useRecoilState(pagesMinimAtom);

  // variabel
  const navigate = useNavigate();
  const dataKamus = useRecoilValue(dataKamusAtom);
  const { hasNextPage, totalPages } = dataKamus.metadata;
  const currentPage = Math.min(Math.max(parseInt(page || 1), 1), totalPages);

  const location = useLocation();
  const pathname = location.pathname;

  // function
  const firstPage = () => {
    setPagesMinim(Array.from({ length: 8 }, (_, index) => 1 + index));

    if (search == null) {
      return navigate(
        `${
          pathname.startsWith("/kamus") ? "/kamus" : "/data-kamus"
        }?abjad=${abjad}`
      );
    } else {
      return navigate(
        `${
          pathname.startsWith("/kamus") ? "/kamus" : "/data-kamus"
        }?search=${search}&page=${1}`
      );
    }
  };

  const LastPage = () => {
    if (totalPages % 8 == 0) {
      navigate(
        `${pathname.startsWith("/kamus") ? "/kamus" : "/data-kamus"}?abjad=${
          abjad ?? "a"
        }&page=${totalPages}`
      );
    } else {
      setPagesMinim(
        Array.from(
          { length: totalPages % 8 },
          (_, index) => totalPages + 1 - (totalPages % 8) + index
        )
      );
    }

    if (search == null) {
      navigate(
        `${pathname.startsWith("/kamus") ? "/kamus" : "/data-kamus"}?abjad=${
          abjad ?? "a"
        }&page=${totalPages}`
      );
    } else {
      navigate(
        `${
          pathname.startsWith("/kamus") ? "/kamus" : "/data-kamus"
        }?search=${search}&page=${totalPages}`
      );
    }
  };

  const prevPage = () => {
    const prevPageNumber = currentPage - 1;
    const abjadParam = abjad || "a";

    if (search == null) {
      navigate(
        `${
          pathname.startsWith("/kamus") ? "/kamus" : "/data-kamus"
        }?abjad=${abjadParam}&page=${prevPageNumber}`
      );
    } else {
      navigate(
        `${
          pathname.startsWith("/kamus") ? "/kamus" : "/data-kamus"
        }?search=${search}&page=${prevPageNumber}`
      );
    }

    if (currentPage == pagesMinim[0]) {
      const newPages = Array.from(
        { length: 8 },
        (_, index) => currentPage - 8 + index
      );
      return setPagesMinim(newPages);
    }
  };

  const nextPage = () => {
    const nextPageNumber = currentPage + 1;
    const abjadParam = abjad || "a";

    if (search == null) {
      navigate(
        `${
          pathname.startsWith("/kamus") ? "/kamus" : "/data-kamus"
        }?abjad=${abjadParam}&page=${nextPageNumber}`
      );
    } else {
      navigate(
        `${
          pathname.startsWith("/kamus") ? "/kamus" : "/data-kamus"
        }?search=${search}&page=${nextPageNumber}`
      );
    }

    const remainingPages = totalPages - currentPage;

    if (currentPage == pagesMinim[pagesMinim.length - 1]) {
      const pagesToAdd = Math.min(remainingPages, 8);
      const newPages = Array.from(
        { length: pagesToAdd },
        (_, index) => nextPageNumber + index
      );
      return setPagesMinim(newPages);
    }
  };

  const navigationPage = (p) => {
    if (search == null) {
      return navigate(
        `${pathname.startsWith("/kamus") ? "/kamus" : "/data-kamus"}?abjad=${
          abjad || "a"
        }&page=${p}`
      );
    } else {
      return navigate(
        `${
          pathname.startsWith("/kamus") ? "/kamus" : "/data-kamus"
        }?search=${search}&page=${p}`
      );
    }
  };

  return (
    <div className="select-none flex flex-col space-y-2 items-center flex-wrap justify-center text-black mt-5">
      <nav
        aria-label="Pagination"
        className="relative z-0 inline-flex space-x-2 flex-wrap rounded-md"
      >
        <button
          onClick={firstPage}
          className={`rounded-md border border-gray-400 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 ${
            currentPage === 1 ? "pointer-events-none bg-gray-100" : ""
          }`}
        >
          First
        </button>

        <button
          onClick={prevPage}
          className={`rounded-md border border-gray-400 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 ${
            currentPage === 1 ? "pointer-events-none bg-gray-100" : ""
          }`}
        >
          Previous
        </button>

        {totalPages >= 8 ? (
          <div>
            {pagesMinim.map((item) => (
              <button
                key={item}
                onClick={() => navigationPage(item)}
                className={`relative inline-flex items-center border border-gray-400 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 ${
                  item === currentPage ? "pointer-events-none bg-gray-100" : ""
                } ${item === 0 ? "rounded-l-md" : ""} ${
                  item === item - 1 ? "rounded-r-md" : ""
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        ) : (
          <div>
            {Array.from({ length: totalPages }, (_, index) => 1 + index).map(
              (p, i) => (
                <button
                  onClick={() => navigationPage(p)}
                  key={p}
                  className={`relative inline-flex items-center border border-gray-400 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 ${
                    p === currentPage ? "pointer-events-none bg-gray-100" : ""
                  } ${i === 0 ? "rounded-l-md" : ""} ${
                    i === totalPages.length - 1 ? "rounded-r-md" : ""
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>
        )}

        <button
          onClick={nextPage}
          className={`rounded-md border border-gray-400 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 ${
            !hasNextPage ? "pointer-events-none bg-gray-100" : ""
          }`}
        >
          Next
        </button>

        <button
          onClick={LastPage}
          className={`rounded-md border border-gray-400 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 ${
            currentPage === totalPages ? "pointer-events-none bg-gray-100" : ""
          }`}
        >
          Last
        </button>
      </nav>

      <p className="text-xs text-slate-600">
        Page {page ?? 1} of {totalPages}
      </p>
    </div>
  );
}
