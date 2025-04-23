"use client"

import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, isToday } from "date-fns"
import { Plus } from "lucide-react"
import type { ContentItem } from "@/lib/types"
import { getPlatformColor, getPlatformIcon } from "@/lib/utils"

interface WeekViewProps {
  date: Date
  contentItems: ContentItem[]
  onAddContent: (date: Date) => void
}

export function WeekView({ date, contentItems, onAddContent }: WeekViewProps) {
  const weekStart = startOfWeek(date)
  const weekEnd = endOfWeek(date)
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Generate time slots for the day (hourly from 6am to 10pm)
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6 // Start from 6 AM
    return {
      hour,
      label: format(new Date().setHours(hour, 0, 0, 0), "h:00 a"),
    }
  })

  // Get content items for a specific day and hour
  const getItemsForDayAndHour = (day: Date, hour: number) => {
    return contentItems
      .filter((item) => {
        const itemDate = parseISO(item.date)
        const itemHour = Number.parseInt(item.time.split(":")[0])
        return isSameDay(itemDate, day) && itemHour === hour
      })
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="grid grid-cols-8 border-b">
        <div className="p-2 border-r"></div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`p-2 text-center border-r last:border-r-0 ${isToday(day) ? "bg-primary/5" : ""}`}
          >
            <div className="text-sm font-medium">{format(day, "EEE")}</div>
            <div className={`text-lg ${isToday(day) ? "text-primary font-bold" : ""}`}>{format(day, "d")}</div>
          </div>
        ))}
      </div>

      <div className="overflow-auto max-h-[600px]">
        {timeSlots.map((slot) => (
          <div key={slot.hour} className="grid grid-cols-8 border-b last:border-b-0 min-h-[80px]">
            <div className="border-r p-2 flex items-center justify-center">
              <span className="text-xs font-medium">{slot.label}</span>
            </div>

            {days.map((day) => {
              const itemsForHour = getItemsForDayAndHour(day, slot.hour)

              return (
                <div
                  key={day.toString()}
                  className={`border-r last:border-r-0 p-1 ${isToday(day) ? "bg-primary/5" : ""}`}
                  onClick={() => {
                    const newDate = new Date(day)
                    newDate.setHours(slot.hour, 0, 0, 0)
                    onAddContent(newDate)
                  }}
                >
                  {itemsForHour.length === 0 ? (
                    <div className="h-full min-h-[60px] rounded border border-dashed border-muted-foreground/20 flex items-center justify-center cursor-pointer hover:bg-muted/5 transition-colors">
                      <Plus className="h-3 w-3 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {itemsForHour.map((item, index) => (
                        <div
                          key={index}
                          className="p-1 rounded-md text-xs cursor-pointer hover:ring-1 hover:ring-primary transition-all"
                          style={{ backgroundColor: `${getPlatformColor(item.platform)}15` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-[10px]">{item.time}</div>
                            <div
                              className="flex items-center gap-0.5 px-1 py-0.5 rounded-full text-[10px]"
                              style={{ backgroundColor: getPlatformColor(item.platform), color: "white" }}
                            >
                              {getPlatformIcon(item.platform)}
                            </div>
                          </div>
                          <div className="line-clamp-1 text-[10px] mt-0.5">{item.script}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
