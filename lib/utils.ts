import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Facebook, Instagram, Twitter, Youtube, Twitch, Linkedin, MessageSquare } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPlatformColor(platform: string): string {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "#E1306C"
    case "facebook":
      return "#4267B2"
    case "twitter":
    case "x":
      return "#1DA1F2"
    case "youtube":
      return "#FF0000"
    case "twitch":
      return "#6441A4"
    case "linkedin":
      return "#0077B5"
    case "tiktok":
      return "#000000"
    default:
      return "#6E6E6E"
  }
}

export function getPlatformIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Instagram className="h-3 w-3" />
    case "facebook":
      return <Facebook className="h-3 w-3" />
    case "twitter":
    case "x":
      return <Twitter className="h-3 w-3" />
    case "youtube":
      return <Youtube className="h-3 w-3" />
    case "twitch":
      return <Twitch className="h-3 w-3" />
    case "linkedin":
      return <Linkedin className="h-3 w-3" />
    case "tiktok":
      return <MessageSquare className="h-3 w-3" />
    default:
      return <MessageSquare className="h-3 w-3" />
  }
}
