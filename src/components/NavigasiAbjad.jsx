import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  abjadState,
  editingItemState,
  pageState,
  searchKamusAtom,
} from "../lib/recoil";

export default function NavigasiAbjad() {
  const arrAbjad = Array.from({ length: 26 }, (_, index) =>
    String.fromCharCode(97 + index)
  );
  const [abjad, setAbjad] = useRecoilState(abjadState);
  const resetPage = useResetRecoilState(pageState);
  const resetSearch = useResetRecoilState(searchKamusAtom);

  const handleMoveAbjad = (abjad) => {
    resetSearch();
    resetPage();
    setAbjad(abjad);
  };

  const editingItem = useRecoilValue(editingItemState);

  return (
    <div
      className={`${
        editingItem != null && "pointer-events-none"
      } select-none mt-6`}
    >
      <div className="text-sm flex flex-wrap justify-center">
        {arrAbjad.map((item, i) => (
          <div key={i}>
            {i === 0 && <span>|</span>}
            <button
              onClick={() => handleMoveAbjad(item)}
              className={`hover:text-blue-600 font-medium px-1.5 ${
                item == abjad && "text-blue-500"
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
