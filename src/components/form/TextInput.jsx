// import React, { useState } from "react";
// import { axiosCustom } from "../../lib/axiosCustom";

// export default function TextInput({ setFormInput }) {
//   const [inputText, setInputText] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     setLoading(true);
//     e.preventDefault();
//     try {
//       const response = await axiosCustom.post("/cek", {
//         inputText,
//       });
//       setFormInput(response.data);
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full">
//       <form onSubmit={handleSubmit}>
//         <textarea
//           required
//           onChange={(e) => setInputText(e.target.value)}
//           value={inputText}
//           className="h-52 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400 focus:outline-double"
//           placeholder="Masukkan teks..."
//         />

//         <div className={`mt-3 flex`}>
//           <button
//             className={`${
//               loading && "opacity-70 cursor-not-allowed"
//             }  bg-main text-sm px-5 py-2.5 rounded-s-md font-bold transition-all border-e-0 text-slate-100 border border-main outline-none`}
//           >
//             Submit
//           </button>
//           <div
//             onClick={() => setInputText("")}
//             className={`${
//               loading && "opacity-70 cursor-not-allowed"
//             } cursor-pointer bg-white text-black border border-black border-opacity-40 hover:border-opacity-60 text-opacity-80 text-sm px-5 py-2.5 rounded-e-md font-bold transition-all border-s-0 outline-none`}
//           >
//             Reset
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }
