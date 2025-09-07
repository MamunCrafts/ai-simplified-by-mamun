import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditPromptForm } from "@/components/edit-prompt-form"

export default async function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) {
    redirect("/auth/login")
  }

  // Get the prompt data
  const { data: prompt, error: promptError } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.user.id)
    .single()

  if (promptError || !prompt) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Prompt</h1>
            <p className="text-gray-600 dark:text-gray-300">Update your prompt details and settings</p>
          </div>
          <EditPromptForm prompt={prompt} />
        </div>
      </div>
    </div>
  )
}
