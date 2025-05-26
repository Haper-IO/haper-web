'use client'

import {useUserInfo} from '@/hooks/useUserInfo'
import {Badge} from "@/components/ui/badge"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import React, {useState, useEffect} from "react"
import {
  getUserSettings,
  updateUserSettings,
  UserSettings,
} from "@/lib/requests/client/user-settings"

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
        <div className="w-full px-4 py-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <Badge variant="outline" size="md" className="bg-slate-50 text-slate-700 border-slate-300 font-medium">My Interests</Badge>
              <Badge variant="secondary" size="md">Loading...</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-64"/>
              <Skeleton className="h-24 w-full"/>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-10 w-full"/>
                <Skeleton className="h-10 w-full"/>
                <Skeleton className="h-10 w-full"/>
              </div>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>My Interests</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-4 pt-2 pb-6">
          {userInfo && (
              <>
                {/* Interests Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                    <Badge variant="outline" size="md" className="bg-slate-50 text-slate-700 border-slate-300 font-medium">My Monitored Topics</Badge>
                    {userSetting?.key_message_tags?.length ? (
                      <Badge variant="secondary" size="md">
                        {userSetting.key_message_tags.length} topic{userSetting.key_message_tags.length === 1 ? '' : 's'}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" size="md">No topics selected</Badge>
                    )}
                    <div className="ml-auto">
                      <Button
                          variant={isEditingTags ? "outline" : "default"}
                          onClick={() => setIsEditingTags(!isEditingTags)}
                          disabled={isLoadingSetting}
                          size="sm"
                          className={isEditingTags ? "" : "bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white shadow-md"}
                      >
                        {isEditingTags ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>

                  <div className="px-6 pb-6">
                    <div className="bg-white/70 backdrop-blur-[2px] rounded-lg shadow-sm border border-slate-200/70 overflow-hidden">
                      <div className="px-4 py-4">
                        <p className="text-sm text-slate-600 mb-4">
                          Select or add the topics you want to keep an eye on. Haper will still keep an eye on other topics, but will prioritize these.
                        </p>

                        {!isEditingTags ? (
                            <div>
                              <div className="flex flex-wrap gap-2">
                                {userSetting?.key_message_tags?.map((tag: string, index: number) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        size="md"
                                        className="bg-slate-50 text-slate-700 border-slate-300"
                                    >
                                      {tag}
                                    </Badge>
                                ))}
                                {(!userSetting?.key_message_tags?.length) && (
                                    <p className="text-sm text-slate-500 italic">No interests selected yet</p>
                                )}
                              </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-3">Choose from common interests:</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {[
                                    'Work communications',
                                    'Personal messages',
                                    'Financial notifications',
                                    'Administrative updates',
                                    'Newsletters and subscriptions',
                                    'Social media notifications',
                                    'Calendar invites and event updates',
                                    'Travel-related emails',
                                    'Shopping and order updates'
                                  ].map((tag) => (
                                      <Button
                                          key={tag}
                                          type="button"
                                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                                          size="sm"
                                          className={`h-auto py-2.5 px-4 whitespace-normal text-left justify-start text-sm ${
                                              selectedTags.includes(tag) 
                                                ? 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white shadow-md' 
                                                : 'border-slate-300/80 hover:bg-slate-100/70 text-slate-700'
                                          }`}
                                          onClick={() => toggleTag(tag)}
                                      >
                                        {tag}
                                      </Button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-3">Add a custom interest:</h4>
                                <form onSubmit={addCustomTag} className="flex gap-2">
                                  <Input
                                      type="text"
                                      value={newTag}
                                      onChange={(e) => setNewTag(e.target.value)}
                                      placeholder="Type a custom interest..."
                                      className="flex-1 text-sm border-slate-300/80"
                                  />
                                  <Button
                                      type="submit"
                                      variant="outline"
                                      size="sm"
                                      disabled={!newTag.trim()}
                                      className="border-slate-300/80 hover:bg-slate-100/70 text-slate-700"
                                  >
                                    Add
                                  </Button>
                                </form>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-3">Your selected interests:</h4>
                                <div className="bg-slate-50/70 backdrop-blur-[2px] rounded-md p-4 border border-slate-200/60 min-h-[100px]">
                                  {selectedTags.length > 0 ? (
                                      <div className="flex flex-wrap gap-2">
                                        {selectedTags.map((tag, index) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                size="md"
                                                className="bg-white text-slate-700 border-slate-300 flex items-center gap-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
                                                onClick={() => toggleTag(tag)}
                                            >
                                              {tag}
                                              <button
                                                  className="ml-1 rounded-full hover:bg-slate-200 h-4 w-4 inline-flex items-center justify-center text-slate-500 hover:text-slate-700"
                                                  aria-label={`Remove ${tag}`}
                                              >
                                                ×
                                              </button>
                                            </Badge>
                                        ))}
                                      </div>
                                  ) : (
                                      <p className="text-sm text-slate-500 italic">No interests selected yet</p>
                                  )}
                                </div>
                              </div>
                            </div>
                        )}
                      </div>

                      {isEditingTags && (
                          <div className="border-t border-slate-100 px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const existingTags = userSetting?.key_message_tags || [];
                                    if (existingTags.length > 0) {
                                      setSelectedTags(existingTags);
                                    }
                                    setIsEditingTags(false);
                                  }}
                                  className="border-slate-300/80 hover:bg-slate-100/70 text-slate-700"
                              >
                                Cancel
                              </Button>
                              <Button
                                  size="sm"
                                  onClick={saveTagChanges}
                                  disabled={isLoadingSetting || selectedTags.length === 0}
                                  className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white shadow-md"
                              >
                                {isLoadingSetting ? 'Saving...' : 'Save'}
                              </Button>
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
                </Card>
              </>
          )}
        </div>
      </>
  );
}
