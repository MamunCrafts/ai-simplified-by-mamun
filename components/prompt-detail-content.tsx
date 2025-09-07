"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { PromptCard } from "@/components/prompt-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Plus, Share2, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Prompt } from "@/lib/types"

interface PromptDetailContentProps {
  prompt: Prompt & {
    profiles?: {
      full_name?: string
      username?: string
      avatar_url?: string
      bio?: string
    }
  }
  currentUser: any
  userCollections: { id: string; name: string }[]
  relatedPrompts: (Prompt & {
    profiles?: {
      full_name?: string
      username?: string
      avatar_url?: string
    }
  })[]
}

export function PromptDetailContent({
  prompt,
  currentUser,
  userCollections,
  relatedPrompts,
}: PromptDetailContentProps) {
  const [copied, setCopied] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState("")
  const [isAddingToCollection, setIsAddingToCollection] = useState(false)
  const router = useRouter()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const addToCollection = async () => {
    if (!selectedCollection || !currentUser) return

    setIsAddingToCollection(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("collection_prompts").insert({
        collection_id: selectedCollection,
        prompt_id: prompt.id,
      })

      if (error) throw error
      setSelectedCollection("")
    } catch (error) {
      console.error("Error adding to collection:", error)
    } finally {
      setIsAddingToCollection(false)
    }
  }

  const sharePrompt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt.title,
          text: prompt.description || prompt.title,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        // You could show a toast here
      } catch (err) {
        console.error("Failed to copy URL:", err)
      }
    }
  }

  const authorName = prompt.profiles?.full_name || prompt.profiles?.username || "Anonymous"
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{prompt.title}</h1>
                    {prompt.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-lg">{prompt.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={sharePrompt}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {currentUser && userCollections.length > 0 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Collection
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add to Collection</DialogTitle>
                            <DialogDescription>Choose a collection to add this prompt to</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a collection" />
                              </SelectTrigger>
                              <SelectContent>
                                {userCollections.map((collection) => (
                                  <SelectItem key={collection.id} value={collection.id}>
                                    {collection.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={addToCollection}
                              disabled={!selectedCollection || isAddingToCollection}
                              className="w-full"
                            >
                              {isAddingToCollection ? "Adding..." : "Add to Collection"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>

                {/* Tags and Category */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {prompt.category && (
                    <Badge variant="default" className="text-sm">
                      {prompt.category}
                    </Badge>
                  )}
                  {prompt.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              {/* Prompt Image */}
              {prompt.image_url && (
                <div className="px-6">
                  <img
                    src={prompt.image_url || "/placeholder.svg"}
                    alt={prompt.title}
                    className="w-full max-h-96 object-cover rounded-lg"
                  />
                </div>
              )}
            </Card>

            {/* Prompt Content */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Prompt</CardTitle>
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={prompt.content}
                  readOnly
                  className="min-h-[200px] resize-none bg-gray-50 dark:bg-gray-800"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle>Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={prompt.profiles?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{authorInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">{authorName}</h3>
                    {prompt.profiles?.bio && <p className="text-sm text-muted-foreground">{prompt.profiles.bio}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span>{prompt.category || "Uncategorized"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tags</span>
                  <span>{prompt.tags?.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions for logged-in users */}
            {!currentUser && (
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-medium mb-2">Want to save this prompt?</h3>
                  <p className="text-sm text-muted-foreground mb-4">Sign up to add prompts to your collections</p>
                  <Button asChild className="w-full">
                    <Link href="/auth/sign-up">Sign Up</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Prompts */}
        {relatedPrompts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Prompts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPrompts.map((relatedPrompt) => (
                <PromptCard key={relatedPrompt.id} prompt={relatedPrompt} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
