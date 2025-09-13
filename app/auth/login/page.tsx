"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Lock, Mail, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center py-12 px-6">
      {/* decorative shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-8 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-8 bottom-6 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="px-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg">
                <LogIn className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600">Welcome back</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Sign in to continue to AI Simplified</p>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">Welcome back — enter your details to pick up where you left off. Your prompts and collections are waiting.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2"><span className="text-indigo-500">✔</span> Access your saved prompts</li>
                <li className="flex items-center gap-2"><span className="text-purple-500">✔</span> Edit collections instantly</li>
                <li className="flex items-center gap-2"><span className="text-pink-500">✔</span> Sync across devices</li>
              </ul>
            </div>

            <div className="mt-6">
              <Button variant="ghost" className="bg-white/70 hover:bg-white/90 text-gray-800 border border-white/40 shadow-md mr-2">Continue with Google</Button>
              <Button variant="ghost" className="bg-white/70 hover:bg-white/90 text-gray-800 border border-white/40 shadow-md">Continue with GitHub</Button>
            </div>
          </div>

          <Card className="shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-md"><LogIn className="w-5 h-5 text-white" /></div>
                Sign In
              </CardTitle>
              <CardDescription className="text-white/90">Use your email and password to sign in</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="mt-2 relative">
                    <Input id="email" type="email" placeholder="you@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div className="absolute right-3 top-3 text-gray-400"><Mail className="w-4 h-4" /></div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="mt-2 relative">
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="absolute right-3 top-3 text-gray-400"><Lock className="w-4 h-4" /></div>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-[1.01] transform transition-all" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <Link href="/auth/forgot-password" className="underline">Forgot password?</Link>
                  <Link href="/auth/sign-up" className="underline">Create account</Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
