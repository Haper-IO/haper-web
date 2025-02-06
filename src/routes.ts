/**
 *
 *
 **/

export const publicRoutes = [
  "/dashboard",
];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to settings page.
 * @type {string[]}
 */
export const authRoutes = [
  "/login",
  "/register",
  "/error",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication.
 * @type {string[]}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after a successful login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";

/**
 * The default redirect path after a successful logout.
 * @type {string}
 */
export const DEFAULT_DASHBOARD_REDIRECT = "/dashboard";
