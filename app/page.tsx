"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
  startOfWeek,
  endOfWeek,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addYears,
  subYears,
  addDays,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CalendarDay } from "@/components/calendar-day"
import { ContentDialog } from "@/components/content-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DayView } from "@/components/day-view"
import { WeekView } from "@/components/week-view"
import { YearView } from "@/components/year-view"
import type { ContentItem } from "@/lib/types"

type CalendarView = "day" | "week" | "month" | "year"

export default function ContentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [currentView, setCurrentView] = useState<CalendarView>("month")

  const handlePrevious = () => {
    switch (currentView) {
      case "day":
        setCurrentDate(addDays(currentDate, -1))
        break
      case "week":
        setCurrentDate(subWeeks(currentDate, 1))
        break
      case "month":
        setCurrentDate(subMonths(currentDate, 1))
        break
      case "year":
        setCurrentDate(subYears(currentDate, 1))
        break
    }
  }

  const handleNext = () => {
    switch (currentView) {
      case "day":
        setCurrentDate(addDays(currentDate, 1))
        break
      case "week":
        setCurrentDate(addWeeks(currentDate, 1))
        break
      case "month":
        setCurrentDate(addMonths(currentDate, 1))
        break
      case "year":
        setCurrentDate(addYears(currentDate, 1))
        break
    }
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setIsDialogOpen(true)
  }

  const handleAddContent = (content: ContentItem) => {
    setContentItems([...contentItems, content])
    setIsDialogOpen(false)
  }

  const getContentForDate = (date: Date) => {
    return contentItems.filter((content) => {
      const contentDate = parseISO(content.date)
      return isSameDay(contentDate, date)
    })
  }

  const getViewTitle = () => {
    switch (currentView) {
      case "day":
        return format(currentDate, "MMMM d, yyyy")
      case "week":
        const weekStart = startOfWeek(currentDate)
        const weekEnd = endOfWeek(currentDate)
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
      case "month":
        return format(currentDate, "MMMM yyyy")
      case "year":
        return format(currentDate, "yyyy")
      default:
        return ""
    }
  }

  // Month view specific
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Content Calendar</h1>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Select value={currentView} onValueChange={(value) => setCurrentView(value as CalendarView)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold whitespace-nowrap">{getViewTitle()}</h2>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {currentView === "day" && (
        <DayView
          date={currentDate}
          contentItems={contentItems.filter((item) => {
            const itemDate = parseISO(item.date)
            return isSameDay(itemDate, currentDate)
          })}
          onAddContent={handleDayClick}
        />
      )}

      {currentView === "week" && (
        <WeekView date={currentDate} contentItems={contentItems} onAddContent={handleDayClick} />
      )}

      {currentView === "month" && (
        <>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-24 sm:h-32 bg-muted/20 rounded-md"></div>
            ))}

            {monthDays.map((day) => (
              <CalendarDay
                key={day.toString()}
                date={day}
                isToday={isToday(day)}
                isCurrentMonth={isSameMonth(day, currentDate)}
                contentItems={getContentForDate(day)}
                onClick={() => handleDayClick(day)}
              />
            ))}

            {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
              <div key={`empty-end-${index}`} className="h-24 sm:h-32 bg-muted/20 rounded-md"></div>
            ))}
          </div>
        </>
      )}

      {currentView === "year" && (
        <YearView year={currentDate.getFullYear()} contentItems={contentItems} onDayClick={handleDayClick} />
      )}

      {selectedDate && (
        <ContentDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onAddContent={handleAddContent}
          selectedDate={selectedDate}
        />
      )}
    </div>
  )
}
