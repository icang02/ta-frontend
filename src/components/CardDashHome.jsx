import React from "react";

const CardDashHome = ({ title, desc }) => {
  return (
    <div className="mb-8 rounded-lg bg-white p-8 shadow text-slate-800">
      <h1 className="font-bold text-2xl">{title}</h1>
      <div className="mt-0.5 h-0.5 w-20 bg-green-600"></div>
      <p className="max-w-2xl mt-5 text-base">{desc}</p>
    </div>
  );
};

export default CardDashHome;
