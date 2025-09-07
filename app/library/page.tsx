import { createClient } from "@/lib/supabase/server"
import { LibraryContent } from "@/components/library-content"

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    category?: string
    tags?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Get all public prompts with user profiles
  let query = supabase
    .from("prompts")
    .select(`
      *,
      profiles:user_id (
        full_name,
        username,
        avatar_url
      )
    `)
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  // Apply search filter
  if (params.search) {
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%,content.ilike.%${params.search}%`,
    )
  }

  // Apply category filter
  if (params.category) {
    query = query.eq("category", params.category)
  }

  // Apply tag filter
  if (params.tags) {
    const tagArray = params.tags.split(",")
    query = query.overlaps("tags", tagArray)
  }

  const { data: prompts, error } = await query

  // Get unique categories for filter
  const { data: categories } = await supabase
    .from("prompts")
    .select("category")
    .eq("is_public", true)
    .not("category", "is", null)

  const uniqueCategories = [...new Set(categories?.map((c) => c.category).filter(Boolean))]

  // Get popular tags
  const { data: tagData } = await supabase.from("prompts").select("tags").eq("is_public", true).not("tags", "is", null)

  const allTags = tagData?.flatMap((p) => p.tags || []) || []
  const tagCounts = allTags.reduce((acc: Record<string, number>, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {})
  const popularTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([tag]) => tag)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Prompt Library</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover and explore prompts shared by the community</p>
        </div>

        <LibraryContent
          initialPrompts={prompts || []}
          categories={uniqueCategories}
          popularTags={popularTags}
          initialSearch={params.search || ""}
          initialCategory={params.category || ""}
          initialTags={params.tags ? params.tags.split(",") : []}
        />
      </div>
    </div>
  )
}
