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
import { UserPlus, Mail, Lock, ArrowRight } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center py-12 px-6">
      {/* Floating decorative shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-10 -bottom-28 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* left - intro */}
          <div className="space-y-6 px-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-600">Create your account</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Join AI Simplified and start crafting better prompts.</p>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-700 dark:text-gray-300 space-y-3">
              <p className="leading-relaxed">Create an account to save your refined prompts, collections, and preferences. Your data stays private and secure.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><span className="text-purple-500">✔</span> Save prompts & collections</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">✔</span> Access from any device</li>
                <li className="flex items-center gap-2"><span className="text-indigo-500">✔</span> Secure authentication</li>
              </ul>
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="ghost" className="bg-white/70 hover:bg-white/90 text-gray-800 border border-white/40 shadow-md">
                Continue with Google
              </Button>
              <Button variant="ghost" className="bg-white/70 hover:bg-white/90 text-gray-800 border border-white/40 shadow-md">
                Continue with GitHub
              </Button>
            </div>
          </div>

          {/* right - form */}
          <Card className="overflow-hidden shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-md">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                Create Account
              </CardTitle>
              <CardDescription className="text-white/90">Sign up securely and quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium">Full name</Label>
                  <div className="mt-2 relative">
                    <Input id="fullName" type="text" placeholder="Jane Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <div className="absolute right-3 top-3 text-gray-400"><UserPlus className="w-4 h-4" /></div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="mt-2 relative">
                    <Input id="email" type="email" placeholder="you@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div className="absolute right-3 top-3 text-gray-400"><Mail className="w-4 h-4" /></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="mt-2 relative">
                      <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                      <div className="absolute right-3 top-3 text-gray-400"><Lock className="w-4 h-4" /></div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm</Label>
                    <div className="mt-2 relative">
                      <Input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      <div className="absolute right-3 top-3 text-gray-400"><Lock className="w-4 h-4" /></div>
                    </div>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:scale-[1.01] transform transition-all" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Get Started'}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  By creating an account you agree to our <Link href="#" className="underline">Terms</Link> and <Link href="#" className="underline">Privacy</Link>.
                </div>
                <div className="pt-2 text-center text-sm">
                  Already have an account? <Link href="/auth/login" className="text-indigo-600 underline">Sign in</Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
