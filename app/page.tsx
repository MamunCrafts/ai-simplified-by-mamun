import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/landing-page/header"
import HeroSection from "@/components/landing-page/hero-section"
import CtaSection from "@/components/landing-page/cta-section"
import { PromptCard } from "@/components/prompt-card"
import { Feather } from "lucide-react"
import FeaturedPrompts from "@/components/landing-page/featured-prompts"
import Footer from "@/components/landing-page/footer"

export default function HomePage() {
  return (

    <>
    <Header />
    <HeroSection />
    <FeaturedPrompts />
    <CtaSection />
    <Footer/>
    </>
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    //   <div className="container mx-auto px-4 py-16">
    //     <div className="text-center mb-12">
    //       <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Prompt Library</h1>
    //       <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
    //         Organize, share, and discover AI prompts. Build your personal collection and explore prompts from the
    //         community.
    //       </p>
    //     </div>

    //     <div className="max-w-md mx-auto mb-16">
    //       <Card>
    //         <CardHeader>
    //           <CardTitle>Get Started</CardTitle>
    //           <CardDescription>Join our community to start building your prompt library</CardDescription>
    //         </CardHeader>
    //         <CardContent className="space-y-4">
    //           <Button asChild className="w-full">
    //             <Link href="/auth/sign-up">Create Account</Link>
    //           </Button>
    //           <Button asChild variant="outline" className="w-full bg-transparent">
    //             <Link href="/auth/login">Sign In</Link>
    //           </Button>
    //           <Button asChild variant="ghost" className="w-full">
    //             <Link href="/library">Browse Library</Link>
    //           </Button>
    //         </CardContent>
    //       </Card>
    //     </div>

    //     <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
    //       <div className="text-center">
    //         <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
    //           <svg
    //             className="w-8 h-8 text-blue-600 dark:text-blue-400"
    //             fill="none"
    //             stroke="currentColor"
    //             viewBox="0 0 24 24"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth={2}
    //               d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    //             />
    //           </svg>
    //         </div>
    //         <h3 className="text-lg font-semibold mb-2">Organize Prompts</h3>
    //         <p className="text-gray-600 dark:text-gray-400">
    //           Create collections and categorize your prompts for easy access
    //         </p>
    //       </div>

    //       <div className="text-center">
    //         <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
    //           <svg
    //             className="w-8 h-8 text-green-600 dark:text-green-400"
    //             fill="none"
    //             stroke="currentColor"
    //             viewBox="0 0 24 24"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth={2}
    //               d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
    //             />
    //           </svg>
    //         </div>
    //         <h3 className="text-lg font-semibold mb-2">Share & Discover</h3>
    //         <p className="text-gray-600 dark:text-gray-400">
    //           Share your best prompts publicly and discover new ones from the community
    //         </p>
    //       </div>

    //       <div className="text-center">
    //         <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
    //           <svg
    //             className="w-8 h-8 text-purple-600 dark:text-purple-400"
    //             fill="none"
    //             stroke="currentColor"
    //             viewBox="0 0 24 24"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth={2}
    //               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    //             />
    //           </svg>
    //         </div>
    //         <h3 className="text-lg font-semibold mb-2">Search & Filter</h3>
    //         <p className="text-gray-600 dark:text-gray-400">
    //           Find the perfect prompt with powerful search and filtering tools
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}
