"use server";

import * as arctic from "arctic";
import {redirect} from "next/navigation";
import { headers } from "next/headers";
import {state, codeVerifier} from "@/auth-config";


async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
}

export async function googleOAuthRedirect(authType: "login" | "signup" | "authorize") {
  const baseUrl = await getBaseUrl();
  const google = new arctic.Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${baseUrl}/api/auth/callback/google/${authType}`
  );

  const scopes = ["openid", "profile", "email", "https://www.googleapis.com/auth/gmail.modify"];
  const url = google.createAuthorizationURL(state, codeVerifier, scopes);
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("access_type", "offline");
  return redirect(url.toString());
}
