import { reqHandler } from "@/lib/requests/server/base";
import { useState, useEffect } from "react";
import {CREATE_USER_SETTING_URI,
        GET_USER_SETTING_URI,
        UPDATE_USER_SETTING_URI} from "@/hooks/base";

// Define the UserSetting interface
interface UserSetting {
  key_message_tags: string[];
}

// Define the response structure from the API
interface UserSettingResponse {
  uri: string;
  elapsed: number;
  status: number;
  message: string;
  data: {
    setting: UserSetting;
  };
}

// Define error interface
interface UserSettingError {
  error: string;
  message: string;
  isAuthFail: boolean;
}

/**
 * Custom hooks for managing user settings
 * Provides functionality to fetch, create, and update user settings
 */
export function useUserSetting() {
  const [userSetting, setUserSetting] = useState<UserSetting | null>(null);
  const [error, setError] = useState<UserSettingError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user settings on component mount
  useEffect(() => {
    const fetchUserSetting = async () => {
      try {
        setLoading(true);
        const response = await reqHandler.get<UserSettingResponse>(GET_USER_SETTING_URI);

        // Extract the setting data from the response
        if (response.data?.data?.setting) {
          setUserSetting(response.data.data.setting);
        } else {
          // Instead of throwing locally, just set the error directly
          setError({
            error: "invalid_response",
            message: "Invalid response format",
            isAuthFail: false
          });
        }
      } catch (err) {
        setError(err as UserSettingError);
      } finally {
        setLoading(false);
      }
    };

    // Call the function and handle the Promise properly
    fetchUserSetting().catch(err => {
      console.error("Failed to fetch user settings:", err);
      setError(err as UserSettingError);
      setLoading(false);
    });
  }, []);

  /**
   * Create new user settings
   * @param newSetting - Complete UserSetting object
   * @returns Promise resolving to a boolean indicating success
   */
  const createUserSetting = async (newSetting: UserSetting): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await reqHandler.post<UserSettingResponse>(CREATE_USER_SETTING_URI, newSetting);

      if (response.data && response.data.data && response.data.data.setting) {
        setUserSetting(response.data.data.setting);
        return true;
      }
      return false;
    } catch (err) {
      setError(err as UserSettingError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update existing user settings
   * @param newSetting - Partial UserSetting object with fields to update
   * @returns Promise resolving to a boolean indicating success
   */
  const updateUserSetting = async (newSetting: Partial<UserSetting>): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await reqHandler.put<UserSettingResponse>(UPDATE_USER_SETTING_URI, newSetting);

      if (response.data && response.data.data && response.data.data.setting) {
        setUserSetting(response.data.data.setting);
        return true;
      }
      return false;
    } catch (err) {
      setError(err as UserSettingError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset error state
   */
  const clearError = () => {
    setError(null);
  };

  return {
    userSetting,
    error,
    loading,
    createUserSetting,
    updateUserSetting,
    clearError
  };
}
