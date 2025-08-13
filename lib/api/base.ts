import axios, { AxiosInstance } from "axios";

export const axiosPrivate: AxiosInstance = axios.create({
  baseURL: '/api',
});
