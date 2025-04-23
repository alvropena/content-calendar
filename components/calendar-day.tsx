"use client"

import { format } from "date-fns"
import { Facebook, Instagram, Twitter, Youtube, Twitch } from "lucide-react"
import type { ContentItem } from "@/lib/types"

interface CalendarDayProps {
  date: Date
  isToday: boolean
  isCurrentMonth: boolean
  contentItems: ContentItem[]
  onClick: () => void
}

export function CalendarDay({ date, isToday, isCurrentMonth, contentItems, onClick }: CalendarDayProps) {
  const getPlatformIcon = (platform: string) => {
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
      default:
        return null
    }
  }

  return (
    <div
      className={`h-24 sm:h-32 p-1 border rounded-md overflow-hidden transition-colors cursor-pointer hover:bg-muted/50 ${
        isToday ? "border-primary" : "border-border"
      } ${isCurrentMonth ? "bg-background" : "bg-muted/20 text-muted-foreground"}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{format(date, "d")}</span>
      </div>
      <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-24px)]">
        {contentItems.map((item, index) => (
          <div
            key={index}
            className="text-xs p-1 rounded flex items-center gap-1"
            style={{
              backgroundColor: getPlatformColor(item.platform),
              color: "white",
            }}
            title={item.script}
          >
            {getPlatformIcon(item.platform)}
            <span className="truncate">{format(new Date(`1970-01-01T${item.time}`), "h:mm a")}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function getPlatformColor(platform: string): string {
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
    default:
      return "#6E6E6E"
  }
}
