import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-[100vh] px-6 md:px-0 max-w-6xl mx-auto flex justify-between items-center">
      <div className="text-center md:text-left">
        <h1 className="font-bold text-2xl md:text-5xl text-slate-800 leading-7 md:leading-tight">
          Sistem Deteksi <br className="hidden md:block" />
          Kesalahan Ejaan Pada
          <br className="hidden md:block" />
          Dokumen Jurnal Ilmiah
        </h1>
        <p className="text-sm md:text-base text-slate-800 mt-4 mb-8 md:mt-6 md:mb-14">
          Menggunakan Kombinasi Algoritma Boyer Moore dan{" "}
          <br className="hidden md:block" />
          Damerau Levenshtein Distance.
        </p>
        <Link
          to={"/cek-ejaan"}
          className="bg-main text-xs md:text-base px-5 py-3 md:px-6 md:py-5 rounded-md text-slate-100 font-bold"
        >
          Mulai Cek Ejaan
        </Link>
      </div>
      <img
        className="hidden md:block"
        src="beranda-hero.png"
        alt="hero"
        width={510}
      />
    </div>
  );
};

export default Home;
