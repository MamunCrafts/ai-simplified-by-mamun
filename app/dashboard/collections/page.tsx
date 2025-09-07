import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Lock } from "lucide-react"
import Link from "next/link"

export default async function CollectionsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user's collections with prompt counts
  const { data: collections } = await supabase
    .from("collections")
    .select(`
      *,
      collection_prompts(count)
    `)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Collections</h1>
            <p className="text-gray-600 dark:text-gray-300">Organize your prompts into curated collections</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/collections/create">
              <Plus className="h-4 w-4 mr-2" />
              New Collection
            </Link>
          </Button>
        </div>

        {collections && collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{collection.name}</CardTitle>
                      {collection.description && (
                        <CardDescription className="mt-1">{collection.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {collection.is_public ? (
                        <Users className="h-4 w-4 text-green-600" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{collection.collection_prompts?.[0]?.count || 0} prompts</Badge>
                      <Badge variant={collection.is_public ? "default" : "outline"}>
                        {collection.is_public ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/collections/${collection.id}`}>View</Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/collections/${collection.id}/edit`}>Edit</Link>
                      </Button>
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
                <h3 className="text-lg font-medium">No collections yet</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Create your first collection to organize your prompts
                </p>
                <Button asChild>
                  <Link href="/dashboard/collections/create">Create Collection</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
