import { useRecoilState, useSetRecoilState } from "recoil";
import {
  abjadState,
  dataKamusState,
  isLoadKamusState,
  pageState,
  searchKamusAtom,
} from "../lib/recoil";
import { useEffect, useState } from "react";
import { axiosCustom } from "../lib/axiosCustom";
import {
  FaBackspace,
  FaEdit,
  FaRegWindowClose,
  FaSave,
  FaTrash,
  FaWindowClose,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function TabelKamus() {
  const [dataKamus, setDataKamus] = useRecoilState(dataKamusState);
  const [page, setPage] = useRecoilState(pageState);
  const [abjad, setAbjad] = useRecoilState(abjadState);
  const [search, setSearch] = useRecoilState(searchKamusAtom);
  const setIsLoadKamus = useSetRecoilState(isLoadKamusState);

  useEffect(() => {
    fetchData();
  }, [page, abjad]);

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

  const deleteDataKamus = async (id) => {
    if (confirm("Hapus data?")) {
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
  };

  const EditableKamusItem = ({ item, deleteDataKamus }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
      setIsEditing(!isEditing);
    };

    return (
      <div className="relative flex items-center col-span-6 md:col-span-3 hover:bg-gray-50 group">
        <input
          value={item.kata}
          readOnly={!isEditing}
          className={`border w-[99%] ${
            isEditing ? "border-gray-500 outline-none" : "border-white"
          } ${!isEditing ? "outline-none" : ""}`}
        />

        <span className="hidden group-hover:flex absolute right-1 space-x-0.5">
          {isEditing ? (
            <>
              <FaWindowClose
                onClick={handleEditClick}
                className="inline-block bg-gray-500 px-1 py-0.5 text-lg rounded text-white cursor-pointer"
              />
              <FaSave className="inline-block bg-blue-500 px-1 py-0.5 text-lg rounded text-white cursor-pointer" />
            </>
          ) : (
            <>
              <FaEdit
                onClick={handleEditClick}
                className="inline-block bg-yellow-500 px-1 py-0.5 text-lg rounded text-white cursor-pointer"
              />
              <FaTrash
                onClick={() => deleteDataKamus(item.id)}
                className="inline-block bg-red-500 px-1 py-0.5 text-lg rounded text-white cursor-pointer"
              />
            </>
          )}
        </span>
      </div>
    );
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
          className="flex items-center self-center w-full md:w-64"
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
                className="relative flex items-center col-span-6 md:col-span-3 hover:bg-gray-50 group"
                key={i}
              >
                <input
                  value={item.kata}
                  readOnly
                  className="border border-white outline-none"
                />

                <span className="hidden group-hover:flex absolute right-1.5 space-x-0.5">
                  <FaEdit className="inline-block bg-yellow-500 px-1 py-0.5 text-lg rounded text-white cursor-pointer" />
                  <FaTrash
                    onClick={() => deleteDataKamus(item.id)}
                    className="inline-block bg-red-500 px-1 py-0.5 text-lg rounded text-white cursor-pointer"
                  />
                </span>
              </div>
              // <EditableKamusItem
              //   key={i}
              //   item={item}
              //   deleteDataKamus={deleteDataKamus}
              // />
            ))}
          </div>
        )}
      </div>

      <hr className="h-px bg-gray-300 border-0" />
    </div>
  );
}
