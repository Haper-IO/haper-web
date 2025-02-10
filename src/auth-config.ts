import * as arctic from "arctic";

declare global {
  // eslint-disable-next-line no-var
  var state: string | undefined;
  // eslint-disable-next-line no-var
  var codeVerifier: string | undefined;
}

export const state = globalThis.state || arctic.generateState();
export const codeVerifier = globalThis.codeVerifier || arctic.generateCodeVerifier();

if (process.env.NODE_ENV !== 'production') {
  globalThis.state = state
  globalThis.codeVerifier = codeVerifier
}

