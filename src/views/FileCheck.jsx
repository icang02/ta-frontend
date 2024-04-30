import { useState } from "react";
import Navbar from "@/components/Navbar";
import axios from "axios";
import TabelSpell from "@/components/TabelSpell";

export default function FileCheck() {
  const [file, setFile] = useState(null);
  const [finalResult, setFinalResult] = useState([]);
  const [success, setSuccess] = useState(null);
  const [fileName, setFileName] = useState("");

  const [dataResult, setDataResult] = useState([]);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess(response.data.message);
      setFinalResult(response.data.finalResult);
      setFileName(response.data.fileName);
    } catch (error) {
      console.error("Error uploading file: ", error.message);
    }
  };

  const handleDownload = async () => {
    const dataFinal = dataResult.filter((item) => item.target != "-");

    try {
      const response = await axios.post("http://localhost:3000/download", {
        dataFinal,
        fileName,
      });
      console.log(response.data);

      alert("Success...");
    } catch (error) {
      console.error("Error uploading file: ", error.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        <div className="px-2 pt-28 pb-10 container mx-auto max-w-5xl">
          <h1 className="font-bold text-xl text-center mb-10">Upload File</h1>
          <div className="grid grid-cols-12 md:gap-x-8">
            <div className="col-span-12 md:col-span-6">
              <form onSubmit={onFormSubmit}>
                <div className="grid grid-cols-12 gap-y-8 gap-x-0 md:gap-y-0 md:gap-x-8">
                  <div className="col-span-12 md:col-span-12">
                    <div className="flex items-center flex-col justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            .docx file format
                          </p>
                        </div>
                        <input
                          onChange={onFileChange}
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept=".docx"
                        />
                      </label>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 tracking-wider transition-all rounded w-full py-2 text-white text-sm font-bold uppercase"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              <button
                onClick={handleDownload}
                className="mt-3 px-4 py-2 bg-gray-500 hover:bg-gray-600 transition-all rounded-md text-white"
              >
                Download
              </button>
              {success && (
                <h1 className="mt-5 px-3 py-2 text-base border border-green-200 text-green-500 bg-green-50 rounded-md">
                  {success}
                </h1>
              )}
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="grid grid-cols-12 gap-y-8 gap-x-0 md:gap-y-0 md:gap-x-8">
                <div className="col-span-12">
                  <TabelSpell
                    finalResult={finalResult}
                    setDataResult={setDataResult}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
