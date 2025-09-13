'use client'
import { useRouter } from "next/navigation";

const CtaSection = () => {
	// get the router instance
	const router = useRouter();

	return (
		<section className="w-full bg-slate-50 py-20 lg:py-24">
			<div className="container mx-auto flex flex-col items-center gap-6 text-center">
				<h2 className="text-4xl font-bold tracking-tight text-gray-900 font-newsreader">
					Ready to get started?
				</h2>
				<p className="max-w-2xl text-lg text-gray-700">
					Join Promptly today and unlock your creative potential. Sign up for free
					and start exploring a world of inspiration.
				</p>
				<button
					type="button"
					onClick={() => router.push("/auth/sign-up")}
					className="rounded-xl hover:cursor-pointer bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:scale-105 hover:bg-indigo-700 transition-transform"
				>
					Sign Up Now
				</button>
			</div>
		</section>
	);
};

export default CtaSection;