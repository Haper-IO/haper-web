import { GmailIcon } from "@/icons/gmail-icon"
import { OutlookIcon } from "@/icons/outlook-icon"

const fetchSettings = async () => {
  try {
    setState(prev => ({ ...prev, loading: true }))
    const response = await getUserSettings()
    console.log('Settings response:', response);
    
    // The response from reqHandler.interceptors is already transformed to response.data.data
    setState({
      data: {
        uri: '',
        elapsed: 0,
        status: 0,
        message: '',
        data: {
          setting: response // The interceptor returns the inner data
        }
      },
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

// Update the check in saveTagChanges
const success = userSetting?.data?.setting
  ? await updateUserSetting(requestBody)
  : await createUserSetting(requestBody);

// Update the display section
{userSetting?.data?.setting?.key_message_tags?.map((tag: string, index: number) => (
  <Badge
    key={index}
    variant="secondary"
    className="px-3 py-1 bg-blue-50 text-blue-700"
  >
    {tag}
  </Badge>
))}

// Update the Cancel button
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

const createSetting = async (settings: UserSettings) => {
  try {
    setState(prev => ({ ...prev, loading: true }))
    const response = await createUserSettings(settings)
    setState({
      data: {
        uri: '',
        elapsed: 0,
        status: 0,
        message: '',
        data: {
          setting: response
        }
      },
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
      data: {
        uri: '',
        elapsed: 0,
        status: 0,
        message: '',
        data: {
          setting: response
        }
      },
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

// Then update the Connected Platforms section:
<div className="space-y-6">
  {/* Gmail Connection */}
  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
        <GmailIcon className="w-6 h-6" />
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

  {/* Outlook Connection */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
        <OutlookIcon className="w-6 h-6" />
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