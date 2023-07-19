import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://serpas.onrender.com/api",
});
axiosInstance.interceptors.request.use(
  (config) => {
    let token = window.localStorage.getItem("token");
    config.headers.Authorization = token ? token : "";
    return config;
  },
  (error) => {
    return console.log(error);
  }
);
export default axiosInstance;
