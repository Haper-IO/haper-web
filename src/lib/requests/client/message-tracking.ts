import { reqHandler } from "@/lib/requests/client/base";

// Define interfaces
export interface TrackingStatus {
  account_id: string;
  provider: string;
  status: "NotStarted" | "Ongoing" | "Stopped" | "Error";
  created_at: string | null;
  updated_at: string | null;
}

export interface AccountInfo {
  // This interface represents the account information used for tracking
  provider: string;
  provider_account_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  email?: string;
}

/**
 * Get tracking status for all user accounts.
 *
 * @returns - A promise that resolves to an array of tracking status information.
 */
export const getTrackingStatus = async () => {
  return reqHandler.get(`/message/tracking/status`);
}

/**
 * Stop tracking messages for a specific account.
 *
 * @param accountId - The unique identifier of the account to stop tracking.
 * @returns - A promise that resolves to the new tracking status.
 */
export const stopTracking = async (accountId: string) => {
  return reqHandler.post(`/message/tracking/stop`, {
    account_id: accountId
  });
}

/**
 * Start tracking messages for an account.
 *
 * @param accountId - The existing account id for the user.
 * @param accountInfo - The new account information (optional).
 * @returns - A promise that resolves to the new tracking status.
 */
export const startTracking = async (
  accountId?: string,
  accountInfo?: AccountInfo
) => {
  return reqHandler.post(`/message/tracking/start`, {
    account_id: accountId,
    account: accountInfo
  });
}
