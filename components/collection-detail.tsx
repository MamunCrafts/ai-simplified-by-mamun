"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PromptCard } from "@/components/prompt-card"
import { Plus, Search, X, Users, Lock } from "lucide-react"
import type { Collection, Prompt, CollectionPrompt } from "@/lib/types"

interface CollectionDetailProps {
  collection: Collection
  collectionPrompts: (CollectionPrompt & {
    prompts?: Prompt & {
      profiles?: {
        full_name?: string
        username?: string
        avatar_url?: string
      }
    }
  })[]
  availablePrompts: Prompt[]
}

export function CollectionDetail({ collection, collectionPrompts, availablePrompts }: CollectionDetailProps) {
  const [showAddPrompts, setShowAddPrompts] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const filteredAvailablePrompts = availablePrompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addPromptToCollection = async (promptId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("collection_prompts").insert({
        collection_id: collection.id,
        prompt_id: promptId,
      })

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error adding prompt to collection:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removePromptFromCollection = async (promptId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("collection_prompts")
        .delete()
        .eq("collection_id", collection.id)
        .eq("prompt_id", promptId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error removing prompt from collection:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Collection Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{collection.name}</h1>
                <div className="flex items-center gap-1">
                  {collection.is_public ? (
                    <Users className="h-5 w-5 text-green-600" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              {collection.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-4">{collection.description}</p>
              )}
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{collectionPrompts.length} prompts</Badge>
                <Badge variant={collection.is_public ? "default" : "outline"}>
                  {collection.is_public ? "Public" : "Private"}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddPrompts(!showAddPrompts)}
                disabled={availablePrompts.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Prompts
              </Button>
              <Button variant="ghost" onClick={() => router.back()}>
                Back
              </Button>
            </div>
          </div>
        </div>

        {/* Add Prompts Section */}
        {showAddPrompts && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add Prompts to Collection</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search your prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredAvailablePrompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAvailablePrompts.map((prompt) => (
                    <div key={prompt.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{prompt.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{prompt.description}</p>
                      </div>
                      <Button size="sm" onClick={() => addPromptToCollection(prompt.id)} disabled={isLoading}>
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {availablePrompts.length === 0
                    ? "All your prompts are already in this collection"
                    : "No prompts match your search"}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Collection Prompts */}
        {collectionPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionPrompts.map((cp) => (
              <div key={cp.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                  onClick={() => removePromptFromCollection(cp.prompt_id)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
                {cp.prompts && <PromptCard prompt={cp.prompts} />}
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-gray-400">
                  <Plus className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium">No prompts in this collection</h3>
                <p className="text-gray-600 dark:text-gray-300">Add some prompts to get started with this collection</p>
                {availablePrompts.length > 0 && <Button onClick={() => setShowAddPrompts(true)}>Add Prompts</Button>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
