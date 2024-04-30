import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TabelKamus from "../components/TabelKamus";
import NavigasiAbjad from "../components/NavigasiAbjad";
import Pagination from "../components/Pagination";
import { useLocation } from "react-router-dom";
import { axiosCustom } from "../lib/axiosCustom";
import { atom, useSetRecoilState } from "recoil";

export const dataKamusAtom = atom({
  key: "dataKamusAtom",
  default: {},
});
export const searchKamusAtom = atom({
  key: "searchKamusAtom",
  default: "",
});

export default function Kamus() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  const abjadParam = urlParams.get("abjad");
  const pageParam = urlParams.get("page");
  const searchParam = urlParams.get("search");

  const setData = useSetRecoilState(dataKamusAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [abjadParam, pageParam, searchParam]);

  const fetchData = async (take = 50, abjad = "a") => {
    const data = await axiosCustom.get("/kamus", {
      params: {
        take,
        skip: ((pageParam || 1) - 1) * take || 0,
        abjad: abjadParam || abjad,
        search: searchParam || null,
      },
    });

    const result = {
      data: data.data.kamus,
      metadata: {
        hasNextPage:
          ((pageParam ?? 1) - 1) * take + take < data.data.totalKamusAbjad,
        totalPages: Math.ceil(data.data.totalKamusAbjad / take),
        itemPerPage: take,
        totalData: data.data.totalKamusAbjad,
      },
      totalKamus: data.data.totalKamus,
    };

    setData(result);
    setLoading(false);
  };

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
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : (
                <>
                  <TabelKamus fetchData={fetchData} />
                  <Pagination
                    page={pageParam}
                    abjad={abjadParam}
                    search={searchParam}
                  />
                </>
              )}
            </div>
          </div>

          <NavigasiAbjad />
        </div>
      </div>
    </div>
  );
}
