"use client";
import { Github, FileText, Cat, LayoutDashboard, Newspaper, GitCompare } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AnimatedAIChat from "@/components/ui/animated-ai-chat";


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray text-gray-900">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-3 mt-2 bg-gray">
        <div className="flex items-center space-x-2">
          {/* Animated & colored Molecule SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-cyan-300 hover:text-purple-300 transition-all duration-300 animate-spin-slow"
            viewBox="0 0 48 48"
            fill="none"
            style={{ animation: "spin 8s linear infinite" }}
          >
            <circle cx="12" cy="36" r="4" stroke="#38bdf8" strokeWidth="2" fill="#a5f3fc" />
            <circle cx="36" cy="36" r="4" stroke="#a78bfa" strokeWidth="2" fill="#ddd6fe" />
            <circle cx="24" cy="12" r="4" stroke="#f472b6" strokeWidth="2" fill="#fbcfe8" />
            <line x1="15.2" y1="33.2" x2="22.8" y2="14.8" stroke="#f472b6" strokeWidth="2"/>
            <line x1="32.8" y1="33.2" x2="25.2" y2="14.8" stroke="#a78bfa" strokeWidth="2"/>
            <line x1="16" y1="36" x2="32" y2="36" stroke="#38bdf8" strokeWidth="2"/>
          </svg>
              <Link href="/" className="text-2xl font-bold text-cyan-100 hover:text-purple-300 transition-all duration-300">
                    RxQuery.AI
              </Link>
          <style jsx>{`
            @keyframes spin {
              100% { transform: rotate(360deg); }
            }
            .animate-spin-slow {
              animation: spin 8s linear infinite;
            }
          `}</style>
        </div>
        <div className="flex items-center mr-8 space-x-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-1 text-gray-500 hover:text-purple-400 transition-all"
            >
              <LayoutDashboard className="w-6 h-6" />
              <span className="text-lg">Dashboard</span>
            </Link>
            <Link 
              href="/drugcompare" 
              className="flex items-center space-x-1 text-gray-500 hover:text-purple-400 transition-all"
            >
            <GitCompare className="w-6 h-6" />
              <span className="text-lg">Drug Comparison</span>
            </Link>
              <Link 
              href="/latestnews" 
              className="flex items-center space-x-1 text-gray-500 hover:text-purple-400 transition-all"
            >
              <Newspaper className="w-6 h-6" />

              <span className="text-lg">Latest News</span>
            </Link>
            <Link 
              href="/docs" 
              className="flex items-center space-x-1 text-gray-500 hover:text-purple-400 transition-all"
            >
              <FileText className="w-6 h-6" />
              <span className="text-lg">Docs</span>
            </Link>
            <Link 
              href="https://github.com/JuanitaCathy/RxQuery.AI" 
              className="flex items-center space-x-1 text-gray-500 hover:text-purple-400 transition-all"
            >
              <Github className="w-6 h-6" />
              <span className="text-lg">GitHub</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-4 pb-16">
        <div className="text-center mt-0 mb-8">
          <AnimatedAIChat />
        </div>

{/* Features Section */}
<div className="mt-[20vh] mb-20">
  <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-gradient-to-r from-cyan-100 via-cyan-200 to-purple-300 bg-clip-text">
    Features that Make <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">RxQuery</span> Smarter
  </h2>
  <div className="grid md:grid-cols-3 gap-8">
    
    {/* Feature 1 */}
    <div className="p-8 rounded-xl backdrop-blur-sm bg-white/5 shadow hover:shadow-lg transition-all transform hover:scale-105 border border-gray-800/50">
      <h3 className="text-2xl font-semibold text-transparent bg-gradient-to-r from-rose-400 to-cyan-300 bg-clip-text mb-4">Drug Information Assistant</h3>
      <p className="text-gray-300 leading-relaxed">
        Ask about any medicine and get instant, trustworthy information on uses, dosage, side effects, interactions, and alternatives – all in simple language.
      </p>
    </div>

    {/* Feature 2 */}
    <div className="p-8 rounded-xl backdrop-blur-sm bg-white/5 shadow hover:shadow-lg transition-all transform hover:scale-105 border border-gray-800/50">
      <h3 className="text-2xl font-semibold text-transparent bg-gradient-to-r from-purple-300 to-rose-400 bg-clip-text mb-4">Symptom & Allergy Checker</h3>
      <p className="text-gray-300 leading-relaxed">
        Describe your symptoms or allergies, and our advanced AI agents will suggest possible conditions or safe medications to consider (or avoid).
      </p>
    </div>

    {/* Feature 3 */}
    <div className="p-8 rounded-xl backdrop-blur-sm bg-white/5 shadow hover:shadow-lg transition-all transform hover:scale-105 border border-gray-800/50">
      <h3 className="text-2xl font-semibold text-transparent bg-gradient-to-r from-rose-400 to-purple-300 bg-clip-text mb-4">Voice-Enabled Interaction</h3>
      <p className="text-gray-300 leading-relaxed">
        Speak to RxQuery like you're talking to a pharmacist. Our voice assistant understands natural language queries for a hands-free, accessible experience.
      </p>
    </div>

    {/* Feature 4 */}
    <div className="p-8 rounded-xl backdrop-blur-sm bg-white/5 shadow hover:shadow-lg transition-all transform hover:scale-105 border border-gray-800/50">
      <h3 className="text-2xl font-semibold text-transparent bg-gradient-to-r from-purple-300 to-rose-400 bg-clip-text mb-4">Drug Comparison Tool</h3>
      <p className="text-gray-300 leading-relaxed">
        Compare two or more drugs side-by-side on cost, usage, brand/generic versions, side effects, and availability using structured AI tables.
      </p>
    </div>

    {/* Feature 5 */}
    <div className="p-8 rounded-xl backdrop-blur-sm bg-white/5 shadow hover:shadow-lg transition-all transform hover:scale-105 border border-gray-800/50">
      <h3 className="text-2xl font-semibold text-transparent bg-gradient-to-r from-rose-400 to-purple-300 bg-clip-text mb-4">Live Medical News</h3>
      <p className="text-gray-300 leading-relaxed">
        Stay updated with the latest health and drug alerts. AI-curated news ensures you're informed on FDA warnings, recalls, and new research.
      </p>
    </div>

    {/* Feature 6 */}
    <div className="p-8 rounded-xl backdrop-blur-sm bg-white/5 shadow hover:shadow-lg transition-all transform hover:scale-105 border border-gray-800/50">
      <h3 className="text-2xl font-semibold text-transparent bg-gradient-to-r from-purple-300 to-rose-400 bg-clip-text mb-4">Powered by MindsDB</h3>
      <p className="text-gray-300 leading-relaxed">
        RxQuery uses structured AI knowledge bases, real-time SQL querying, and LLMs via MindsDB for accurate, fast, and interpretable answers.
      </p>
    </div>
  </div>
