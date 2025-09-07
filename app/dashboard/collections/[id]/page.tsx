import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CollectionDetail } from "@/components/collection-detail"

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) {
    redirect("/auth/login")
  }

  // Get collection details
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.user.id)
    .single()

  if (collectionError || !collection) {
    redirect("/dashboard/collections")
  }

  // Get prompts in this collection
  const { data: collectionPrompts } = await supabase
    .from("collection_prompts")
    .select(`
      *,
      prompts (
        *,
        profiles:user_id (
          full_name,
          username,
          avatar_url
        )
      )
    `)
    .eq("collection_id", id)
    .order("added_at", { ascending: false })

  // Get user's other prompts not in this collection
  const { data: availablePrompts } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", user.user.id)
    .not("id", "in", `(${collectionPrompts?.map((cp) => cp.prompt_id).join(",") || "''"}`)
    .order("created_at", { ascending: false })

  return (
    <CollectionDetail
      collection={collection}
      collectionPrompts={collectionPrompts || []}
      availablePrompts={availablePrompts || []}
    />
  )
}
