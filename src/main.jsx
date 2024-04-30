import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Router from "./router";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ToastContainer
          transition={Slide}
          position="top-right"
          autoClose={2500}
          closeOnClick={true}
          pauseOnHover={false}
          draggable={true}
        />
        <Router />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
