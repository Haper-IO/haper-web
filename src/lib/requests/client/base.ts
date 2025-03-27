import axios from "axios";
import { toast } from "sonner";
import {env} from "next-runtime-env";

export const apiV1 = "api/v1"

// Add debug logging to check the base URL
console.log('API Base URL:', `${env("NEXT_PUBLIC_BACKEND_HOST")}/${apiV1}`);

export const reqHandler = axios.create({
  baseURL: `${env("NEXT_PUBLIC_BACKEND_HOST")}/${apiV1}`,
  withCredentials: true
})

// Add request interceptor for debugging
reqHandler.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

reqHandler.interceptors.response.use(
  (resp) => {
    if (!resp.data.data) {
      toast.error("no data field in response data")
      return null
    }
    return resp.data.data
  },
  (error) => {
    let message: string
    let isAuthFail = false
    if (error.response && error.response.data && error.response.data.message && error.response.data.status) {
      message = error.response.data.message
      if (error.response.data.status == 9999) {
        toast.error(`${error.message}: ${message}`, {
          classNames: {
            toast: "bg-white",
            title: 'text-red-400',
          }
        })
      } else {
        toast.warning(`${error.message}: ${message}`)
      }
      isAuthFail = error.response.data.status == 1101
    } else {
      message = error.message
      toast.error(error.message)
    }
    return Promise.reject({error, message, isAuthFail})
  }
)
