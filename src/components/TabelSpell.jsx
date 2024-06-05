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
    <section className="container mx-auto font-roboto">
      <div className="w-full overflow-hidden rounded-lg shadow-lg">
        <div
          className="w-full overflow-x-auto overflow-y-scroll max-h-[440px] border-2"
          ref={containerRef}
        >
          <table className="w-full">
            <thead>
              <tr className="text-sm font-medium tracking-wide text-left bg-gray-100 uppercase border-b border-gray-600">
                <th className="px-4 py-3">Kata Typo</th>
                <th className="px-4 py-3">Saran Kata</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {resultApi.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-3 text-sm font-medium border text-center"
                  >
                    No data
                  </td>
                </tr>
              ) : (
                resultApi.map((item, i) => (
                  <tr key={i}>
                    <td
                      className={`text-wrap w-[50%] px-4 py-3 text-sm font-medium border ${
                        item.suggestions.length > 1 &&
                        Array.isArray(item.suggestions)
                          ? "underline text-red-600"
                          : item.suggestions.length == 0
                          ? "text-slate-500"
                          : typeof item.suggestions === "object" ||
                            typeof item.suggestions === "string"
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {item.string}

                      {item.suggestions.length != 0 && (
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

                    <td className="w-[50%] px-4 py-3 font-medium border">
                      {item.suggestions.length == 0 ? (
                        <p className="px-3">-</p>
                      ) : (
                        <select
                          onChange={(e) => handlePilihSaran(e, i)}
                          value={saranKata[i].target}
                          className={`${
                            saranKata[i].target == "-"
                              ? "text-slate-500"
                              : "text-black"
                          } border text-sm mt-1 block w-full px-2.5 py-2 border-gray-300 rounded-md focus:outline-none focus:border-[#64A1AD]`}
                        >
                          {Array.isArray(item.suggestions) ? (
                            item.suggestions.map((str, j) => (
                              <option key={j} value={str.target}>
                                {str.target} ({str.similarity}%)
                              </option>
                            ))
                          ) : typeof item.suggestions === "object" ? (
                            <option
                              value={item.suggestions.target}
                              className="text-black"
                            >
                              {item.suggestions.target} (
                              {item.suggestions.similarity}%)
                            </option>
                          ) : typeof item.suggestions === "string" ? (
                            <option
                              value={item.suggestions}
                              className="text-black"
                            >
                              {item.suggestions}
                            </option>
                          ) : (
                            ""
                          )}

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
