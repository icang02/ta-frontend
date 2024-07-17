import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  abjadState,
  dataKamusState,
  editingItemState,
  isLoadKamusState,
  pageState,
  searchKamusAtom,
} from "../lib/recoil";
import { useEffect, useState } from "react";
import { axiosCustom } from "../lib/axiosCustom";
import { FaEdit, FaSave, FaTrash, FaWindowClose } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

export default function TabelKamus() {
  const [dataKamus, setDataKamus] = useRecoilState(dataKamusState);
  const page = useRecoilValue(pageState);
  const abjad = useRecoilValue(abjadState);
  const [search, setSearch] = useRecoilState(searchKamusAtom);
  const setIsLoadKamus = useSetRecoilState(isLoadKamusState);
  const [editingItem, setEditingItem] = useRecoilState(editingItemState);

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    fetchData();
  }, [page, abjad]);

  useEffect(() => {
    return () => {
      setEditingItem(null);
    };
  }, []);

  const fetchData = async (take = 50) => {
    setIsLoadKamus(true);

    const response = await axiosCustom.post("/kamus", {
      take,
      skip: (page - 1) * take,
      abjad: abjad,
      search: search,
    });

    const result = {
      data: response.data.kamus,
      metadata: {
        hasNextPage: (page - 1) * take + take < response.data.totalKamusAbjad,
        totalPages: Math.ceil(response.data.totalKamusAbjad / take),
        itemPerPage: take,
        totalData: response.data.totalKamusAbjad,
      },
      totalKamus: response.data.totalKamus,
    };

    setDataKamus(result);
    setIsLoadKamus(false);
  };

  const submitSearchKamus = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleEditingItem = (i, kata) => {
    setEditingItem(i);
    setValueEdit(kata);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const [valueEdit, setValueEdit] = useState("");

  const handleChangeEditInput = (e) => {
    setValueEdit(e.target.value);
  };

  const handleUpdateKamus = async (id, kata) => {
    if (valueEdit == kata || valueEdit == "") {
      setEditingItem(null);
    } else {
      setEditingItem(null);

      try {
        const response = await axiosCustom.post(`/update-kata/${id}`, {
          kata: valueEdit.trim(),
        });

        if (response.status === 200) {
          toast.success(response.data.message);
          fetchData();
        } else if (response.status === 409) {
          toast.error(response.data.message);
        } else {
          toast.error("Error occurred.");
        }
      } catch (error) {
        toast.error("Error occurred.");
        console.error("Error:", error);
      }
    }
  };

  const showSwal = (id, kata) => {
    Swal.fire({
      title: "Hapus data ini?",
      text: `Kata "${kata}" akan dihapus!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Kembali",
      confirmButtonText: "Yes, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosCustom.post(`/hapus-kata/${id}`);

          toast.success(res.data.message);
          fetchData();
        } catch (error) {
          if (error.response && error.response.status === 404) {
            toast.info(error.response.data.message);
          } else {
            toast.error("Terjadi kesalahan saat menambahkan kata.");
          }
        }
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 items-end mb-3">
        {/* show total for dictionary data */}
        <small className="block self-start md:self-end">
          Total kata :&nbsp;
          {Object.keys(dataKamus).length == 0 ? (
            <b className="animate-pulse">.........</b>
          ) : (
            <b>{Intl.NumberFormat("id").format(dataKamus.totalKamus)} data</b>
          )}
        </small>

        {/* form for search dictionary */}
        <form
          onSubmit={submitSearchKamus}
          className={`${
            editingItem != null && "pointer-events-none"
          } flex items-center self-center w-full md:w-64`}
        >
          <div className="relative w-full">
            <input
              onKeyUp={(e) => setSearch(e.target.value)}
              type="text"
              className="bg-gray-50 border outline-none border-gray-400 text-gray-900 text-sm rounded-lg focus:border-black block w-full ps-4 p-2"
              placeholder="Cari kata ..."
              autoComplete="off"
            />
          </div>
          <button
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

      {/* dictionary dividing line */}
      <hr className="h-px bg-gray-400 border-0" />

      {/* container for show dictionary data */}
      <div className="h-full md:h-[292px]">
        {Object.keys(dataKamus).length == 0 ? (
          <div className="grid grid-cols-12 h-full place-content-center text-sm my-3 text-center text-gray-500">
            <div className="col-span-12 animate-pulse">Loading data...</div>
          </div>
        ) : dataKamus.data.length == 0 ? (
          <div className="grid grid-cols-12 h-full place-content-center text-sm my-3 text-center text-gray-500">
            <div className="col-span-12">Data tidak ditemukan.</div>
          </div>
        ) : (
          <div className="grid grid-cols-12 text-sm my-3">
            {dataKamus.data.map((item, i) => (
              <div
                key={i}
                className="group relative flex items-center col-span-6 md:col-span-3 hover:bg-gray-50"
              >
                <input
                  value={editingItem == i ? valueEdit : item.kata}
                  onChange={(e) => handleChangeEditInput(e)}
                  readOnly={editingItem != i}
                  className={`${
                    editingItem == i
                      ? "border border-gray-500"
                      : "border border-white"
                  } outline-none w-[99%]`}
                />

                {pathname.startsWith("/data-kamus") && (
                  <span
                    className={`${editingItem == i ? "block" : "hidden"} ${
                      editingItem == null && "group-hover:flex"
                    } absolute right-1 space-x-0.5`}
                  >
                    <div
                      className={`${editingItem != null ? "block" : "hidden"}`}
                    >
                      <FaWindowClose
                        onClick={(e) => handleCancelEdit(e)}
                        className="inline-block mx-[1px] bg-gray-500 px-1 py-1 text-lg rounded text-white cursor-pointer"
                      />
                      <FaSave
                        onClick={() => handleUpdateKamus(item.id, item.kata)}
                        className="inline-block mx-[1px] bg-blue-500 px-1 py-1 text-lg rounded text-white cursor-pointer"
                      />
                    </div>

                    <div
                      className={`${editingItem == null ? "block" : "hidden"}`}
                    >
                      <FaEdit
                        onClick={() => handleEditingItem(i, item.kata)}
                        className="inline-block mx-[1px] bg-yellow-500 px-1 py-1 text-lg rounded text-white cursor-pointer"
                      />
                      <FaTrash
                        onClick={() => showSwal(item.id, item.kata)}
                        className="inline-block mx-[1px] bg-red-500 px-1 py-1 text-lg rounded text-white cursor-pointer"
                      />
                    </div>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="h-px bg-gray-300 border-0" />
    </div>
  );
}
