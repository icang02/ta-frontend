import { axiosCustom } from "../lib/axiosCustom";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isTokenExpired } from "./Dashboard";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosCustom.post("/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      toast.success(res.data.message);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      return navigate("/login");
    } else {
      return navigate("/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 font-roboto">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-[#878787] to-main shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <Link to="/">
                <img
                  src="logo.png"
                  alt="logo"
                  className="mx-auto"
                  width={150}
                />
              </Link>
              <h1 className="text-base font-semibold opacity-85 text-center mt-5">
                Input username dan password dengan benar
              </h1>

              {error && (
                <div
                  className="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
            </div>

            <form onSubmit={onLogin} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="off"
                    id="username"
                    type="text"
                    className="peer ps-0 placeholder-transparent h-10 w-full border-t-0 border-s-0 border-e-0 border-b-2 focus:border-b-gray-400 border-gray-300 text-gray-900 focus:outline-none focus:ring-0"
                    placeholder="Username"
                    required
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Username
                  </label>
                </div>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                    id="password"
                    type="password"
                    className="peer ps-0 placeholder-transparent h-10 w-full border-t-0 border-s-0 border-e-0 border-b-2 focus:border-b-gray-400 border-gray-300 text-gray-900 focus:outline-none focus:ring-0"
                    placeholder="Password"
                    required
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>
                <div className="relative flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-500 rounded bg-gray-400 focus:ring-3 focus:ring-0"
                      />
                    </div>

                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-700 font-medium"
                      >
                        Ingat saya
                      </label>
                    </div>
                  </div>

                  {loading && (
                    <p className="text-sm animate-pulse self-center">
                      Loading...
                    </p>
                  )}

                  <button
                    className={`${
                      loading && "cursor-not-allowed opacity-50"
                    } bg-main text-white rounded-md px-4 py-1 transition-all`}
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
