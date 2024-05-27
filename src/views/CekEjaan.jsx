import React, { useState } from "react";
import TabelSpell from "../components/TabelSpell";
import FileInput from "../components/form/FileInput";
import TextInput from "../components/form/TextInput";

export default function CekEjaan() {
  const [inputType, setInputType] = useState(true);

  return (
    <div className="pt-20 min-h-screen">
      <div className="min-h-[570px] rounded-md shadow-md max-w-6xl mx-auto bg-white p-6">
        <div className="flex justify-center">
          <button
            onClick={() => setInputType(true)}
            className={`${
              inputType
                ? "bg-main text-slate-100 border border-main"
                : "bg-white text-black border border-black border-opacity-40 hover:border-opacity-60 text-opacity-80"
            } bg-main text-sm px-4 py-2 rounded-s-md font-bold transition-all border-e-0`}
          >
            Text Input
          </button>
          <button
            onClick={() => setInputType(false)}
            className={`${
              !inputType
                ? "bg-main text-slate-100 border border-main"
                : "bg-white text-black border border-black border-opacity-40 hover:border-opacity-60 text-opacity-80"
            } bg-main text-sm px-4 py-2 rounded-e-md font-bold transition-all border-s-0`}
          >
            File Input
          </button>
        </div>

        <div className="mt-5 py-2 px-3 pb-3 bg-[#F8F8F8] rounded-md">
          {inputType ? (
            <TextInput />
          ) : (
            <div className="grid grid-cols-12 gap-x-10 gap-y-6 md:gap-y-0">
              <div className="col-span-12 md:col-span-6">
                <FileInput />
              </div>
              <div className="col-span-12 md:col-span-6">
                <TabelSpell />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
