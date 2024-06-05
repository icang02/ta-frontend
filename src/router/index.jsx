import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "../views/Home";
import CekEjaan from "../views/CekEjaan";
import Kamus from "../views/Kamus";
import Tentang from "../views/Tentang";
import Dashboard from "../views/Dashboard";
import Login from "../views/Login";
import ErrorPage from "../views/ErrorPage";
import Navbar from "../components/Navbar";
import Predictive from "../components/Predictive";
import DashboardKamus from "../views/DashboardKamus";
import NavMobile from "../components/NavMobile";

const Router = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Fungsi untuk memeriksa apakah Navbar harus ditampilkan
  const shouldShowNavbar = () => {
    const path = location.pathname;
    return !(
      path === "/login" ||
      path.startsWith("/dashboard") ||
      path.startsWith("/data-kamus")
    );
  };

  // Cek ukuran layar saat komponen dimuat
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };

    handleResize(); // Cek ukuran layar saat komponen dimuat
    window.addEventListener("resize", handleResize); // Daftarkan event listener untuk resize
    return () => {
      window.removeEventListener("resize", handleResize); // Hapus event listener saat komponen dilepas
    };
  }, []);

  return (
    <div
      className={`font-roboto ${
        location.pathname.startsWith("/cek-ejaan")
          ? "bg-[rgb(244,248,249)]"
          : "bg-white"
      }`}
    >
      {/* {shouldShowNavbar() && <Navbar />} */}
      {isMobile ? <NavMobile /> : shouldShowNavbar() && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} errorElement={ErrorPage} />
        <Route
          path="/cek-ejaan"
          errorElement={ErrorPage}
          element={<CekEjaan />}
        />
        <Route path="/kamus" element={<Kamus />} errorElement={ErrorPage} />
        <Route path="/tentang" errorElement={ErrorPage} element={<Tentang />} />
        <Route path="/login" errorElement={ErrorPage} element={<Login />} />
        <Route
          path="/dashboard"
          errorElement={<ErrorPage />}
          element={<Dashboard />}
        />
        <Route
          path="/data-kamus"
          errorElement={<ErrorPage />}
          element={<DashboardKamus />}
        />

        <Route
          path="/predictive"
          errorElement={ErrorPage}
          element={<Predictive />}
        />
      </Routes>
    </div>
  );
};

export default Router;
