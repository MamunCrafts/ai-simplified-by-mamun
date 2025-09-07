import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CreateCollectionForm } from "@/components/create-collection-form"

export default async function CreateCollectionPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Collection</h1>
            <p className="text-gray-600 dark:text-gray-300">Create a new collection to organize your prompts</p>
          </div>
          <CreateCollectionForm />
        </div>
      </div>
    </div>
  )
}
