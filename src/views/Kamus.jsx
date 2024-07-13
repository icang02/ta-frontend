import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useRecoilValue, useResetRecoilState } from "recoil";
import {
  abjadState,
  dataKamusState,
  isLoadKamusState,
  pageState,
  searchKamusAtom,
} from "../lib/recoil";
import TabelKamus from "../components/TabelKamus";
import NavigasiAbjad from "../components/NavigasiAbjad";
import Pagination from "../components/Pagination";

export default function Kamus() {
  const resetPage = useResetRecoilState(pageState);
  const resetAbjad = useResetRecoilState(abjadState);
  const resetSearch = useResetRecoilState(searchKamusAtom);
  const dataKamus = useRecoilValue(dataKamusState);
  const isLoadKamus = useRecoilValue(isLoadKamusState);

  useEffect(() => {
    return () => {
      resetPage();
      resetAbjad();
      resetSearch();
    };
  }, []);

  return (
    <div className="font-roboto">
      <Navbar />

      <div className="min-h-screen">
        <div className="pt-[100px] pb-10 container mx-auto max-w-5xl px-3">
          <div className="grid grid-cols-12 px-2 md:px-16">
            <div className="col-span-12">
              <h1 className="font-bold text-xl text-center mb-7">
                Daftar Kamus
              </h1>
              <TabelKamus />

              {isLoadKamus && Object.keys(dataKamus).length === 0 ? (
                <p className="mt-4 text-sm text-center animate-pulse text-gray-700">
                  Loading...
                </p>
              ) : (
                <Pagination totalPages={dataKamus.metadata.totalPages} />
              )}
            </div>
          </div>

          <NavigasiAbjad />
        </div>
      </div>
    </div>
  );
}
