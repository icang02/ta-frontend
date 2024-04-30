import React, { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { dataKamusAtom } from "./Kamus";
import { useSetRecoilState } from "recoil";
import { axiosCustom } from "../lib/axiosCustom";
import TabelKamus from "../components/TabelKamus";
import Pagination from "../components/Pagination";
import NavigasiAbjad from "../components/NavigasiAbjad";
import { toast } from "react-toastify";
import { isTokenExpired } from "./Dashboard";

export default function DashboardKamus() {
  const [name, setName] = useState("Admin");

  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);

  const abjadParam = urlParams.get("abjad");
  const pageParam = urlParams.get("page");
  const searchParam = urlParams.get("search");

  const setData = useSetRecoilState(dataKamusAtom);
  const [loading, setLoading] = useState(true);

  // form tambah variabel
  const [inputs, setInputs] = useState([{ value: "" }]);

  useEffect(() => {
    fetchData();
  }, [abjadParam, pageParam, searchParam]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      return navigate("/login");
    } else {
      return navigate(location.pathname);
    }
  }, []);

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

  const handleAddInput = () => {
    setInputs([...inputs, { value: "" }]);
  };

  const handleRemoveInput = (i) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(i, 1);
    setInputs(updatedInputs);
  };

  const handleChangeInput = (i, e) => {
    const values = [...inputs];
    values[i].value = e.target.value;
    setInputs(values);
  };

  const handleSubmitForm = async () => {
    const valueInputs = inputs.map((item) => item.value.trim());

    const isInputEmpty = valueInputs.some((value) => value == "");
    if (isInputEmpty) {
      return toast.info("Isi form input.");
    }

    try {
      const res = await axiosCustom.post("/tambah-kata", {
        inputs: valueInputs,
      });

      toast.success(res.data.message);

      setInputs([{ value: "" }]);
      fetchData();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.info(error.response.data.message);
      } else {
        toast.error("Terjadi kesalahan saat menambahkan kata.");
      }
    }
  };

  return (
    <div className="font-roboto min-h-[100vh] bg-[#E6E9EC]">
      <Sidebar name={name} />

      <main className="min-h-screen w-[calc(100%-244px)] float-right pt-5 pb-5 px-7">
        <Breadcrumb title="Kamus" />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <div className="rounded-lg bg-white py-7 px-8 shadow text-slate-800">
              {/* <button className="bg-blue-500 rounded px-3.5 py-2 text-white text-xs hover:bg-blue-600 transition-all">
                Tambah Data
              </button> */}
              <h1 className="font-bold text-2xl">Data Kamus</h1>
              <div className="mt-0.5 h-0.5 w-16 bg-green-600"></div>

              {/* data daftar kamus */}
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <TabelKamus fetchData={fetchData} />
                  <Pagination
                    page={pageParam}
                    abjad={abjadParam}
                    search={searchParam}
                  />

                  <NavigasiAbjad />
                </>
              )}
            </div>
          </div>
          <div className="col-span-3">
            <div className="rounded-lg bg-white py-7 px-8 shadow text-slate-800">
              <h4 className="font-bold">Tambah Data</h4>
              <div className="mt-0.5 h-0.5 w-11 bg-green-600"></div>

              <div>
                <div className="max-w-md mx-auto mt-4">
                  <div className="flex flex-col space-y-2">
                    {inputs.map((input, i) => (
                      <div className="relative group" key={i}>
                        <input
                          type="text"
                          value={input.value}
                          onChange={(e) => handleChangeInput(i, e)}
                          className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-400 rounded py-2 text-sm px-4 leading-tight focus:outline-none focus:bg-white"
                          placeholder="Masukkan kata..."
                        />
                        {inputs.length > 1 && (
                          <button
                            onClick={() => handleRemoveInput(i)}
                            className="group-hover:opacity-100 opacity-0 absolute top-1/2 -translate-y-1/2 right-1.5 font-bold text-[10px] text-red-500 rounded bg-white hover:bg-gray-100 border border-red-400 px-2.5 py-1"
                          >
                            -
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-2.5">
                  <button
                    onClick={handleSubmitForm}
                    className="text-[10px] rounded bg-blue-500 hover:bg-blue-600 transition-all text-white px-2.5 py-1"
                  >
                    Simpan
                  </button>
                  <div className="flex space-x-1">
                    {inputs.length < 10 && (
                      <button
                        onClick={handleAddInput}
                        className="text-[10px] rounded bg-white hover:bg-gray-100 border border-gray-400 text-black px-2.5 py-1"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
