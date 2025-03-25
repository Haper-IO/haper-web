'use client'

import { motion } from 'framer-motion'
import { useUserInfo } from '@/hooks/useUserInfo'
import { NavigationUnauthenticated } from '@/components/navigation-bar'
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FadeInWhenVisible } from "@/components/background-effect/fade-in-when-visible"
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useEffect, useState } from "react"
import {useUserSetting} from "@/hooks/useUserSetting";


export default function TestProfilePage() {
  const { userInfo, error: userError } = useUserInfo()

  const [apiStatus, setApiStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
  }>({ loading: true })

  const { userSetting, updateUserSetting } = useUserSetting();
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

// Initialize selected tags when userSetting loads
  useEffect(() => {
    if (userSetting?.key_message_tags) {
      setSelectedTags([...userSetting.key_message_tags]);
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
    await updateUserSetting({ key_message_tags: selectedTags });
    setIsEditingTags(false);
  };

  // Log API response for testing
  useEffect(() => {
    console.log('User Info API Response:', { userInfo, error: userError })

    if (userInfo) {
      setApiStatus({
        loading: false,
        success: true,
        message: 'User API request successful!'
      })
    } else if (userError) {
      setApiStatus({
        loading: false,
        success: false,
        message: userError.message || 'Failed to fetch user data'
      })
    }
  }, [userInfo, userError])

  if (userError?.isAuthFail) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <NavigationUnauthenticated />
        <div className="max-w-2xl mx-auto py-24 px-4 bg-gray-950">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Authentication failed. Please login to access your profile.
            </AlertDescription>
          </Alert>
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(userError, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full min-h-screen bg-gray-50 justify-center">
      <NavigationUnauthenticated />

       {/*API Status Banner*/}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Alert variant={apiStatus.success ? "default" : apiStatus.loading ? "default" : "destructive"}>
          {apiStatus.loading ? (
            <div className="flex items-center">
              <div className="h-4 w-4 mr-2 rounded-full bg-blue-500 animate-pulse"></div>
              <AlertDescription>Testing API connection...</AlertDescription>
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

      {/* Profile Content - Only shown when data is loaded */}
      {userInfo && (
        <>
          {/* Profile Header */}
          <section className="py-4 bg-slate-50/75">
            <div className="max-w-6xl mx-auto px-4">
              <FadeInWhenVisible>
                <div className="flex items-center gap-6">
                  <motion.div
                    className="h-24 w-24 rounded-full bg-gray-100 border-4 border-white shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    { userInfo?.data?.user?.image && (
                      <img
                        src={userInfo?.data?.user?.image}
                        alt={userInfo?.data?.user.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    )}
                  </motion.div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-medium">{userInfo?.data?.user?.name}</h1>
                      <div className="flex items-center gap-2">
                        {userInfo?.data?.user?.email_verified ? (
                          <Badge variant="outline" className="border-green-100 bg-green-50 text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1"/> Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-yellow-100 bg-yellow-50 text-yellow-600">
                            <AlertCircle className="h-3 w-3 mr-1"/> Unverified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Member since {new Date(userInfo?.data?.user?.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </section>

          {/*/!* User Interests/Tags - Simplified *!/*!/*/}
          <section className="py-4">
            <div className="max-w-6xl mx-auto px-4">
              <FadeInWhenVisible delay={0.4}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="homepage_section" size="lg">Your Interests</Badge>
                    <button
                      className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                      onClick={() => setIsEditingTags(!isEditingTags)}
                    >
                      {isEditingTags ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {!isEditingTags ? (
                    // Simple tag display
                    <div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {userSetting?.key_message_tags?.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 bg-blue-50 text-blue-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {(!userSetting?.key_message_tags || userSetting.key_message_tags.length === 0) && (
                          <p className="text-gray-500 italic">No tags selected yet</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Simple tag editor
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {['Homework', 'Coop', 'Research', 'Engineering', 'Computer Science'].map((tag) => (
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
                      <div className="flex justify-end">
                        <button
                          className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                          onClick={saveTagChanges}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </FadeInWhenVisible>
            </div>
          </section>

          {/* Connected Platforms */}
          <section className="py-4">
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

          {/* API Test Results */}
          <section className="py-4">
            <div className="max-w-6xl mx-auto px-4">
              <FadeInWhenVisible delay={0.2}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-6">
                    <Badge variant="homepage_section" size="lg">API Test Results</Badge>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-600 block">User Data (JSON)</Label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto max-h-96">
                      <pre className="text-sm">{JSON.stringify(userInfo, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </section>

        </>
      )}
    </div>
  )
}
