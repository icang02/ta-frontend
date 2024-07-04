import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isTokenExpired } from "../views/Dashboard";
import { Squash as Hamburger } from "hamburger-react";

export default function NavMobile() {
  const [isLogin, setIsLogin] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const menu = [
    {
      title: "Beranda",
      link: "/",
    },
    {
      title: "Cek Ejaan",
      link: "/cek-ejaan",
    },
    {
      title: "Kamus",
      link: "/kamus",
    },
    {
      title: "Tentang",
      link: "/tentang",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);

  return (
    <div className="fixed top-0 w-full bg-white border-2 shadow z-[999]">
      <nav className="py-1 px-4 flex z-50 mx-auto justify-between items-center max-w-6xl">
        <Link to={"/"} onClick={() => setOpen(false)}>
          <img src="logo.png" alt="logo" width={110} />
        </Link>

        <div className="scale-75">
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
      </nav>

      <div
        className={`${
          isOpen ? "translate-y-[0%]" : "translate-y-[100%]"
        } absolute w-full bg-white border shadow h-screen top-[60px] transition-all duration-500 flex items-center justify-center text-center`}
      >
        <ul className="w-full flex flex-col -translate-y-16">
          {menu.map((item, i) => (
            <Link
              to={item.link}
              onClick={() => setOpen(false)}
              key={i}
              className="text-lg font-medium py-2 hover:text-blue-600"
            >
              {item.title}
            </Link>
          ))}
          <hr className="mt-2 mb-5" />
          <Link
            onClick={() => setOpen(false)}
            to={isLogin ? "/dashboard" : "/login"}
            className="text-base font-medium py-1.5 text-white rounded bg-blue-500 w-36 mx-auto hover:bg-blue-600 transition-all"
          >
            {isLogin ? "Dashboard" : "Login"}
          </Link>
        </ul>
      </div>
    </div>
  );
}
