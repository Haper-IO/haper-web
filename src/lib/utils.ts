import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function for hybrid time formatting
export function formatUpdateTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Less than 1 hour: show minutes
  if (diffInMinutes < 60) {
    if (diffInMinutes < 1) return "Updated just now";
    return `Updated ${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  // Less than 24 hours: show hours
  if (diffInHours < 24) {
    return `Updated ${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  // Less than 7 days: show days
  if (diffInDays < 7) {
    return `Updated ${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  // 7+ days: show absolute time
  return `Updated ${date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(',', ' |')}`;
}
