"use server";

import {oauthClients} from "@/oauth-config";

export async function oauthRedirect(provider: string, authType: "login" | "signup" | "authorize") {
  const client = oauthClients[provider]
  if (!client) {
    return {error: "unknown provider"}
  }
  switch (authType) {
    case "login":
      return client.login()
    case "signup":
      return client.signup()
    case "authorize":
      return client.authorize()
  }
}
