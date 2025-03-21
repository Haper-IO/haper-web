import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

// Types for backend data
export interface MessageStatsData {
  timeRange: string;
  essentialCount: number;
  essentialPercentage: number;
  nonEssentialCount: number;
  nonEssentialPercentage: number;
}

export interface EmailSummaryData {
  title: string;
  updateTime: string;
  content: string;
  highlightedPeople: Array<{name: string, context: string}>;
}

export interface UserData {
  id: string;
  name: string;
  image: string;
  email: string;
  email_verified: boolean;
  created_at: string;
}

// API service for user data
const fetchUserInfo = async (): Promise<UserData> => {
  try {
    // API call to get user info
    const response = await fetch('/api/v1/user/info', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();

    if (result.status !== 0) {
      throw new Error(result.message || 'Failed to fetch user info');
    }

    return result.data.user;
  } catch (error) {
    console.error('Error fetching user info:', error);
    // Return default user data in case of error
    return {
      id: '',
      name: 'Guest User',
      image: '',
      email: '',
      email_verified: false,
      created_at: ''
    };
  }
};

// Email Summary Component
export function EmailSummaryWithStats({
                                        summaryData = {
                                          title: "You received 3 Essential Emails in the Past 3 hours",
                                          updateTime: "3 mins ago",
                                          content: "In the past 3 hours, You have received 1 invitation from Grant about your upcoming trip, 1 reply from Alice about your car rental project, 1 email from your instructor Dr. Bieler discussing your essay topics.",
                                          highlightedPeople: [
                                            {name: "Grant", context: "invitation"},
                                            {name: "Alice", context: "car rental project"},
                                            {name: "Dr. Bieler", context: "essay topics"}
                                          ]
                                        },
                                        statsData = {
                                          timeRange: "3 hours",
                                          essentialCount: 39,
                                          essentialPercentage: 13.9,
                                          nonEssentialCount: 69,
                                          nonEssentialPercentage: 22.8
                                        },
                                        onBatchAction
                                      }: {
  summaryData?: EmailSummaryData,
  statsData?: MessageStatsData,
  onBatchAction?: () => void
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data when component mounts
    const getUserData = async () => {
      setLoading(true);
      try {
        const userData = await fetchUserInfo();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  // Function to highlight names
  const renderHighlightedContent = (content: string, highlights: Array<{name: string}>) => {
    let result = content;
    highlights.forEach(person => {
      result = result.replace(
        person.name,
        `<span class="text-lime-600">${person.name}</span>`
      );
    });

    return <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: result }} />;
  };

  const handleBatchAction = () => {
    if (onBatchAction) {
      onBatchAction();
    } else {
      router.push("/report");
    }
  };

  // Personalize title if user data is available
  const personalizedTitle = user && user.name
    ? summaryData.title.replace("You received", `${user.name} received`)
    : summaryData.title;

  // Personalize content if user data is available
  const personalizedContent = user && user.name
    ? summaryData.content.replace("You have received", `${user.name} has received`)
    : summaryData.content;

  const userSummaryData = {
    ...summaryData,
    title: personalizedTitle,
    content: personalizedContent
  };

  return (
    <Card className="bg-slate-200/50">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <Badge variant="emphasis" size="md">Summary</Badge>
        <Badge variant="secondary" size="md">Updated {summaryData.updateTime}</Badge>
        <Mail className="ml-auto h-4 w-4 text-gray-400" />
      </CardHeader>
      <div>
        {loading ? (
          <CardContent>
            <p className="text-gray-500">Loading user data...</p>
          </CardContent>
        ) : (
          <div className="flex flex-col lg:flex-row flex-wrap gap-4">
            {/* User Info (if available) */}
            {user && (
              <CardContent className="w-full">
                <div className="flex items-center gap-3">
                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">{user.name || "Guest User"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </CardContent>
            )}

            {/* Email Summary */}
            <CardContent className="flex-1 min-w-[300px] lg:min-w-[420px] space-y-4 lg:w-3/5 ">
              <h3 className="font-medium text-gray-900">
                {userSummaryData.title}
              </h3>
              <div className="px-3 py-3 bg-slate-50/70 rounded-md">
                {renderHighlightedContent(userSummaryData.content, summaryData.highlightedPeople)}
              </div>
            </CardContent>

            {/* Message Stats Statistics */}
            <CardContent className="flex-1 min-w-[300px] lg:min-w-[400px] lg:w-2/5">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative h-40 w-40">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#92bfff"
                      strokeWidth="4"
                      strokeDasharray="100.53 100"
                      transform="rotate(-90 18 18)"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#94e9b8"
                      strokeWidth="4"
                      strokeDasharray={`${statsData.essentialPercentage} 100`}
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#92bfff]" />
                    <span className="text-sm text-gray-600">Essential ({statsData.essentialCount})</span>
                    <span className="ml-auto text-sm font-medium">{statsData.essentialPercentage}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#94e9b8]" />
                    <span className="text-sm text-gray-600">Non-essential ({statsData.nonEssentialCount})</span>
                    <span className="ml-auto text-sm font-medium">{statsData.nonEssentialPercentage}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        )}

        {/* Button Section */}
        <CardContent>
          <div className="pt-3 flex justify-center sm:justify-start">
            <Button variant="default" onClick={handleBatchAction}>
              Quick Batch Actions
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function EmailSummaryHistory({
                                      summaryData = {
                                        title: "You received 3 Essential Emails in the Past 3 hours",
                                        updateTime: "3 mins ago",
                                        content: "In the past 3 hours, You have received 1 invitation from Grant about your upcoming trip, 1 reply from Alice about your car rental project, 1 email from your instructor Dr. Bieler discussing your essay topics.",
                                        highlightedPeople: [
                                          {name: "Grant", context: "invitation"},
                                          {name: "Alice", context: "car rental project"},
                                          {name: "Dr. Bieler", context: "essay topics"}
                                        ]
                                      },
                                      onCheckLastReport
                                    }: {
  summaryData?: EmailSummaryData,
  onCheckLastReport?: () => void
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data when component mounts
    const getUserData = async () => {
      setLoading(true);
      try {
        const userData = await fetchUserInfo();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  // Function to highlight names
  const renderHighlightedContent = (content: string, highlights: Array<{name: string}>) => {
    let result = content;
    highlights.forEach(person => {
      result = result.replace(
        person.name,
        `<span class="text-lime-600">${person.name}</span>`
      );
    });

    return <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: result }} />;
  };

  const handleCheckLastReport = () => {
    if (onCheckLastReport) {
      onCheckLastReport();
    } else {
      router.push("/report");
    }
  };

  // Personalize title if user data is available
  const personalizedTitle = user && user.name
    ? summaryData.title.replace("You received", `${user.name} received`)
    : summaryData.title;

  // Personalize content if user data is available
  const personalizedContent = user && user.name
    ? summaryData.content.replace("You have received", `${user.name} has received`)
    : summaryData.content;

  const userSummaryData = {
    ...summaryData,
    title: personalizedTitle,
    content: personalizedContent
  };

  return (
    <Card className="bg-slate-200/50">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <Badge variant="default" size="md">Summary</Badge>
        <Badge variant="secondary" size="md">Updated {summaryData.updateTime}</Badge>
        <Mail className="ml-auto h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent className="container space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading user data...</p>
        ) : (
          <>
            {/* User Info (if available) */}
            {user && (
              <div className="flex items-center gap-3 mb-4">
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-10 w-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{user.name || "Guest User"}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )}

            <h3 className="font-medium text-gray-900">
              {userSummaryData.title}
            </h3>
            <div className="px-2 py-2 bg-slate-50/80 rounded-md">
              {renderHighlightedContent(userSummaryData.content, summaryData.highlightedPeople)}
            </div>
          </>
        )}
        <div className="pt-3">
          <Button variant="outline" className="ml-auto" onClick={handleCheckLastReport}>
            Check Last Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
