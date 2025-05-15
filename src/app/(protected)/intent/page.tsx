'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Card, CardContent} from '@/components/ui/card'
import {Plus} from 'lucide-react'
import {createUserSettings, getUserSettings} from "@/lib/requests/client/user-settings";

interface EmailCategory {
  id: string
  name: string
  selected: boolean
}

export default function UserIntentPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<EmailCategory[]>([
    {id: 'work', name: 'Work Communications', selected: false},
    {id: 'personal', name: 'Personal Messages', selected: false},
    {id: 'financial', name: 'Financial Notifications', selected: false},
    {id: 'administrative', name: 'Administrative Updates', selected: false},
    {id: 'promotional', name: 'Promotional Content', selected: false},
    {id: 'newsletters', name: 'Newsletters and Subscriptions', selected: false},
    {id: 'social', name: 'Social Media Notifications', selected: false},
    {id: 'calendar', name: 'Calendar Invites and Event Updates', selected: false},
    {id: 'travel', name: 'Travel-related', selected: false},
    {id: 'shopping', name: 'Shopping and Order Updates', selected: false},
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customCategory, setCustomCategory] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const toggleCategory = (id: string) => {
    setCategories(categories.map(category =>
      category.id === id ? {...category, selected: !category.selected} : category
    ))
  }

  const addCustomCategory = () => {
    if (customCategory.trim()) {
      const newId = `custom-${Date.now()}`
      setCategories([
        ...categories,
        {id: newId, name: customCategory.trim(), selected: true}
      ])
      setCustomCategory('')
      setShowCustomInput(false)
    }
  }

  useEffect(() => {
    // go to dashboard if user already has settings
    getUserSettings().then((resp) => {
      if (resp.data.setting) {
        router.push("/dashboard")
      }
    })
  }, []);

  const handleSubmit = async () => {
    if (isSubmitting) {
      return
    }
    setIsSubmitting(true)
    createUserSettings({
      key_message_tags: categories.filter(categories => categories.selected).map(category => category.name)
    }).then(() => {
      router.push("/dashboard")
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  const hasSelections = categories.some(category => category.selected)

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardContent className="pt-6 pb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-6">
            Select the types of emails matter most to you.
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-4 py-3 rounded-lg text-left transition-colors ${
                  category.selected
                    ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category.name}
              </button>
            ))}

            {!showCustomInput && (
              <button
                onClick={() => setShowCustomInput(true)}
                className="px-4 py-3 rounded-lg text-left bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center"
              >
                <Plus className="w-5 h-5 mr-2"/>
                <span>Add custom</span>
              </button>
            )}
          </div>

          {showCustomInput && (
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && addCustomCategory()}
              />
              <Button onClick={addCustomCategory} variant="secondary">Add</Button>
              <Button
                onClick={() => setShowCustomInput(false)}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-x-4">
            <Button
              onClick={handleSubmit}
              disabled={!hasSelections || isSubmitting}
              className="px-8 py-6 text-lg"
            >
              {isSubmitting ? 'Saving...' : 'Continue'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                router.push("/dashboard")
              }}
              disabled={isSubmitting}
              className="px-8 py-6 text-lg hover:bg-gray-400"
            >
              Skip
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
