import React, { useEffect, useState } from "react";
import { axiosCustom } from "../../lib/axiosCustom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import {
  loadingUploadState,
  resultApiState,
  saranKataState,
} from "../../lib/recoil";

export default function FileInput() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusUpload, setStatusUpload] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [saranKata, setSaranKata] = useRecoilState(saranKataState);
  const setLoadingUpload = useSetRecoilState(loadingUploadState);

  const setResultApi = useSetRecoilState(resultApiState);
  const [errorFileInput, setErrorFileInput] = useState(null);

  useEffect(() => {
    setResultApi([]);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    setErrorFileInput("");
    setTime(0);
    setIsRunning(true);
    setLoadingUpload(true);

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    axiosCustom
      .post("/upload-file", formData)
      .then((response) => {
        toast.success("Upload successfully..");

        setStatusUpload(true);
        setFileName(response.data.fileName);
        setResultApi(response.data.suggestWord);

        setSaranKata(
          response.data.suggestWord.map((item) => ({
            str: item.string,
            target:
              item.suggestions.length > 1 && Array.isArray(item.suggestions)
                ? item.suggestions[0].target
                : typeof item.suggestions === "object"
                ? item.suggestions.target
                : typeof item.suggestions === "string" && item.suggestions,
          }))
        );
        // console.log(response.data.suggestWord);
      })
      .catch((error) => {
        setErrorFileInput(error.response.data.message);
        // console.log(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
        setIsRunning(false);
        setLoadingUpload(false);
      });
  };

  const handleDownload = async () => {
    setLoadingDownload(true);

    const getCurrentDate = () => {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };

    const currentDate = getCurrentDate();
    const randomNumber = Math.floor(Math.random() * 10000);
    const fileNameDownload = `${fileName.replace(
      ".docx",
      ""
    )}-${currentDate}-${randomNumber}.docx`;

    axiosCustom({
      url: "/download-file",
      method: "POST",
      responseType: "blob",
      data: { fileName, saranKata },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${fileNameDownload}`);
        document.body.appendChild(link);
        link.click();
        setLoadingDownload(false);
      })
      .catch((error) => {
        setLoadingDownload(false);
        console.error("Gagal mengunduh file:", error);
      });
  };

  // ===============================================================
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10); // 10 milliseconds
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = () => {
    const milliseconds = String(time % 1000)
      .padStart(3, "0")
      .slice(0, 2); // Hanya ambil 2 digit terakhir
    const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, "0");
    const minutes = String(Math.floor((time / (1000 * 60)) % 60)).padStart(
      2,
      "0"
    );

    return `${minutes}.${seconds}.${milliseconds}`;
  };

  return (
    <>
      <div className="flex items-center justify-center w-[100%]">
        <label
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          htmlFor="dropzone-file"
          className={`${
            dragging ? "bg-gray-100" : "bg-gray-50"
          } flex flex-col items-center justify-center w-full h-52 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer hover:bg-gray-100`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-medium">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">DOCX or TXT (MAX. 15MB)</p>
          </div>
          <input
            onChange={handleFileChange}
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".docx,.txt"
          />
        </label>
      </div>

      <p className="mt-2">
        Selected file: {selectedFile ? selectedFile.name : "-"}
      </p>

      <div className="flex items-center flex-row space-x-5 mt-3">
        <div className="flex space-x-1">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isRunning}
            className={`${
              selectedFile && "!opacity-100 !hover:bg-[#508d99] cursor-pointer"
            } ${
              isRunning && "!opacity-60 !hover:bg-[#64A1AD] !cursor-progress"
            } flex items-center justify-center cursor-not-allowed opacity-60 w-24 h-8 bg-[#64A1AD] text-white rounded font-bold text-sm transition-all`}
          >
            {!loading ? (
              "Upload"
            ) : (
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              </div>
            )}
          </button>
          <button
            onClick={handleDownload}
            disabled={!statusUpload || loadingDownload || isRunning}
            className={`${
              statusUpload && "!opacity-100 !hover:bg-[#508d99] cursor-pointer"
            } ${
              loadingDownload &&
              "!opacity-60 !hover:bg-[#64A1AD] !cursor-progress"
            } ${
              isRunning && "!opacity-60 !hover:bg-[#64A1AD] !cursor-progress"
            } cursor-not-allowed opacity-60 px-5 py-1.5 bg-[#64A1AD] text-white rounded font-bold text-sm`}
          >
            Download
          </button>
        </div>

        <div className="w-[126px] relative text-sm font-montserrat text-slate-600 font-medium">
          <span>{formatTime()}</span>
          <span className="text-[11px] absolute right-0">milisecond</span>
        </div>
      </div>

      {errorFileInput && (
        <p className="mt-5 px-5 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {errorFileInput}
        </p>
      )}
    </>
  );
}
