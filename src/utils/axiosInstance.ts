import axios from "axios";
import { getToken } from "@/app/(auth)/action";
import { toastMessage } from "./toastify";

const isServerSide = typeof window === 'undefined';


axios.defaults.withCredentials = true;
const axiosInstance = axios.create({
    baseURL: '/institute',
    timeout: 5000,
    withCredentials: true
});


if (isServerSide) {
    axiosInstance.defaults.baseURL = `${process.env.NEXTAUTH_BASE_URL}/institute`;
}

axiosInstance.interceptors.request.use(async (config) => {

    // if (typeof window === 'undefined') {
    const token = await getToken();
    config.headers['Authorization'] = `Bearer ${token}`;
    // }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log(error, "error")
        if (typeof window !== 'undefined') {
            toastMessage(error?.response?.data?.errors[0]?.message, "e")
        }
        return Promise.reject(error);
    }
);


export { axiosInstance };