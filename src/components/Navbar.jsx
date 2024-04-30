import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { isTokenExpired } from "../views/Dashboard";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);

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
    <div className="fixed top-0 w-full bg-white border-2">
      <nav className="py-2.5 flex z-50 mx-auto justify-between items-center max-w-6xl">
        <Link to={"/"}>
          <img src="logo.png" alt="logo" width={140} />
        </Link>

        <div className="space-x-7">
          {menu.map((item, i) => (
            <NavLink
              key={i}
              to={item.link}
              className={({ isActive }) =>
                `font-medium text-slate-900 px-3 py-2 hover:opacity-100 transition-all ${
                  isActive ? "opacity-100" : "opacity-60"
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </div>

        <Link
          to={isLogin ? "/dashboard" : "/login"}
          className="font-bold opacity-85 border border-black border-opacity-40 rounded-md px-5 py-3 transition-all hover:border-opacity-60"
        >
          {isLogin ? "Dashboard" : "Login"}
        </Link>
      </nav>
    </div>
  );
}
