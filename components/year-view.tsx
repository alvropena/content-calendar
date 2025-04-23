"use client"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
} from "date-fns"
import type { ContentItem } from "@/lib/types"

interface YearViewProps {
  year: number
  contentItems: ContentItem[]
  onDayClick: (date: Date) => void
}

export function YearView({ year, contentItems, onDayClick }: YearViewProps) {
  // Create array of months for the year
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1))

  // Get content items for a specific day
  const getContentForDate = (date: Date) => {
    return contentItems.filter((content) => {
      const contentDate = parseISO(content.date)
      return isSameDay(contentDate, date)
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {months.map((month) => (
        <MonthGrid
          key={month.toString()}
          month={month}
          onDayClick={onDayClick}
          getContentForDate={getContentForDate}
        />
      ))}
    </div>
  )
}

interface MonthGridProps {
  month: Date
  onDayClick: (date: Date) => void
  getContentForDate: (date: Date) => ContentItem[]
}

function MonthGrid({ month, onDayClick, getContentForDate }: MonthGridProps) {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <div className="p-2 border-b bg-muted/20">
        <h3 className="font-medium text-center">{format(month, "MMMM")}</h3>
      </div>
      <div className="grid grid-cols-7 text-center text-xs py-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0 text-center">
        {days.map((day) => {
          const contentCount = getContentForDate(day).length
          const isCurrentMonth = isSameMonth(day, month)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={day.toString()}
              className={`aspect-square flex items-center justify-center text-xs relative cursor-pointer hover:bg-muted/20 ${
                !isCurrentMonth ? "text-muted-foreground" : ""
              }`}
              onClick={() => onDayClick(day)}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full ${
                  isCurrentDay ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {format(day, "d")}
              </div>
              {contentCount > 0 && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
