import React from "react";

export default function FooterDashboard() {
  return (
    <footer className="fixed w-[calc(100%-245px)] bottom-0 right-0 bg-main flex items-start space-y-3 flex-col py-3.5 px-6 text-sm">
      <p className="opacity-75 font-light text-white text-center">
        @{new Date().getFullYear()}. Ilmi Faizan. Universitas Halu Oleo
      </p>
    </footer>
  );
}
