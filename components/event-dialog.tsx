"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Event } from "@/lib/types"

interface EventDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddEvent: (event: Event) => void
  selectedDate: Date
}

export function EventDialog({ isOpen, onClose, onAddEvent, selectedDate }: EventDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState("12:00")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    const dateString = format(selectedDate, "yyyy-MM-dd")
    const dateTimeString = `${dateString}T${time}:00`

    onAddEvent({
      id: Date.now().toString(),
      title,
      description,
      date: dateTimeString,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setTime("12:00")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Event for {format(selectedDate, "MMMM d, yyyy")}</DialogTitle>
          <DialogDescription>Create a new event for this date. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
