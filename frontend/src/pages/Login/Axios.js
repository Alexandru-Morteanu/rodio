import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = token ? token : "";
    return config;
  },
  (error) => {
    return console.log(error);
  }
);
export default axiosInstance;
