'use client'

import { motion } from 'framer-motion'
import { useUserInfo } from '@/hooks/useUserInfo'
import { NavigationUnauthenticated } from '@/components/navigation-bar'
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FadeInWhenVisible } from "@/components/background-effect/fade-in-when-visible"
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { 
  getUserSettings,
  createUserSettings,
  updateUserSettings,
  UserSettings,
  UserSettingsResponse
} from "@/lib/requests/client/user-settings"

interface UserSettingState {
  data: UserSettingsResponse | null
  error: Error | null
  loading: boolean
}

export function useUserSetting() {
  const [state, setState] = useState<UserSettingState>({
    data: null,
    error: null,
    loading: true
  })

  const fetchSettings = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      const response = await getUserSettings()
      console.log('Settings response:', response);
      
      setState({
        data: response,
        error: null,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching settings:', error);
      setState({
        data: null,
        error: error instanceof Error ? error : new Error('Failed to fetch settings'),
        loading: false
      })
    }
  }

  const createSetting = async (settings: UserSettings) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      const response = await createUserSettings(settings)
      setState({
        data: response.data,
        error: null,
        loading: false
      })
      return true
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error : new Error('Failed to create settings'),
        loading: false
      })
      return false
    }
  }

  const updateSetting = async (settings: UserSettings) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      const response = await updateUserSettings(settings)
      setState({
        data: response.data,
        error: null,
        loading: false
      })
      return true
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error : new Error('Failed to update settings'),
        loading: false
      })
      return false
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return {
    userSetting: state.data,
    error: state.error,
    loading: state.loading,
    createUserSetting: createSetting,
    updateUserSetting: updateSetting,
    refreshSettings: fetchSettings
  }
}

