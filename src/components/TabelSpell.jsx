import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { resultApiState, saranKataState } from "../lib/recoil";

export default function TableSpell() {
  const containerRef = useRef(0);

  const [saranKata, setSaranKata] = useRecoilState(saranKataState);
  const resultApi = useRecoilValue(resultApiState);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [resultApi]);

  const handleAbaikan = (i) => {
    const newSaranKata = [...saranKata];
    newSaranKata[i] = { ...newSaranKata[i], target: "-" };

    setSaranKata(newSaranKata);
    console.log(saranKata);
  };

  const handlePilihSaran = (e, i) => {
    const newSaranKata = [...saranKata]; // Membuat salinan array
    newSaranKata[i] = { ...newSaranKata[i], target: e.target.value }; // Memperbarui nilai target

    setSaranKata(newSaranKata);
  };

  return (
    <section className="container mx-auto font-mono">
      <div className="w-full overflow-hidden rounded-lg shadow-lg">
        <div
          className="w-full overflow-x-auto overflow-y-scroll max-h-[440px] border-2"
          ref={containerRef}
        >
          <table className="w-full">
            <thead>
              <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                <th className="px-4 py-3">Kata Typo</th>
                <th className="px-4 py-3">Saran Kata</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {resultApi.length === 0 ? (
                <tr className="text-gray-700">
                  <td
                    colSpan={2}
                    className="px-4 py-3 text-sm font-semibold border text-center"
                  >
                    No data
                  </td>
                </tr>
              ) : (
                resultApi.map((item, i) => (
                  <tr className="text-gray-700" key={i}>
                    <td className="text-wrap w-[50%] px-4 py-3 text-sm font-semibold border">
                      <span className="text-red-500">{item[0].str}</span>
                      {item[0].target != "-" && (
                        <button
                          onClick={() => handleAbaikan(i)}
                          className={
                            "px-2 p-0.5 float-right rounded text-white hover:bg-red-500 " +
                            (saranKata[i].target === "-"
                              ? "bg-red-500"
                              : "bg-red-300")
                          }
                        >
                          x
                        </button>
                      )}
                    </td>
                    <td className="w-[50%] px-4 py-3 font-semibold border">
                      {item[0].target == "-" ? (
                        <p className="px-3">-</p>
                      ) : (
                        <select
                          // onChange={(e) => pilihSaran(e, i)}
                          onChange={(e) => handlePilihSaran(e, i)}
                          value={saranKata[i].target}
                          className="border-none font-bold text-sm mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        >
                          {item.map((str, j) => (
                            <option
                              key={j}
                              value={str.target}
                              className="text-black"
                            >
                              {str.target} ({str.similarity}%)
                            </option>
                          ))}
                          <option value="-" className="text-black">
                            Abaikan
                          </option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
