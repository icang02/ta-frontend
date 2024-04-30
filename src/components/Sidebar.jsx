import React from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { BiBook, BiLogIn } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Sidebar = ({ name }) => {
  const navigate = useNavigate();

  const menu = [
    {
      title: "Dashboard",
      icon: <MdSpaceDashboard className="text-xl opacity-80" />,
      link: "/dashboard",
    },
    {
      title: "Kamus",
      icon: <BiBook className="text-xl opacity-80" />,
      link: "/data-kamus",
    },
  ];

  const onLogout = async () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logging out.");
  };

  return (
    <div className="fixed min-h-screen bg-[#3E424D] max-w-xs">
      {/* image administrator */}
      <div className="flex items-start space-x-3 py-6 px-7">
        <img src="img-admin.png" alt="img" width={80} />
        <div className="text-white">
          <p className="font-bold text-xl tracking-widest">Welcome</p>
          <p className="text-sm">{name}</p>
          <div className="text-green-300 text-sm font-medium mt-1.5 flex items-center space-x-1">
            <div className="w-2.5 h-2.5 bg-green-300 rounded-full"></div>
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* menu list */}
      <div className="mt-8">
        {menu.map((item, i) => (
          <Link
            key={i}
            to={item.link}
            className={`${
              location.pathname.startsWith(item.link) ? "bg-[#545C6D]" : ""
            } px-6 py-4 text-white block w-full transition-all hover:bg-[#545C6D] mb-0.5`}
          >
            <span className="inline-flex items-center space-x-3">
              {item.icon} <span className="opacity-90">{item.title}</span>
            </span>
          </Link>
        ))}
        <span
          onClick={onLogout}
          className={`cursor-pointer px-6 py-4 text-white block w-full transition-all hover:bg-[#545C6D] mb-0.5`}
        >
          <span className="inline-flex items-center space-x-3">
            <BiLogIn /> <span className="opacity-90">Logout</span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
