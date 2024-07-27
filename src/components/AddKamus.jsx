import React, { useState } from "react";
import { toast } from "react-toastify";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { axiosCustom } from "../lib/axiosCustom";

const AddKamus = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (text != "") {
      try {
        await axiosCustom.post("/add", {
          text: "",
          di: isChecked,
          textInput: text,
        });
        toast.success("Text sent successfully.");
      } catch (error) {
        toast.error("Error sending text to backend.");
        console.log(error);
      }
    } else {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const zip = new PizZip(arrayBuffer);

        try {
          setIsLoading(true);
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });

          const textFile = doc.getFullText();

          try {
            await axiosCustom.post("/add", {
              text: textFile,
              di: isChecked,
              textInput: text,
            });
            toast.success("Text sent successfully.");
          } catch (error) {
            toast.error("Error sending text to backend.");
            console.log(error);
          }
        } catch (error) {
          console.error("Error extracting text from DOCX:", error);
        } finally {
          setIsLoading(false);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="md:w-[60%] w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="fileInput"
          >
            Upload file
          </label>
          <input
            accept=".docx"
            type="file"
            id="fileInput"
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handleFileChange}
          />
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id="checkboxInput"
              className="mr-2 cursor-pointer"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="checkboxInput" className="text-sm text-gray-900">
              Awalan "di"
            </label>
          </div>
        </div>
        <hr />
        <textarea
          onChange={handleTextChange}
          rows="6"
          className="w-full p-3 border text-sm border-gray-300 rounded-md shadow-sm focus:outline-double resize-none"
          placeholder="Masukkan teks..."
        />
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`${
              !isLoading && "hover:bg-blue-700"
            } w-full text-sm px-4 py-2 font-medium text-white bg-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75`}
          >
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <span>Submit</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddKamus;
