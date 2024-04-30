import axios from "axios";

export const axiosCustom = axios.create({
  baseURL: "http://localhost:3000",
});
