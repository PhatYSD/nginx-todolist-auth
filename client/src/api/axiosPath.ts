import axios from "axios";

const baseURL: string = import.meta.env.MODE === "development" ? "http://localhost:5000/" : `http://localhost/api/`;

const axiosPath = axios.create({
    baseURL,
    withCredentials: true
});

export default axiosPath;