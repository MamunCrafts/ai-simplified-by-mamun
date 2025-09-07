import PromptCard from "./prompt-card";


const FeaturedPrompts = () => (
  <section className="w-full bg-slate-50 py-20 lg:py-24">
    <div className="container mx-auto">
      <h2 className="mb-12 text-center text-4xl font-bold tracking-tight text-gray-900 font-newsreader">
        Featured Prompts
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <PromptCard
          title="Design a futuristic cityscape"
          subtitle="Explore prompts for visual design"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuAIRLEBDMg1Q21p1jKJV8nMF9dW_t_CYeeUib_Pql0u89zShCGls4p6REskkfEHj5WfT9HPC85DfLAp4fNJ6ta-pmnAwzirQNWznMzQTEgoPwLA5nRSXJJdjp975dc8Dcxxr9jtdhvWBoAXK2UlkV7hoCRFicTFCQPLMuq2tA7PnPVPSQHlwbsh81yJeMgW6pgggO61n2gK1ULrpOMnSBemPf1z2B5CqMddkCHoMw4FihW7HBxnth7wUR-xBkiq-FSwmAGnGZg4qCGr"
          borderColor="border-t-purple-500"
        />
        <PromptCard
          title="Create a character inspired by nature"
          subtitle="Explore prompts for character design"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuDyWcgFE7MznLJyyQO7_qktEuUX0Ca6ky9qyXYJenySRkVNj-N_TWlQ8RzURmIb3Cjx3zi6VXmoRPjGA07t78NP7jukVO-ifRX-Nkf5Cvbpk3UJEmEAUS78SRwHaPmBpgW-G38nkhuecDlg28SDWFfXC8-K3Raqye6tPI12y6BK9SDrSx9zm0mdx5F-1o8sgj1TeaPTE1kuvibCvNXKBSmB1nHtOKo9XQCpPnjEbBZmlz8OWNrjZIhbFyQZzaSr1PTtpG_Kzc9DwHRl"
          borderColor="border-t-cyan-500"
        />

      </div>
    </div>
  </section>
);

export default FeaturedPrompts;