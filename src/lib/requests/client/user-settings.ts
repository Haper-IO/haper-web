import {reqHandler} from "./base";

export interface UserSettings {
  key_message_tags: string[];
}

/**
 * Get user settings.
 *
 * @returns - A promise that resolves to the user settings.
 */
export const getUserSettings = async () => {
  return reqHandler.get<{ setting: UserSettings | null }>('/user/setting');
}

/**
 * Update existing user settings.
 *
 * @param settings - The settings to update.
 * @returns - A promise that resolves to the updated settings.
 */
export const updateUserSettings = async (settings: UserSettings) => {
  return reqHandler.put<{ setting: UserSettings }>('/user/setting', settings);
}
