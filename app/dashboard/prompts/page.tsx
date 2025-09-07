import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default async function MyPromptsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; filter?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user's prompts
  let query = supabase.from("prompts").select("*").eq("user_id", data.user.id).order("created_at", { ascending: false })

  // Apply search filter
  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }

  // Apply visibility filter
  if (params.filter === "public") {
    query = query.eq("is_public", true)
  } else if (params.filter === "private") {
    query = query.eq("is_public", false)
  }

  const { data: prompts } = await query

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Prompts</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage all your prompts in one place</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/prompts/create">
              <Plus className="h-4 w-4 mr-2" />
              New Prompt
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search your prompts..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  All
                </Button>
                <Button variant="outline" size="sm">
                  Public
                </Button>
                <Button variant="outline" size="sm">
                  Private
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {prompts && prompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{prompt.title}</CardTitle>
                      {prompt.description && (
                        <CardDescription className="mt-1 line-clamp-2">{prompt.description}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{prompt.content}</p>

                    <div className="flex flex-wrap gap-2">
                      {prompt.category && (
                        <Badge variant="secondary" className="text-xs">
                          {prompt.category}
                        </Badge>
                      )}
                      <Badge variant={prompt.is_public ? "default" : "outline"} className="text-xs">
                        {prompt.is_public ? "Public" : "Private"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        {new Date(prompt.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/prompts/edit/${prompt.id}`}>Edit</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/prompts/${prompt.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-gray-400">
                  <Plus className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium">No prompts found</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {params.search || params.filter
                    ? "Try adjusting your search or filters"
                    : "Create your first prompt to get started"}
                </p>
                <Button asChild>
                  <Link href="/dashboard/prompts/create">Create Prompt</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
