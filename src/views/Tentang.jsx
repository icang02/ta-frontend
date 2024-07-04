import React, { useState } from "react";

export default function Tentang() {
  const [inputType, setInputType] = useState(true);

  const data = [
    {
      title: "Nama Lengkap",
      value: "Ilmi Faizan",
    },
    {
      title: "Kota",
      value: "Kendari",
    },
    {
      title: "Provinsi",
      value: "Sulawesi Tenggara",
    },
    {
      title: "Jurusan",
      value: "Teknik Informatika",
    },
    {
      title: "Fakultas",
      value: "Teknik",
    },
    {
      title: "Universitas",
      value: "Universitas Halu Oleo",
    },
  ];

  return (
    <div className="min-h-screen max-w-6xl mx-auto pt-[90px] md:pt-[100px] px-4 md:px-0">
      <h1 className="font-bold text-xl text-center mb-4">Tentang</h1>
      <div className="mt-3 flex justify-center">
        <button
          onClick={() => setInputType(true)}
          className={`${
            inputType
              ? "bg-main text-slate-100 border border-main"
              : "bg-white text-black border border-black border-opacity-40 hover:border-opacity-60 text-opacity-80"
          } bg-main text-sm px-4 py-2 rounded-s-md font-bold transition-all border-e-0`}
        >
          SpelCek
        </button>
        <button
          onClick={() => setInputType(false)}
          className={`${
            !inputType
              ? "bg-main text-slate-100 border border-main"
              : "bg-white text-black border border-black border-opacity-40 hover:border-opacity-60 text-opacity-80"
          } bg-main text-sm px-4 py-2 rounded-e-md font-bold transition-all border-s-0`}
        >
          Developer
        </button>
      </div>

      <div className="mt-10 max-w-3xl mx-auto">
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            {inputType ? (
              <>
                <h1 className="leading-6 md:leading-normal font-bold text-slate-900 text-lg md:text-xl text-center mb-8 md:mb-10">
                  Sistem Deteksi Kesalahan Ejaan Pada Dokumen Jurnal Ilmiah
                  Menggunakan Kombinasi Algoritma Boyer Moore dan Damerau
                  Levenshtein Distance
                </h1>
                <div className="text-sm md:text-base flex flex-col space-y-6 text-slate-900 px-2 md:px-10 text-justify">
                  <p className="leading-relaxed">
                    SpelCek merupakan sebuah platform yang dirancang untuk
                    mendeteksi kesalahan ejaan dalam dokumen jurnal ilmiah.
                    Website ini menggunakan Algoritma Boyer Moore dan Algoritma
                    Damerau-Levenshtein Distance dalam memberikan saran kata.
                  </p>
                  <p className="leading-relaxed">
                    SpelCek memberikan kemudahan bagi para penulis dan pembaca
                    jurnal ilmiah dalam mendeteksi dan memperbaiki kesalahan
                    ejaan yang mungkin terjadi dalam dokumen, sehingga
                    meningkatkan kualitas dan keakuratan tulisan ilmiah.
                  </p>
                </div>
              </>
            ) : (
              <table className="mx-auto text-sm md:text-base">
                <tbody>
                  {data.map((item, i) => (
                    <tr key={i}>
                      <td className="text-slate-900 py-1 pr-10 md:py-2">
                        {item.title}
                      </td>
                      <td className="px-2">:</td>
                      <td className="font-medium text-slate-900">
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
