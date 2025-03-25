'use client'

import { NavigationUnauthenticated } from '@/components/navigation-bar'
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { FadeInWhenVisible } from "@/components/background-effect/fade-in-when-visible"
import { useUserInfo } from "@/hooks/useUserInfo"
import Link from "next/link"

// Main Component
export default function UserInfoPage() {
  const { user, error } = useUserInfo()

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <NavigationUnauthenticated/>

      {/* User Info Section */}
      <section className="relative min-h-screen py-24 md:py-32 bg-slate-50/75">
        <div className="container px-4 mx-auto">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Home</span>
          </Link>

          <div className="max-w-3xl mx-auto">
            <FadeInWhenVisible>
              <Badge className="mb-6" variant="homepage_section" size="lg">
                <User className="h-4 w-4 mr-2 text-gray-600"/>
                User Profile
              </Badge>

              <h1 className="text-3xl md:text-4xl font-medium text-gray-800 mb-8">
                Your Profile Information
              </h1>

              {error ? (
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
                  <div className="flex items-center text-red-500 mb-4">
                    <AlertCircle className="h-6 w-6 mr-2" />
                    <h2 className="text-xl font-medium">Error Loading Profile</h2>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {error.isAuthFail ?
                      "You need to be logged in to view this page." :
                      "There was an error loading your profile information."}
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    Error message: {error.message}
                  </p>
                  <Button>
                    {error.isAuthFail ? "Log In" : "Try Again"}
                  </Button>
                </div>
              ) : !user ? (
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                  </div>
                  <div className="space-y-4 mt-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                      <div className="flex items-center mb-4 sm:mb-0">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-16 w-16 rounded-full mr-4 object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h2 className="text-2xl font-medium text-gray-800">{user.name}</h2>
                          <p className="text-gray-600">User ID: {user.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                      <Button size="sm">Edit Profile</Button>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                          <p className="text-gray-800">{user.email}</p>
                          <div className="flex items-center mt-1">
                            {user.email_verified ? (
                              <div className="flex items-center text-green-600 text-sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span>Verified</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-amber-600 text-sm">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                <span>Not verified</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Member Since</h3>
                          <p className="text-gray-800">
                            {new Date(user.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Account Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm">Change Password</Button>
                      <Button variant="outline" size="sm">Update Email</Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12 text-center text-gray-600">
                <p>Need help with your account?</p>
                <p className="mt-2">
                  <Link href="#" className="text-blue-600 hover:underline">Contact Support</Link>
                </p>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-2xl font-bold">haper</span>
            </div>

            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right text-gray-500">
                &copy; {new Date().getFullYear()} Built in 2025. Haper. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
