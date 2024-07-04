import axios from "axios";

const local = "http://localhost:3000";
const online = "https://drum-legal-tuna.ngrok-free.app";

const host = window.location.hostname.startsWith("localhost") ? local : online;

export const axiosCustom = axios.create({
  baseURL: host,
});
