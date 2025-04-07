import axios from "axios";
import { toast } from "sonner";
import {env} from "next-runtime-env";

export const apiV1 = "api/v1"

export const reqHandler = axios.create({
  baseURL: `${env("NEXT_PUBLIC_BACKEND_HOST")}/${apiV1}`,
  withCredentials: true
})

const responseErrorInterceptor = (error: any) => {
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
      toast.warning(message)
    }
    isAuthFail = error.response.data.status == 1101
  } else {
    message = error.message
    toast.error(error.message)
  }
  return Promise.reject({error, message, isAuthFail})
}

reqHandler.interceptors.response.use(
  (resp) => {
    if (resp.data.data) {
      resp.data = resp.data.data
    }
    return resp;
  },
  responseErrorInterceptor
)

class EventSourceFactory {
  private option: { baseUrl: string }
  constructor(options: { baseUrl: string }) {
    this.option = options
  }

  public create(uri: string) {
    return new EventSource(`${this.option.baseUrl}/${uri}`, {
      withCredentials: true
    })
  }
}

export const eventSourceFactory = new EventSourceFactory({
  baseUrl: `${env("NEXT_PUBLIC_BACKEND_HOST")}/${apiV1}`
})


export const streamingHandler = axios.create({
  baseURL: `${env("NEXT_PUBLIC_BACKEND_HOST")}/${apiV1}`,
  withCredentials: true,
  responseType: 'stream',
  adapter: "fetch"
})

streamingHandler.interceptors.response.use(
  async (resp) => {
    const contentType = (resp.headers["content-type"] || "") as string
    if (contentType.includes("application/json")) { //TODO: better handle json return
      const reader = resp.data.pipeThrough(new TextDecoderStream()).getReader();
      const {value} = await reader.read();
      resp.data = JSON.parse(value).data;
      return resp
    } else if (contentType.includes("text/event-stream")) {
      return resp
    }
    return resp
  },
  responseErrorInterceptor
)
