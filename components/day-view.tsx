"use client"

import type React from "react"
import { useState, useRef } from "react"
import { format } from "date-fns"
import { Maximize2, Play, Pause, Upload, X } from "lucide-react"
import Image from "next/image"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ContentItem } from "@/lib/types"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface ContentDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddContent: (content: ContentItem) => void
  selectedDate: Date
}

export function ContentDialog({ isOpen, onClose, onAddContent, selectedDate }: ContentDialogProps) {
  const [platform, setPlatform] = useState("")
  const [time, setTime] = useState("12:00")
  const [script, setScript] = useState("")

  // File state management
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  // States for fullscreen views
  const [assetsFullscreen, setAssetsFullscreen] = useState(false)
  const [audioFullscreen, setAudioFullscreen] = useState(false)

  // Sample placeholder images and audio files
  const placeholderImages = [
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
  ]

  const placeholderAudios = [
    { name: "Voice Recording 1", src: "https://example.com/audio1.mp3" },
    { name: "Voice Recording 2", src: "https://example.com/audio2.mp3" },
    { name: "Voice Recording 3", src: "https://example.com/audio3.mp3" },
    { name: "Voice Recording 4", src: "https://example.com/audio4.mp3" },
    { name: "Voice Recording 5", src: "https://example.com/audio5.mp3" },
  ]

  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setCoverImage(imageUrl)
    }
  }

  const handleRemoveCoverImage = () => {
    setCoverImage(null)
    if (coverInputRef.current) {
      coverInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!platform.trim() || !time.trim()) return

    const dateString = format(selectedDate, "yyyy-MM-dd")
    const dateTimeString = `${dateString}T${time}:00`

    onAddContent({
      id: Date.now().toString(),
      platform,
      time,
      assets: "", // We're not using the text input anymore
      script,
      voiceRecordings: "", // We're not using the text input anymore
      cover: coverImage || "", // Use the image URL
      date: dateTimeString,
    })

    // Reset form
    setPlatform("")
    setTime("12:00")
    setScript("")
    setCoverImage(null)
    if (coverInputRef.current) {
      coverInputRef.current.value = ""
    }
  }

  const toggleAudioPlay = (src: string) => {
    if (playingAudio === src) {
      setPlayingAudio(null)
    } else {
      setPlayingAudio(src)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Social Media Post for {format(selectedDate, "MMMM d, yyyy")}</DialogTitle>
            <DialogDescription>
              Schedule a new social media post for this date. Fill in all the details for your content.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Cover field with file input and preview */}
              <div className="space-y-2">
                <Label htmlFor="cover">Cover</Label>
                <div className="flex flex-col gap-2">
                  {coverImage ? (
                    <div className="relative rounded-md overflow-hidden border">
                      <Image
                        src={coverImage || "/placeholder.svg"}
                        alt="Cover preview"
                        className="w-full h-48 object-cover"
                        width={800}
                        height={400}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={handleRemoveCoverImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload cover image</p>
                      <Input
                        ref={coverInputRef}
                        id="cover"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => coverInputRef.current?.click()}
                        className="mt-2"
                      >
                        Select Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Twitch">Twitch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Post Time</Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assets">Assets</Label>
                {/* Asset preview section - removed text input */}
                <div
                  className="grid grid-cols-3 gap-2 cursor-pointer border rounded-md p-2 hover:bg-muted/50 transition-colors"
                  onClick={() => setAssetsFullscreen(true)}
                >
                  {placeholderImages.slice(0, 3).map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Asset preview ${index + 1}`}
                        className="object-cover w-full h-full"
                        width={200}
                        height={200}
                      />
                      {index === 2 && placeholderImages.length > 3 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                          <div className="flex flex-col items-center">
                            <Maximize2 className="h-5 w-5" />
                            <span>+{placeholderImages.length - 3}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="script">Script/Caption</Label>
                <Textarea
                  id="script"
                  placeholder="Write your post content here..."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voiceRecordings">Voice Recordings</Label>
                {/* Voice recordings preview - removed text input */}
                <div
                  className="space-y-2 border rounded-md p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setAudioFullscreen(true)}
                >
                  {placeholderAudios.slice(0, 3).map((audio, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/20 rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleAudioPlay(audio.src)
                        }}
                      >
                        {playingAudio === audio.src ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div className="text-sm truncate">{audio.name}</div>
                    </div>
                  ))}
                  {placeholderAudios.length > 3 && (
                    <div className="text-center text-sm text-muted-foreground">
                      +{placeholderAudios.length - 3} more recordings
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Schedule Post</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Assets Sheet */}
      <Sheet open={assetsFullscreen} onOpenChange={setAssetsFullscreen}>
        <SheetContent side="bottom" className="h-[90vh] sm:max-w-full">
          <SheetHeader>
            <SheetTitle>Assets</SheetTitle>
            <SheetDescription>All images and videos for this post</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {placeholderImages.map((img, index) => (
              <div key={index} className="aspect-square rounded-md overflow-hidden">
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Asset ${index + 1}`}
                  className="object-cover w-full h-full"
                  width={300}
                  height={300}
                />
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Fullscreen Audio Sheet */}
      <Sheet open={audioFullscreen} onOpenChange={setAudioFullscreen}>
        <SheetContent side="bottom" className="h-[90vh] sm:max-w-full">
          <SheetHeader>
            <SheetTitle>Voice Recordings</SheetTitle>
            <SheetDescription>All audio recordings for this post</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {placeholderAudios.map((audio, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-muted/20 rounded-md">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => toggleAudioPlay(audio.src)}
                >
                  {playingAudio === audio.src ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <div className="flex-1">
                  <div className="font-medium">{audio.name}</div>
                  <div className="h-1 w-full bg-muted-foreground/30 rounded-full mt-2">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: playingAudio === audio.src ? "60%" : "0%" }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {playingAudio === audio.src ? "1:24 / 2:30" : "2:30"}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

interface DayViewProps {
  contentItems: ContentItem[]
}

export function DayView({ contentItems }: DayViewProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {contentItems.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{item.platform}</div>
              <div className="text-sm text-muted-foreground">{item.time}</div>
            </div>
            {item.cover && (
              <Image src={item.cover} alt="Content cover" className="w-full h-48 object-cover rounded-md mb-2" width={800} height={400} />
            )}
            <p className="text-sm">{item.script}</p>
          </div>
        ))}
        {contentItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No content scheduled for this day
          </div>
        )}
      </div>
    </div>
  )
}
