'use client'
import { useRouter } from "next/navigation";

const HeroSection = () => {
   const router = useRouter()
  return ( <section className="w-full bg-gradient-to-b from-purple-100 to-indigo-100 py-20 lg:py-32">
    <div className="container mx-auto flex flex-col items-center text-center gap-8">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-gray-900 font-newsreader">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
          Share & Explore Prompts
        </span>
      </h1>
      <p className="max-w-3xl text-lg md:text-xl text-gray-700">
        Discover, create, and share prompts for writing, art, and more. Join our
        community and unleash your creativity.
      </p>
      <button onClick={()=>router.push("/auth/sign-up")}  className="rounded-xl hover:cursor-pointer bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:scale-105 hover:bg-indigo-700 transition-transform">
        Get Started for Free
      </button>
    </div>
  </section>
)};
export default HeroSection;