import { reqHandler } from "./base";

export interface UserSettings {
  key_message_tags: string[];
}

export interface UserSettingsResponse {
  uri: string;
  elapsed: number;
  status: number;
  message: string;
  data: {
    setting: UserSettings;
  }
}

/**
 * Get user settings.
 *
 * @returns - A promise that resolves to the user settings.
 */
export const getUserSettings = async () => {
  return reqHandler.get<UserSettingsResponse>('/user/setting');
}

/**
 * Create new user settings.
 *
 * @param settings - The settings to create.
 * @returns - A promise that resolves to the created settings.
 */
export const createUserSettings = async (settings: UserSettings) => {
  return reqHandler.post<UserSettingsResponse>('/user/setting', settings);
}

/**
 * Update existing user settings.
 *
 * @param settings - The settings to update.
 * @returns - A promise that resolves to the updated settings.
 */
export const updateUserSettings = async (settings: UserSettings) => {
  return reqHandler.put<UserSettingsResponse>('/user/setting', settings);
}
