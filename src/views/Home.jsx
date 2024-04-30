import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-[100vh] max-w-6xl mx-auto flex justify-between items-center">
      <div>
        <h1 className="font-bold text-5xl text-slate-800 leading-tight">
          Sistem Deteksi <br />
          Kesalahan Ejaan Pada
          <br />
          Dokumen Jurnal Ilmiah
        </h1>
        <p className="text-base text-slate-800 mt-6 mb-14">
          Menggunakan Algoritma Damerau Levenshtein Distance, <br /> Metode
          Empiris, dan Dictionary Lookup
        </p>
        <Link
          to={"/cek-ejaan"}
          className="bg-main text-base px-6 py-5 rounded-md text-slate-100 font-bold"
        >
          Mulai Cek Ejaan
        </Link>
      </div>
      <img src="beranda-hero.png" alt="hero" width={510} />
    </div>
  );
};

export default Home;
