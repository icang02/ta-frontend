import React from "react";
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

const Router = () => {
  const location = useLocation();

  // Fungsi untuk memeriksa apakah Navbar harus ditampilkan
  const shouldShowNavbar = () => {
    const path = location.pathname;
    return !(
      path === "/login" ||
      path.startsWith("/dashboard") ||
      path.startsWith("/data-kamus")
    );
  };

  return (
    <div
      className={`font-roboto ${
        location.pathname.startsWith("/cek-ejaan")
          ? "bg-[rgb(244,248,249)]"
          : "bg-white"
      }`}
    >
      {shouldShowNavbar() && <Navbar />}
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
