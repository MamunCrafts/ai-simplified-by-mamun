"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { PromptCard } from "@/components/prompt-card"
import type { Prompt } from "@/lib/types"

interface LibraryContentProps {
  initialPrompts: (Prompt & { profiles?: { full_name?: string; username?: string; avatar_url?: string } })[]
  categories: string[]
  popularTags: string[]
  initialSearch: string
  initialCategory: string
  initialTags: string[]
}

export function LibraryContent({
  initialPrompts,
  categories,
  popularTags,
  initialSearch,
  initialCategory,
  initialTags,
}: LibraryContentProps) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [search, setSearch] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (selectedCategory) params.set("category", selectedCategory)
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","))

    const newUrl = params.toString() ? `/library?${params.toString()}` : "/library"
    router.push(newUrl, { scroll: false })
  }, [search, selectedCategory, selectedTags, router])

  // Filter prompts based on current filters
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      !search ||
      prompt.title.toLowerCase().includes(search.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(search.toLowerCase()) ||
      prompt.content.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = !selectedCategory || prompt.category === selectedCategory

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => prompt.tags?.includes(tag))

    return matchesSearch && matchesCategory && matchesTags
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory("")
    setSelectedTags([])
  }

  const hasActiveFilters = search || selectedCategory || selectedTags.length > 0

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {[search, selectedCategory, ...selectedTags].filter(Boolean).length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Active filters:</span>
                  {search && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: {search}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch("")} />
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Category: {selectedCategory}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("")} />
                    </Badge>
                  )}
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTag(tag)} />
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                </div>
              )}

              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div>
                <h3 className="text-sm font-medium mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium">No prompts found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