</div>

{/* FAQ Section */}
<section className="bg-gray py-18">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold text-center mb-10 text-transparent bg-gradient-to-r from-cyan-100 via-cyan-200 to-purple-300 bg-clip-text">
      Frequently Asked <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">Questions</span>
    </h2>
    <div className="max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="text-xl font-medium text-cyan-400 hover:text-purple-200">
            What is RxQuery?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300">
            RxQuery is your AI-powered drug and health assistant. It helps you find trusted drug information, compare meds, and understand your symptoms with the help of advanced AI agents and knowledge bases.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-b-0">
          <AccordionTrigger className="text-xl font-medium text-cyan-400 hover:text-purple-200">
            How accurate is the information?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300">
            RxQuery is built using structured databases and AI models like MindsDB, ensuring the information is medically sound and interpretable — though it’s not a substitute for a doctor.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border-b-0">
          <AccordionTrigger className="text-xl font-medium text-cyan-400 hover:text-purple-200">
            Can I use voice input?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300">
            Yes! RxQuery supports natural voice commands so you can ask things like “What are the side effects of ibuprofen?” or “Compare Paracetamol with Ibuprofen”.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-b-0">
          <AccordionTrigger className="text-xl font-medium text-cyan-400 hover:text-purple-200">
            Is this free to use?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300">
            100%! RxQuery is completely free. No account, no credit card, no hidden fees — just reliable medical information.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border-b-0">
          <AccordionTrigger className="text-xl font-medium text-cyan-400 hover:text-purple-200">
            What tech powers RxQuery?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300">
            RxQuery leverages knowledge bases,llms, real-time SQL querying, and MindsDB’s AI tables to provide you with fast, contextual, and accurate responses.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
</section>

            {/* MindsDB Image Footer */}
            <div className="text-center my-10">
            <p className="text-gray-400 mb-4">Powered by</p>
            <img src="/31035808.png" alt="MindsDB" className="w-40 h-40 mx-auto" />
            </div>
            <footer className="bg-black/80 py-6 mt-10 border-t border-slate-800 text-center">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} RxQuery.AI — Built with ❤️. <br />
        </p>
      </footer>
      </main>
    </div>
  );
};

export default LandingPage;