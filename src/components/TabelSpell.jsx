import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { resultApiState, saranKataState } from "../lib/recoil";

export default function TableSpell() {
  const [saranKata, setSaranKata] = useRecoilState(saranKataState);
  const resultApi = useRecoilValue(resultApiState);

  const pilihSaran = (e, i) => {
    const newSaranKata = [...saranKata]; // Membuat salinan array
    newSaranKata[i] = { ...newSaranKata[i], target: e.target.value }; // Memperbarui nilai target

    setSaranKata(newSaranKata);
  };

  return (
    <section className="container mx-auto font-mono">
      <div className="w-full overflow-hidden rounded-lg shadow-lg">
        <div className="w-full overflow-x-auto overflow-y-scroll max-h-[440px] border-2">
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
                    <td className="px-4 py-3 text-sm font-semibold border">
                      <span className="text-red-500">{item[0].str}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold border">
                      {item[0].target == "-" ? (
                        <p className="px-3">-</p>
                      ) : (
                        <select
                          onChange={(e) => pilihSaran(e, i)}
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
