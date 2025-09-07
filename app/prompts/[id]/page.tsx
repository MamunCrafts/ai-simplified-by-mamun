import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PromptDetailContent } from "@/components/prompt-detail-content"

export default async function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Get prompt details with author information
  const { data: prompt, error } = await supabase
    .from("prompts")
    .select(`
      *,
      profiles:user_id (
        full_name,
        username,
        avatar_url,
        bio
      )
    `)
    .eq("id", id)
    .eq("is_public", true)
    .single()

  if (error || !prompt) {
    notFound()
  }

  // Get current user (if logged in)
  const { data: user } = await supabase.auth.getUser()

  // Get user's collections (if logged in)
  let userCollections = null
  if (user?.user) {
    const { data: collections } = await supabase
      .from("collections")
      .select("id, name")
      .eq("user_id", user.user.id)
      .order("name")
    userCollections = collections
  }

  // Get related prompts (same category or similar tags)
  const { data: relatedPrompts } = await supabase
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
    .neq("id", id)
    .or(`category.eq.${prompt.category},tags.ov.{${prompt.tags?.join(",") || ""}}`)
    .limit(6)

  return (
    <PromptDetailContent
      prompt={prompt}
      currentUser={user?.user || null}
      userCollections={userCollections || []}
      relatedPrompts={relatedPrompts || []}
    />
  )
}
