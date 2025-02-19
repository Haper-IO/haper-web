'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, MoreVertical, ChevronDown, Mail } from 'lucide-react'
import Link from 'next/link'

interface EmailItem {
  id: string
  sender: string
  subject: string
  time: string
  preview?: string
  isRead: boolean
  hasReply?: boolean
  replyText?: string
}

export default function ReportPage() {
  const [showReply, setShowReply] = useState(false)

  const essentialEmails: EmailItem[] = [
    {
      id: '1',
      sender: 'Alice Smith',
      subject: 'Re: Project Update',
      time: 'Thu Feb 6 2:22 PM',
      preview: 'Ms. Alice has reviewed your car rental budget. While generally satisfactory, she\'s flagged insurance costs for discussion tomorrow.',
      isRead: false
    },
    {
      id: '2',
      sender: 'John Grant',
      subject: 'Re: Project Update',
      time: 'Thu Feb 6 2:22 PM',
      preview: 'Mr. Grant has extended an invitation for a Lake Tahoe weekend getaway (April 12-14) with Sarah and Mike. This requires your response.',
      isRead: false
    },
    {
      id: '3',
      sender: 'Roger Bieler',
      subject: 'Re: Project Update',
      time: 'Thu Feb 6 2:22 PM',
      preview: 'Your instructor has provided constructive feedback on your essay topic, suggesting to refine your sustainable urban development focus specifically to public transportation in major cities.',
      isRead: false,
      hasReply: true,
      replyText: 'Dear Professor,\nThank you for your thoughtful feedback. I agree that focusing on public transportation systems would provide a more focused analysis. Would it be acceptable to specifically examine case studies from New York, Tokyo, and London? I look forward to your guidance.\nBest regards'
    }
  ]

  const nonEssentialEmails: EmailItem[] = Array(8).fill(null).map((_, index) => ({
    id: `ne-${index + 1}`,
    sender: 'John Grant',
    subject: 'Re: Project Update',
    time: 'Thu Feb 6 2:22 PM',
    isRead: false
  }))

  const toggleReply = () => {
    setShowReply(!showReply)
  }

  const markAsRead = (email: EmailItem) => {
    // This would update the backend in a real implementation
    console.log(`Marking email ${email.id} as read`)
  }

  const applyToAll = () => {
    // This would batch update all emails in a real implementation
    console.log('Applying read status to all emails')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="container mx-auto">
          <Link href="/dashboard" className="inline-flex items-center text-slate-600 hover:text-slate-900">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Check Today's Report
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Essential Emails Section */}
          <div>
            <Card className="overflow-hidden">
              <div className="p-4 bg-slate-50 border-b">
                <div className="flex items-center mb-2">
                  <Badge variant="default" className="bg-slate-800 text-white mr-3">Essential</Badge>
                  <span className="text-sm text-slate-500">Updated 3 mins ago</span>
                </div>
                <h2 className="text-lg font-medium">You received 3 Essential Emails in the Past 3 hours</h2>
              </div>

              <div className="divide-y">
                {essentialEmails.map((email) => (
                  <div key={email.id} className="p-4 bg-white">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">{email.sender}</div>
                      <div className="text-xs text-slate-500">{email.time}</div>
                    </div>
                    <div className="text-sm text-slate-700 mb-1">{email.subject}</div>
                    {email.preview && (
                      <p className="text-sm text-slate-600">{email.preview}</p>
                    )}

                    <div className="flex justify-between mt-3">
                      <button
                        className="text-slate-400"
                        onClick={() => {/* handle action */}}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      <button
                        className="inline-flex items-center text-sm text-slate-600 border px-3 py-1 rounded-md"
                        onClick={() => markAsRead(email)}
                      >
                        Marked as Read <ChevronDown className="h-4 w-4 ml-1" />
                      </button>
                    </div>

                    {email.hasReply && (
                      <div className="mt-4">
                        {showReply ? (
                          <div className="border rounded-md p-3 bg-slate-50 mt-2 text-sm whitespace-pre-line">
                            {email.replyText}
                          </div>
                        ) : (
                          <button
                            className="text-sm text-slate-600 hover:text-slate-900"
                            onClick={toggleReply}
                          >
                            Reply Generated <ChevronDown className="h-4 w-4 inline" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border-t flex justify-center">
                <Button variant="secondary" onClick={applyToAll}>
                  Apply All
                </Button>
              </div>

              <div className="p-4 flex justify-start">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
            </Card>
          </div>

          {/* Non-Essential Emails Section */}
          <div>
            <Card className="overflow-hidden">
              <div className="p-4 bg-slate-50 border-b">
                <div className="flex items-center mb-2">
                  <Badge variant="secondary" className="bg-slate-200 text-slate-800 mr-3">Non-Essential</Badge>
                  <span className="text-sm text-slate-500">Updated 3 mins ago</span>
                </div>
                <h2 className="text-lg font-medium">You received 12 Non-Essential Emails in the Past 3 hours</h2>
              </div>

              <div className="divide-y">
                {nonEssentialEmails.map((email) => (
                  <div key={email.id} className="p-4 bg-white">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">{email.sender}</div>
                      <div className="text-xs text-slate-500">{email.time}</div>
                    </div>
                    <div className="text-sm text-slate-700 mb-1">{email.subject}</div>

                    <div className="flex justify-end mt-3">
                      <button
                        className="inline-flex items-center text-sm text-slate-600 border px-3 py-1 rounded-md"
                        onClick={() => markAsRead(email)}
                      >
                        Marked as Read <ChevronDown className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 flex justify-between items-center">
                <Button variant="link" className="text-slate-600">
                  Show All <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
