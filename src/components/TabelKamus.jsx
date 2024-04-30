import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosCustom } from "../lib/axiosCustom";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { pagesMinimAtom } from "./Pagination";
import { dataKamusAtom, searchKamusAtom } from "../views/Kamus";

export default function TabelKamus({ fetchData }) {
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(true);
  const [editId, setEditId] = useState("");
  const [valueEditId, setValueEditId] = useState("");
  const dataKamus = useRecoilValue(dataKamusAtom);
  const [searchKamus, setSearchKamus] = useRecoilState(searchKamusAtom);
  const setPagesMinim = useSetRecoilState(pagesMinimAtom);

  const location = useLocation();
  const pathname = location.pathname;

  const handleClick = (e) => {
    e.preventDefault();
    setPagesMinim(Array.from({ length: 8 }, (_, index) => index + 1));

    if (searchKamus == "") {
      if (pathname.startsWith("/kamus")) navigate("/kamus");
      else navigate("/data-kamus");
    } else {
      if (pathname.startsWith("/kamus"))
        navigate(`/kamus?search=${searchKamus}&page=1`);
      else navigate(`/data-kamus?search=${searchKamus}&page=1`);
    }
  };

  // hapus data
  const handleDeleteKata = async (id) => {
    if (confirm("Hapus data?")) {
      const res = await axiosCustom.post(`/hapus-kata/${id}`);

      toast.success(res.data.message);
      fetchData();
    }
  };

  // update kamus
  const handleUpdateKamus = async (itemKataId, itemKata) => {
    if (valueEditId == "" || itemKata == valueEditId) {
      // alert("koosong");
    } else {
      try {
        const response = await axiosCustom.post(`/update-kata/${itemKataId}`, {
          kata: valueEditId,
        });

        if (response.status === 200) {
          toast.success(response.data.message);
          fetchData();
        } else if (response.status === 409) {
          toast.error(response.data.message); // Menampilkan pesan bahwa kata sudah ada di database
        } else {
          toast.error("Error occurred."); // Menampilkan pesan umum untuk kesalahan lainnya
        }
      } catch (error) {
        toast.error("Error occurred."); // Menampilkan pesan umum untuk kesalahan lainnya
        console.error("Error:", error);
      }
    }
    setEditId("");
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-3">
        <small className="block">
          Total kata : <b>{dataKamus.totalKamus.toLocaleString()} data</b>
        </small>

        <form className="flex items-center">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                />
              </svg>
            </div>
            <input
              onChange={(e) => setSearchKamus(e.target.value)}
              type="text"
              id="simple-search"
              className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:border-black block w-full ps-10 p-2"
              placeholder="Cari kata ..."
              autoComplete="off"
            />
          </div>
          <button
            onClick={handleClick}
            type="submit"
            className="p-2 ms-2 text-sm font-medium text-white bg-[#64A1AD] rounded-lg border border-[#64A1AD] focus:ring-1 focus:outline-none focus:ring-[#64A1AD]"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </form>
      </div>

      <hr className="h-px bg-gray-400 border-0" />
      <div className="h-full md:h-[292px]">
        {dataKamus.data != 0 ? (
          <div className="grid grid-cols-12 text-sm my-3">
            {dataKamus.data.map((item, i) => (
              <div
                className={`${
                  editId == "" ? "group" : ""
                } relative col-span-6 md:col-span-3 hover:bg-gray-50`}
                key={i}
              >
                {editId == item.id ? (
                  <input
                    className="border border-gray-400 outline-none w-[90%]"
                    onMouseEnter={() => setValueEditId(item.kata)}
                    onChange={(e) => setValueEditId(e.target.value)}
                    value={valueEditId}
                  />
                ) : (
                  <input
                    value={item.kata}
                    readOnly
                    className="border border-white outline-none"
                  />
                )}

                {pathname.startsWith("/data-kamus") &&
                  isAuth &&
                  editId != item.id && (
                    <div className="text-[9px] space-x-0.5 absolute right-2 top-0">
                      <button
                        onClick={() => setEditId(item.id)}
                        className={`${
                          editId != "" ? "cursor-text pointer-events-none" : ""
                        } bg-yellow-400 text-black rounded px-2 py-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-100 hover:bg-yellow-500`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteKata(item.id)}
                        className={`${
                          editId != "" ? "cursor-text pointer-events-none" : ""
                        } bg-red-500 text-white rounded px-2 py-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-100 hover:bg-red-600`}
                      >
                        Hapus
                      </button>
                    </div>
                  )}

                {pathname.startsWith("/data-kamus") && editId == item.id && (
                  <button
                    onClick={() => handleUpdateKamus(item.id, item.kata)}
                    className="text-[9px] absolute top-0 right-2 bg-blue-500 text-white rounded-tr rounded-br px-2 py-[0.9px] transition-opacity duration-100 hover:bg-blue-600"
                  >
                    Save
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-12 h-full place-content-center text-sm my-3 text-center text-gray-500">
            <div className="col-span-12">Data tidak ditemukan.</div>
          </div>
        )}
      </div>
      <hr className="h-px bg-gray-300 border-0" />
    </div>
  );
}
