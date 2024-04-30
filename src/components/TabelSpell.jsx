import React, { useEffect } from "react";
import { resultApiState } from "./form/FileInput";
import { atom, useRecoilState, useRecoilValue } from "recoil";

export const dataDownloadState = atom({
  key: "dataDownloadState",
  default: [],
});

export default function TableSpell() {
  const [dataDownload, setDataDowload] = useRecoilState(dataDownloadState);
  const resultApi = useRecoilValue(resultApiState);

  useEffect(() => {
    let data = [];
    resultApi.map((obj) => {
      let y = {
        str: obj[0].str,
        target: obj[0].target,
      };
      data.push(y);
    });

    setDataDowload(data);
  }, [resultApi]);

  const pilihSaran = (e, i) => {
    const newDataDownload = [...dataDownload]; // Membuat salinan array
    newDataDownload[i] = { ...newDataDownload[i], target: e.target.value }; // Memperbarui nilai target

    setDataDowload(newDataDownload);
    // console.log(dataDownload);
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
