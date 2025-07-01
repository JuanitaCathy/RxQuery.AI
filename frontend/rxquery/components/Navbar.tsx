import Link from "next/link";
import { LayoutDashboard, GitCompare, Newspaper, FileText, Github } from "lucide-react";

    const Navbar = () => (
        <nav className="flex items-center justify-between p-3 mt-2 bg-gray zIndex-100">
            <div className="flex items-center space-x-2">
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
    );

    export default Navbar;