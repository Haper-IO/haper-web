'use client'

import {motion} from 'framer-motion'
import {useUserInfo} from '@/hooks/useUserInfo'
import {Badge} from "@/components/ui/badge"
import {Label} from "@/components/ui/label"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {FadeInWhenVisible} from "@/components/background-effect/fade-in-when-visible"
import {CheckCircle} from 'lucide-react'
import {Input} from "@/components/ui/input"
import React, {useState, useEffect} from "react"
import {
  getUserSettings,
  updateUserSettings,
  UserSettings,
} from "@/lib/requests/client/user-settings"
import {GmailIcon, OutlookIcon} from "@/icons/provider-icons";
import Image from "next/image";

export default function MyInterestsPage() {
  const {userInfo, loading: userLoading} = useUserInfo();
  const [userSetting, setUserSetting] = useState<UserSettings | null>(null)
  const [isLoadingSetting, setIsLoadingSetting] = useState(false)
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const fetchSettings = () => {
    if (isLoadingSetting) {
      return
    }
    setIsLoadingSetting(true)
    getUserSettings().then((resp) => {
      setUserSetting(resp.data.setting)
      if (resp.data.setting) {
        setSelectedTags(resp.data.setting.key_message_tags)
      }
    }).finally(() => {
      setIsLoadingSetting(false)
    })
  }



  const updateSetting = (settings: UserSettings) => {
    if (isLoadingSetting) {
      return
    }
    setIsLoadingSetting(true)
    updateUserSettings(settings).then((resp) => {
      setUserSetting(resp.data.setting)
    }).finally(() => {
      setIsLoadingSetting(false)
    })
  }

  useEffect(() => {
    fetchSettings()
  }, [])



  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  };

  // Save changes
  const saveTagChanges = () => {
    // validation for empty array
    if (!selectedTags || selectedTags.length === 0) {
      return;
    }

    const requestBody: UserSettings = {
      key_message_tags: selectedTags
    };

    // Update settings (will create if doesn't exist)
    updateSetting(requestBody);

    setIsEditingTags(false);
  };

  // Add custom tag
  const addCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag(""); // Clear the input after adding
    }
  };

  if (userLoading) {
    return (
      <div className="relative w-full min-h-screen bg-gray-50 justify-center">
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
      {/* Profile Content - Only shown when data is loaded */}
      {userInfo && (
        <>
          {/* Profile Header */}
          <section className="py-2 mt-4 bg-slate-50/75 md:mt-16">
            <div className="max-w-6xl mx-auto px-4">
              <FadeInWhenVisible>
                <div className="flex items-center gap-6">
                  <motion.div
                    className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg"
                    whileHover={{scale: 1.05}}
                  >
                    {userInfo.image && (
                      <Image
                        src={userInfo.image}
                        alt="profile-image"
                        className="object-contain"
                        fill
                      />
                    )}
                  </motion.div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-medium">
                        {userInfo.name || 'Unknown User'}
                      </h1>
                      <Badge variant="outline" className={
                        userInfo.email_verified
                          ? "border-green-100 bg-green-50 text-green-600"
                          : "border-yellow-100 bg-yellow-50 text-yellow-600"
                      }>
                        {userInfo.email_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Member since {new Date(
                      userInfo.created_at || Date.now()
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
                      onClick={() => {
                        setIsEditingTags(!isEditingTags)
                      }}
                      disabled={isLoadingSetting}
                    >
                      {isEditingTags ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {!isEditingTags ? (
                    <div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {userSetting?.key_message_tags?.map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 bg-blue-50 text-blue-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {(!userSetting?.key_message_tags?.length) && (
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
                            const existingTags = userSetting?.key_message_tags || [];
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
                          disabled={isLoadingSetting}
                        >
                          {isLoadingSetting ? 'Saving...' : 'Save'}
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
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                          <GmailIcon/>
                        </div>
                        <div>
                          <div className="font-medium">Gmail</div>
                          <div className="text-sm text-gray-500">{userInfo?.email}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="outline" className="border-green-100 bg-green-50 text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1"/> Connected
                        </Badge>
                        {/*<span className="text-xs text-gray-400 mt-1">*/}
                        {/*  Since {new Date(userInfo?.created_at || '').toLocaleDateString()}*/}
                        {/*</span>*/}
                      </div>
                    </div>

                    {/* Outlook Connection - Example of not connected platform */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                          <OutlookIcon/>
                        </div>
                        <div>
                          <div className="font-medium">Outlook</div>
                          <div className="text-sm text-gray-500">Not connected</div>
                        </div>
                      </div>
                      <button
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
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
