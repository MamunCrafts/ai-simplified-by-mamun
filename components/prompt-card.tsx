"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Copy, ExternalLink } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import type { Prompt } from "@/lib/types"

interface PromptCardProps {
  prompt: Prompt,
  profile: {
    full_name?: string
    username?: string
    avatar_url?: string
  }
    
  
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const authorName = prompt.profiles?.full_name || prompt.profiles?.username || "Anonymous"
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {prompt.image_url && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img src={prompt.image_url || "/placeholder.svg"} alt={prompt.title} className="w-full h-full object-cover" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/prompts/${prompt.id}`} className="flex-1">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-blue-600 transition-colors">
              {prompt.title}
            </h3>
          </Link>
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {prompt.description && <p className="text-sm text-muted-foreground line-clamp-2">{prompt.description}</p>}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">{prompt.content}</p>

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {prompt.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {prompt.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{prompt.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Category */}
          {prompt.category && (
            <Badge variant="outline" className="mb-4">
              {prompt.category}
            </Badge>
          )}
        </div>

        {/* Author and Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={prompt.profiles?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{authorName}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/prompts/${prompt.id}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            {copied && <span className="text-xs text-green-600 dark:text-green-400">Copied!</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
