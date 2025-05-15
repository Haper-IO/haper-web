import {reqHandler} from "@/lib/requests/client/base";

// Define interfaces
export interface TrackingStatus {
  account_id: string;
  email: string;
  provider: string;
  status: "NotStarted" | "Ongoing" | "Stopped" | "Error";
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Get tracking status for all user accounts.
 *
 * @returns - A promise that resolves to an array of tracking status information.
 */
export const listMessageTrackingStatus = async () => {
  return reqHandler.get<{tracking_status: TrackingStatus[]}>(`/message/tracking/status`);
}

/**
 * Stop tracking messages for a specific account.
 *
 * @param accountId - The unique identifier of the account to stop tracking.
 * @returns - A promise that resolves to the new tracking status.
 */
export const stopMessageTracking = async (accountId: string) => {
  return reqHandler.post<{new_tracking_status: TrackingStatus}>(`/message/tracking/stop`, {
    account_id: accountId
  });
}

/**
 * Start tracking messages for an account.
 *
 * @param accountId - The existing account id for the user.
 * @returns - A promise that resolves to the new tracking status.
 */
export const startMessageTrackingByAccountID = async (accountId: string) => {
  return reqHandler.post<{new_tracking_status: TrackingStatus}>(`/message/tracking/start`, {
    account_id: accountId
  });
}
