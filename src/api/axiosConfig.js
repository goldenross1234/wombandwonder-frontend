import axios from "axios";
import { loadConfig } from "../config/runtimeConfig";

const instance = axios.create();

instance.interceptors.request.use(async (config) => {
  const runtimeConfig = await loadConfig();
  config.baseURL = runtimeConfig.backend_url + "/api/";

  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default instance;
