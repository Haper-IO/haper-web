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
          <Card className="max-w-6xl mx-auto bg-slate-50/30 backdrop-blur-[2px]">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-slate-900">My Interests</CardTitle>
              <CardDescription className="text-sm text-slate-600">Loading your interests...</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12">
              <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin"></div>
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
                <Card className="max-w-6xl mx-auto bg-slate-50/30 backdrop-blur-[2px]">
                  <CardHeader className="flex flex-row items-center justify-between pb-6">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-medium text-slate-900">My Monitored Topics</CardTitle>
                      <CardDescription className="text-sm text-slate-600">
                        Select or add the topics you want to keep an eye on. Haper will still keep an eye on other topics, but will prioritize these.
                      </CardDescription>
                    </div>
                    <Button
                        variant={isEditingTags ? "outline" : "default"}
                        onClick={() => setIsEditingTags(!isEditingTags)}
                        disabled={isLoadingSetting}
                        size="sm"
                        className="h-9"
                    >
                      {isEditingTags ? "Cancel" : "Edit"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {!isEditingTags ? (
                        <div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {userSetting?.key_message_tags?.map((tag: string, index: number) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="px-3 py-1.5 text-sm text-slate-700 bg-slate-100 border border-slate-200/80"
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
                            <h3 className="text-sm font-medium text-slate-800 mb-3">Choose from common interests:</h3>
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
                                          selectedTags.includes(tag) ? 'bg-slate-500 hover:bg-slate-600 text-white' : ''
                                      }`}
                                      onClick={() => toggleTag(tag)}
                                  >
                                    {tag}
                                  </Button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-slate-800 mb-3">Add a custom interest:</h3>
                            <form onSubmit={addCustomTag} className="flex gap-2">
                              <Input
                                  type="text"
                                  value={newTag}
                                  onChange={(e) => setNewTag(e.target.value)}
                                  placeholder="Type a custom interest..."
                                  className="flex-1 text-sm"
                              />
                              <Button
                                  type="submit"
                                  variant="secondary"
                                  size="sm"
                                  disabled={!newTag.trim()}
                              >
                                Add
                              </Button>
                            </form>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-slate-800 mb-3 block">Your selected interests:</Label>
                            <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-white min-h-[100px]">
                              {selectedTags.length > 0 ? (
                                  selectedTags.map((tag, index) => (
                                      <Badge
                                          key={index}
                                          variant="secondary"
                                          className="group text-sm px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-800 flex items-center gap-1 hover:bg-slate-200 transition-colors"
                                      >
                                        {tag}
                                        <button
                                            onClick={() => toggleTag(tag)}
                                            className="ml-1.5 rounded-full hover:bg-slate-200 h-4 w-4 inline-flex items-center justify-center"
                                            aria-label={`Remove ${tag}`}
                                        >
                                          ×
                                        </button>
                                      </Badge>
                                  ))
                              ) : (
                                  <p className="text-sm text-slate-500 italic">No interests selected yet</p>
                              )}
                            </div>
                          </div>
                        </div>
                    )}
                  </CardContent>
                  {isEditingTags && (
                      <CardFooter className="flex justify-end gap-2 border-t pt-4">
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
                        >
                          Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={saveTagChanges}
                            disabled={isLoadingSetting || selectedTags.length === 0}
                        >
                          {isLoadingSetting ? 'Saving...' : 'Save'}
                        </Button>
                      </CardFooter>
                  )}
                </Card>
              </>
          )}
        </div>
      </>
  );
}
