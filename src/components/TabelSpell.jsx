import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  fileNameState,
  jumlahKataValidState,
  resultApiState,
  saranKataState,
} from "../lib/recoil";
import { axiosCustom } from "../lib/axiosCustom";

export default function TableSpell() {
  const containerRef = useRef(0);

  const [saranKata, setSaranKata] = useRecoilState(saranKataState);
  const resultApi = useRecoilValue(resultApiState);
  const jumlahKataValid = useRecoilValue(jumlahKataValidState);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [resultApi]);

  const handleAbaikan = (i) => {
    const newSaranKata = [...saranKata];
    newSaranKata[i] = { ...newSaranKata[i], target: "-" };

    setSaranKata(newSaranKata);
  };

  const handlePilihSaran = (e, i) => {
    const newSaranKata = [...saranKata]; // Membuat salinan array
    newSaranKata[i] = { ...newSaranKata[i], target: e.target.value }; // Memperbarui nilai target

    setSaranKata(newSaranKata);
  };

  const [show, setShow] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const fileName = useRecoilValue(fileNameState);
  const [x, setX] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleCheckWord = async (word) => {
    setShow(false);

    if (x == 0) {
      setShow(true);
      setLoading(true);

      try {
        const response = await axiosCustom.post("/check-word", {
          fileName,
          word,
        });

        setHtmlContent(response.data.html);
      } catch (error) {
        console.error("Error fetching or converting file:", error);
      }
      setX((prev) => prev + 1);
      setLoading(false);
    } else {
      setTimeout(async () => {
        setShow(true);
        setLoading(true);

        try {
          const response = await axiosCustom.post("/check-word", {
            fileName,
            word,
          });

          setHtmlContent(response.data.html);
        } catch (error) {
          console.error("Error fetching or converting file:", error);
        }
        setLoading(false);
      }, 300);
    }
  };

  const handleClose = () => {
    setShow(false);
    setX(0);
    setTimeout(() => {
      setHtmlContent("");
    }, 500);
  };

  return (
    <section className="container mx-auto font-roboto">
      <div
        className={`${
          !show ? "opacity-0 pointer-events-none" : "opacity-100"
        } transition-all duration-500 sticky md:absolute -translate-y-[14px] md:translate-y-0 md:-translate-x-[327.5px] border border-slate-500 w-[93%] md:w-72 p-5 text-sm bg-white rounded`}
      >
        {!loading ? (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        ) : (
          <div className="animate-pulse">
            <div className="h-3 bg-gray-300 rounded mb-3 w-[95%]"></div>
            <div className="h-3 bg-gray-300 rounded mb-1 w-3/4"></div>
          </div>
        )}
        <span
          onClick={() => handleClose()}
          className="cursor-pointer absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 text-sm rounded"
        >
          x
        </span>
      </div>

      <div className="w-full overflow-hidden rounded-lg shadow-lg">
        <div
          className="w-full overflow-x-auto overflow-y-scroll max-h-[422px] border-2"
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
                      <span
                        className="cursor-pointer"
                        onClick={() => handleCheckWord(item.string)}
                      >
                        {item.string}
                      </span>

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
                                {str.target} ({str.similarity}%) — (
                                {str.distance})
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

      {jumlahKataValid && (
        <div className="text-sm shadow mt-0.5 px-3 py-2 text-right bg-white border w-full text-black font-medium">
          Total ejaan yang benar :{" "}
          <span className="font-bold">{jumlahKataValid} kata</span>
        </div>
      )}
    </section>
  );
}
