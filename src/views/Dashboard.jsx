import React, { useEffect, useState } from "react";

import FooterDashboard from "../components/FooterDashboard";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import ButtonDashHome from "../components/ButtonDashHome";
import CardDashHome from "../components/CardDashHome";
import { axiosCustom } from "../lib/axiosCustom";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Waktu saat ini dalam detik
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Jika terjadi kesalahan, anggap token telah kedaluwarsa
  }
};

export default function Dashboard() {
  const [name, setName] = useState("Admin");
  const [totalKamus, setTotalKamus] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const dataCardDashHome = [
    {
      title: "Selamat Datang di halaman Dashboard",
      desc: "Sistem Deteksi Kesalahan Ejaan Pada Dokumen Jurnal Ilmiah Menggunakan Kombinasi Algoritma Boyer Moore dan Damerau Levenshtein Distance.",
    },
    {
      title: "Total Data Kamus",
      desc: (
        <>
          <span className="text-3xl">{totalKamus.toLocaleString()}</span>{" "}
          <span className="text-sm text-bold">data</span>
        </>
      ),
    },
  ];

  const fetchTotalKamus = async () => {
    const res = await axiosCustom.post("/total-kamus");
    setTotalKamus(res.data.totalKamus);
  };

  useEffect(() => {
    fetchTotalKamus();

    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      return navigate("/login");
    } else {
      return navigate(location.pathname);
    }
  }, []);

  return (
    <div className="font-roboto min-h-[100vh] bg-[#E6E9EC]">
      <Sidebar name={name} />

      <main className="min-h-screen w-[calc(100%-244px)] float-right pt-5 pb-5 px-7">
        <Breadcrumb title="Home" />
        {dataCardDashHome.map((item, i) => (
          <CardDashHome key={i} title={item.title} desc={item.desc} />
        ))}
        <ButtonDashHome />
        <FooterDashboard />
      </main>
    </div>
  );
}
