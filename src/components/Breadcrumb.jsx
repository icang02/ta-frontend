import React from "react";

const Breadcrumb = ({ title }) => {
  return (
    <div className="mb-7 inline-flex items-center font-medium space-x-2 opacity-90 relative">
      <span className="after:content-[''] after:block after:absolute after:inset-x-0 after:border-b-2 after:border-green-600 after:w-11 after:h-0.5">
        Dashboard
      </span>
      <span>|</span>
      <span>{title}</span>
    </div>
  );
};

export default Breadcrumb;
