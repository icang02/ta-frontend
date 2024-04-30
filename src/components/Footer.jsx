import React from "react";

export default function Footer() {
  return (
    <footer className="fixed w-full bottom-0 bg-main flex items-center space-y-3 flex-col py-5 text-sm">
      <p className="opacity-75 font-light text-white text-center">
        @{new Date().getFullYear()}. Ilmi Faizan. Universitas Halu Oleo
      </p>
    </footer>
  );
}
