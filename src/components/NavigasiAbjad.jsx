import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { pagesMinimAtom } from "./Pagination";

export default function NavigasiAbjad() {
  const location = useLocation();
  const pathname = location.pathname;
  const urlParams = new URLSearchParams(location.search);

  const setPageMinim = useSetRecoilState(pagesMinimAtom);

  const abjadParam = urlParams.get("abjad") ?? "a";
  const searchParam = urlParams.get("search");

  const navigate = useNavigate();
  const abjad = Array.from({ length: 26 }, (_, index) =>
    String.fromCharCode(97 + index)
  );

  const handleNavigation = (item) => {
    setPageMinim(Array.from({ length: 8 }, (_, index) => index + 1));
    navigate(
      `${
        pathname.startsWith("/kamus") ? "/kamus" : "/data-kamus"
      }?abjad=${item}&page=1`
    );
  };

  return (
    <div className="mt-6">
      <div className="text-sm flex flex-wrap justify-center">
        {abjad.map((item, i) => (
          <div key={i}>
            {i === 0 && <span>|</span>}
            <button
              onClick={() => handleNavigation(item)}
              className={`hover:text-blue-600 font-medium px-1.5 ${
                searchParam
                  ? item === searchParam[0]
                    ? "text-blue-600"
                    : ""
                  : item === abjadParam
                  ? "text-blue-600"
                  : ""
              }`}
            >
              {item.toUpperCase()}
            </button>
            <span>|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
