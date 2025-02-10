import axios from "axios";

export const apiV1 = "api/v1"

export const reqHandler = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/${apiV1}`,
  withCredentials: true
})