export default function TestProfilePage() {
  const { userInfo, loading: userLoading, error: userError } = useUserInfo();
  const { userSetting, loading: settingsLoading, error: settingsError, createUserSetting, updateUserSetting, refreshSettings } = useUserSetting();
  
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [apiStatus, setApiStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
  }>({ loading: true });
  const [showStatus, setShowStatus] = useState(true);

  // Initialize selected tags when userSetting loads
  useEffect(() => {
    console.log('Current userSetting:', {
      fullUserSetting: userSetting,
      setting: userSetting?.data?.setting,
      tags: userSetting?.data?.setting?.key_message_tags
    });
    if (userSetting?.data?.setting?.key_message_tags) {
      setSelectedTags([...userSetting.data.setting.key_message_tags]);
    }
  }, [userSetting]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  };

  // Save changes
  const saveTagChanges = async () => {
    try {
      // Add validation for empty array
      if (!selectedTags || selectedTags.length === 0) {
        setApiStatus({
          loading: false,
          success: false,
          message: 'Please select at least one interest'
        });
        setShowStatus(true);
        return;
      }

      setApiStatus({
        loading: true,
        message: 'Saving changes...'
      });
      setShowStatus(true);

      // Debug log to see what we're sending
      console.log('Sending tags:', selectedTags);

      const requestBody: UserSettings = {
        key_message_tags: selectedTags
      };

      console.log('Request body matches UserSettings interface:', requestBody);

      // Fix the check for existing settings
      const success = userSetting?.setting
        ? await updateUserSetting(requestBody)
        : await createUserSetting(requestBody);

      if (success) {
        setIsEditingTags(false);
        setApiStatus({
          loading: false,
          success: true,
          message: 'Settings saved successfully!'
        });
        
        // Refresh settings to get the latest data
        await refreshSettings();
        
        // Hide success message after 2 seconds
        setTimeout(() => {
          setShowStatus(false);
        }, 2000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving tags:', error);
      setApiStatus({
        loading: false,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save settings'
      });
      setShowStatus(true);
    }
  };

  // Add custom tag
  const addCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag(""); // Clear the input after adding
    }
  };

  // Update API status based on loading and error states
  useEffect(() => {
    if (userLoading || settingsLoading) {
      setApiStatus({ loading: true, message: 'Loading...' });
      setShowStatus(true);
      return;
    }

    if (userError || settingsError) {
      setApiStatus({
        loading: false,
        success: false,
        message: (userError || settingsError)?.message || 'An error occurred'
      });
      setShowStatus(true);
      return;
    }

    if (userInfo?.data?.user) {
      setApiStatus({
        loading: false,
        success: true,
        message: 'Profile loaded successfully!'
      });
      setShowStatus(true);
      
      // Hide status after 2 seconds if successful
      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [userInfo, userError, settingsError, userLoading, settingsLoading]);

  if (userLoading) {
    return (
      <div className="relative w-full min-h-screen bg-gray-50 justify-center">
        <NavigationUnauthenticated />
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Alert>
            <div className="flex items-center">
              <div className="h-4 w-4 mr-2 rounded-full bg-blue-500 animate-pulse"></div>
              <AlertDescription>Loading user profile...</AlertDescription>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gray-50 justify-center">
      <NavigationUnauthenticated />

      {/* API Status Banner - Only show if showStatus is true */}
      {showStatus && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Alert variant={apiStatus.success ? "default" : apiStatus.loading ? "default" : "destructive"}>
            {apiStatus.loading ? (
              <div className="flex items-center">
                <div className="h-4 w-4 mr-2 rounded-full bg-blue-500 animate-pulse"></div>
                <AlertDescription>{apiStatus.message}</AlertDescription>
              </div>
            ) : apiStatus.success ? (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <AlertDescription className="text-green-700">{apiStatus.message}</AlertDescription>
              </div>
            ) : (
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{apiStatus.message}</AlertDescription>
              </div>
            )}
          </Alert>
        </div>
      )}

      {/* Profile Content - Only shown when data is loaded */}
      {userInfo?.data?.user && (
        <>
          {/* Profile Header */}
          <section className="py-2 mt-4 bg-slate-50/75 md:mt-16">
            <div className="max-w-6xl mx-auto px-4">
              <FadeInWhenVisible>
                <div className="flex items-center gap-6">
                  <motion.div
                    className="h-24 w-24 rounded-full bg-gray-100 border-4 border-white shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    {userInfo?.data?.user?.image && (
                      <img
                        src={userInfo.data.user.image}
                        alt={userInfo.data.user.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    )}
                  </motion.div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-medium">
                        {userInfo?.data?.user?.name || 'Unknown User'}
                      </h1>
                      <Badge variant="outline" className={
                        userInfo?.data?.user?.email_verified 
                          ? "border-green-100 bg-green-50 text-green-600" 
                          : "border-yellow-100 bg-yellow-50 text-yellow-600"
                      }>
                        {userInfo?.data?.user?.email_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Member since {new Date(
                        userInfo?.data?.user?.created_at || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </section>

          {/* User Interests/Tags Section */}
          <section className="py-4">
            <div className="max-w-6xl mx-auto px-4">
              <FadeInWhenVisible delay={0.4}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="homepage_section" size="lg">My Interests</Badge>
                    <button
                      className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                      onClick={() => setIsEditingTags(!isEditingTags)}
                      disabled={settingsLoading}
                    >
                      {isEditingTags ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {!isEditingTags ? (
                    <div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {userSetting?.setting?.key_message_tags?.map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 bg-blue-50 text-blue-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {(!userSetting?.setting?.key_message_tags?.length) && (
                          <p className="text-gray-500 italic">No tags selected yet</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {[
                          'Work communications',
                          'Personal messages',
                          'Financial notifications',
                          'Administrative updates',
                          'Promotional content',
                          'Newsletters and subscriptions',
                          'Social media notifications',
                          'Calendar invites and event updates',
                          'Travel-related emails',
                          'Shopping and order updates'
                        ].map((tag) => (
                          <button
                            key={tag}
                            className={`px-3 py-1 rounded-md text-sm ${
                              selectedTags.includes(tag)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>

                      <form onSubmit={addCustomTag} className="mb-4 flex gap-2">
                        <Input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Type a custom interest..."
                          className="flex-1"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
                          disabled={!newTag.trim()}
                        >
                          Add
                        </button>
                      </form>

                      <div className="mb-4">
                        <Label className="text-sm text-gray-500 mb-2">Selected Interests:</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-3 py-1 bg-blue-50 text-blue-700 flex items-center gap-1"
                            >
                              {tag}
                              <button
                                onClick={() => toggleTag(tag)}
                                className="ml-1 hover:text-red-500"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                          onClick={() => {
                            const existingTags = userSetting?.data?.setting?.key_message_tags || [];
                            if (existingTags.length > 0) {
                              setSelectedTags(existingTags);
                            }
                            setIsEditingTags(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                          onClick={saveTagChanges}
                          disabled={settingsLoading}
                        >
                          {settingsLoading ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </FadeInWhenVisible>
            </div>
          </section>

           {/* Connected Platforms */}
           <section className="py-2">
            <div className="max-w-6xl mx-auto px-4">
              <FadeInWhenVisible delay={0.2}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <Badge variant="homepage_section" size="lg">Connected Platforms</Badge>
                  </div>

                  <div className="space-y-6">
                    {/* Gmail Connection */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#DB4437">
                            <path d="M20,18h-2V9.8l-6,4.5L6,9.8V18H4V6h1.2l8.8,6.6L22.8,6H24V18z M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Gmail</div>
                          <div className="text-sm text-gray-500">{userInfo?.data?.user?.email}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="outline" className="border-green-100 bg-green-50 text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1"/> Connected
                        </Badge>
                        <span className="text-xs text-gray-400 mt-1">
                          Since {new Date(userInfo?.data?.user?.created_at || '').toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Outlook Connection - Example of not connected platform */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#0078D4">
                            <path d="M21.179,4.828v14.344h-7.658v-14.344h7.658Zm-9.237,0v14.344H2v-14.344h9.942Zm-1.577,1.577H3.577v11.19h6.788v-11.19Zm9.237,0h-6.08v11.19h6.08v-11.19Zm-12.871,1.893h-3.364v1.366h3.364v-1.366Zm0,2.733h-3.364v1.366h3.364v-1.366Zm0,2.733h-3.364v1.366h3.364v-1.366Zm8.396-5.466h-3.364v1.366h3.364v-1.366Zm0,2.733h-3.364v1.366h3.364v-1.366Zm0,2.733h-3.364v1.366h3.364v-1.366Z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Outlook</div>
                          <div className="text-sm text-gray-500">Not connected</div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </section>
        </>
      )}
    </div>
  );
}