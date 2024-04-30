import React from "react";
import { Link } from "react-router-dom";

const ButtonDashHome = () => {
  return (
    <div>
      <Link
        to={"/"}
        className="mr-3 border rounded text-slate-100 bg-main px-4 py-2.5"
      >
        Ke Website Utama
      </Link>
      <Link
        to={"/data-kamus"}
        className="border border-gray-300 hover:border-gray-400 transition-all text-black bg-white rounded  px-4 py-2.5"
      >
        Lihat Kamus
      </Link>
    </div>
  );
};

export default ButtonDashHome;
