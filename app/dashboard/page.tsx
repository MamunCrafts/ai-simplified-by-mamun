import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, Eye, Settings } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get user statistics
  const { data: prompts } = await supabase.from("prompts").select("*").eq("user_id", data.user.id)

  const { data: collections } = await supabase.from("collections").select("*").eq("user_id", data.user.id)

  const { data: recentPrompts } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const publicPrompts = prompts?.filter((p) => p.is_public) || []
  const privatePrompts = prompts?.filter((p) => !p.is_public) || []
  const publicCollections = collections?.filter((c) => c.is_public) || []

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  const authorName = profile?.full_name || profile?.username || data.user.email
  const authorInitials = authorName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Profile */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">{authorInitials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {authorName}!</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage your prompt library and collections</p>
              {profile?.bio && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{profile.bio}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/profile">
                <Settings className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
            <form action={handleSignOut}>
              <Button variant="outline" type="submit" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{prompts?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Prompts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{publicPrompts.length}</p>
                  <p className="text-xs text-muted-foreground">Public Prompts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{collections?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Collections</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                  <Eye className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{publicCollections.length}</p>
                  <p className="text-xs text-muted-foreground">Public Collections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>My Prompts</CardTitle>
              <CardDescription>Create and manage your prompt collection</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/dashboard/prompts/create">Create New Prompt</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collections</CardTitle>
              <CardDescription>
                Organize prompts into collections ({collections?.length || 0} collections)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/dashboard/collections">Manage Collections</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Explore</CardTitle>
              <CardDescription>Discover prompts from the community</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/library">Browse Library</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {recentPrompts && recentPrompts.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Prompts</CardTitle>
                  <CardDescription>Your latest prompt creations</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/prompts">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPrompts.map((prompt) => (
                  <div key={prompt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{prompt.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{prompt.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {prompt.category && (
                          <Badge variant="secondary" className="text-xs">
                            {prompt.category}
                          </Badge>
                        )}
                        <Badge variant={prompt.is_public ? "default" : "outline"} className="text-xs">
                          {prompt.is_public ? "Public" : "Private"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(prompt.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/prompts/edit/${prompt.id}`}>Edit</Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/prompts/${prompt.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {(!prompts || prompts.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-gray-400">
                  <Plus className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium">No prompts yet</h3>
                <p className="text-gray-600 dark:text-gray-300">Create your first prompt to get started</p>
                <Button asChild>
                  <Link href="/dashboard/prompts/create">Create Your First Prompt</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
