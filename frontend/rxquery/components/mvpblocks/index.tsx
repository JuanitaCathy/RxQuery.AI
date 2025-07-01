"use client";
import { motion } from "framer-motion";
import {
  User,
  Activity,
  Pill,
  LayoutDashboard,
  History,
  Info,
  Sparkles,
  HeartPulse,
  Settings,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Navbar from "../Navbar";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import React from "react";
const AnimatedTopBorder = () => (
  <div
    className="fixed top-0 left-0 w-full h-2 z-50"
    style={{
      background:
        "linear-gradient(90deg, #06b6d4 0%, #a78bfa 50%, #06b6d4 100%)",
      backgroundSize: "200% 100%",
      animation: "gradient-move 4s linear infinite",
    }}
  />
);

// Add keyframes for the animated gradient border
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes gradient-move {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
  `;
  document.head.appendChild(style);
}


export { AnimatedTopBorder };

export default function Dashboard() {

  const [agentResponse, setAgentResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [timeoutReached, setTimeoutReached] = useState(false);
  
 

  // Get URL parameters
  const getUrlParams = () => {
    if (typeof window === "undefined") return { agent: null, prompt: null };
    const params = new URLSearchParams(window.location.search);
    return {
      agent: params.get("agent"),
      prompt: params.get("prompt")
    };
  };

  const { agent, prompt } = getUrlParams();
  const queryAgent = async (agentName: string, promptText: string) => {
    setIsLoading(true);
    setStatus("loading");
    setError(null);
    setTimeoutReached(false);

    // Set timeout for 1 minute (60 seconds)
    const timeoutId = setTimeout(() => {
      setTimeoutReached(true);
    }, 60000); // 60 seconds

    try {
      let response;
      
      // Determine which endpoint to use based on agent
      if (agentName === 'general_agent') {
        // Use general query endpoint
        response = await fetch('http://localhost:8000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: promptText,
            allergy: "" 
          }),
        });
      } else {
                    // Prepare inputs based on agent type
      let inputs = {};
      
      switch (agentName) {
        case 'classify_agent':
          inputs = { question: promptText };
          break;
        case 'recommend_agent':
          inputs = { 
            question: promptText,
            category: "General" // Default category, can be enhanced later
          };
          break;
        case 'side_effects_agent':
          inputs = { recommendation: promptText };
          break;
        case 'allergy_agent':
          inputs = { allergy: promptText };
          break;
        default:
          inputs = { query: promptText, question: promptText };
      }
        response = await fetch('http://localhost:8000/query-agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agent: agentName,
            inputs: inputs
          }),
        });
      }
      clearTimeout(timeoutId);
       if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAgentResponse(data);
      setStatus("success");
    } catch (err) {
      console.error('Error querying agent:', err);

      if (!timeoutReached) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStatus("error");
      }
    } finally {
      setIsLoading(false);
    }
  };
useEffect(() => {
    if (agent && prompt) {
      queryAgent(agent, prompt);
    }
  }, [agent, prompt]);
    // Handle timeout error separately
  useEffect(() => {
    if (timeoutReached && isLoading) {
      setError('Request timed out after 1 minute. Please try again.');
      setStatus("error");
      setIsLoading(false);
    }
  }, [timeoutReached, isLoading]);

  const getAgentDisplayName = (agentName: string | null) => {
    if (!agentName) return "No command selected.";
    switch (agentName) {
      case "classify_agent":
        return "Drug Classifier";
      case "recommend_agent":
        return "Drug Recommender";
      case "side_effects_agent":
        return "Side Effects Checker";
      case "allergy_agent":
        return "Allergy-safe Search";
      case "history_agent":
        return "Recent Queries";
      case "health_tips_agent":
        return "Recommended Tips";
      case "general_agent":
        return "General Assistant";
      default:
        return agentName;
    }
  };
 const renderAgentResponse = () => {
    // Show loading animation until either success, error after timeout, or actual error
    if (isLoading || (status === "loading" && !timeoutReached)) {
      return (
        <div className="self-start max-w-[80%] rounded-xl bg-muted/60 px-4 py-3 text-foreground shadow animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
          <span className="text-sm">AI is thinking...</span>
          <span className="flex items-center ml-2">
            <span className="block w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0s] mr-1"></span>
            <span className="block w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s] mr-1"></span>
            <span className="block w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </span>
        </div>
      );
    }

    // Show error only after timeout or actual error
    if (error && (timeoutReached || status === "error")) {
      return (
        <div className="self-start max-w-[85%] rounded-xl bg-red-900/30 border border-red-500/30 px-4 py-3 text-red-200 shadow">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
  if (agentResponse) {
    return (
      <div className="self-start max-w-[85%] rounded-xl bg-gradient-to-r from-cyan-900/30 to-purple-900/20 border border-cyan-400/30 px-4 py-3 text-foreground shadow">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-medium text-cyan-200">AI Response</span>
        </div>
        <div className="text-sm space-y-2">
          {/* Handle specific agent response formats */}
          {agentResponse.response && (
            <p>{agentResponse.response}</p>
          )}
          {agentResponse.recommendation && (
            <div>
              <span className="text-cyan-300 font-medium">Recommendation:</span>{' '}
              <span>{agentResponse.recommendation}</span>
            </div>
          )}
          {agentResponse.side_effects && (
            <div>
              <span className="text-cyan-300 font-medium">Side Effects:</span>{' '}
              <span>{agentResponse.side_effects}</span>
            </div>
          )}
                    {agentResponse.safe_drug && (
            <div>
              <span className="text-cyan-300 font-medium">Safe Drug:</span>{' '}
              <span>{agentResponse.safe_drug}</span>
            </div>
          )}
          {agentResponse.result && (
            <p>{agentResponse.result}</p>
          )}
          {/* Fallback for other response formats */}
          {!agentResponse.response && !agentResponse.recommendation && 
           !agentResponse.side_effects && !agentResponse.safe_drug && 
           !agentResponse.result && (
            <div className="space-y-1">
              {Object.entries(agentResponse).map(([key, value]) => (
                <div key={key}>
                  <span className="text-cyan-300 font-medium capitalize">{key}:</span>{' '}
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
 if (!agent || !prompt) {
      return (
        <div className="self-start max-w-[80%] rounded-xl bg-muted/60 px-4 py-3 text-muted-foreground shadow">
          <span className="text-sm">No query submitted yet. Use the chat interface to ask a question.</span>
        </div>
      );
    }

    return null;
  };

const getStatusDisplay = () => {
    // Keep showing loading animation until timeout or actual completion
    if (isLoading || (status === "loading" && !timeoutReached)) {
      return (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          Running agent...
        </span>
      );
    }

    switch (status) {
      case "success":
        return (
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Success
          </span>
        );
      case "error":
        // Only show error if timeout reached or actual error occurred
        if (timeoutReached || error) {
          return (
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              Error
            </span>
          );
        }
        break;
      default:
        return "Ready";
    }
  };
  
  const handleAgentClick = (command: string) => {
    console.log(`Navigating to homepage with selected command: ${command}`);
    window.location.href = `/?command=${command}`; 
  };

  return (
    <div className="relative bg-background p-6 text-foreground">
      <Navbar />
      <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-cyan-400/20 blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-400/20 blur-[128px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.h2
          className="flex items-center gap-3 text-4xl font-semibold text-cyan-200 mt-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Activity className="w-8 h-8 text-cyan-300" />
          RxQuery Dashboard
        </motion.h2>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Sparkles className="w-6 h-6 text-cyan-300" />,
              title: "Selected Command",
              desc: getAgentDisplayName(agent),
              delay: 0.1,
            },
            {
              icon: <Pill className="w-6 h-6 text-purple-300" />,
              title: "Your Query",
              desc: prompt || "No query submitted yet.",
              delay: 0.2,
            },
            {
              icon: <Info className="w-6 h-6 text-cyan-400" />,
              title: "Status",
              desc: getStatusDisplay(),
              delay: 0.3,
            },
          ].map(({ icon, title, desc, delay }, i) => (
            <motion.div
              key={i}
              className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-md shadow-xl flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay }}
            >
              <div className="flex items-center gap-3 mb-2">
                {icon}
                <span className="text-lg font-semibold">{title}</span>
                              </div>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </div>        
        {/* Output Card - AI Chat UI style */}
        <motion.div
          className="mb-10 rounded-2xl border border-border bg-card/90 p-6 backdrop-blur-md shadow-xl max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
            <span className="text-lg font-semibold">Query Output</span>
          </div>
          <div className="flex flex-col gap-4">
            {renderAgentResponse()}
          </div>
        </motion.div>
                {error && agent && prompt && (
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => queryAgent(agent, prompt)}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 px-4 py-2 text-white transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Retry Query
            </button>
          </motion.div>
        )}

        {/* Agent Suggestions */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-cyan-100">
            Checkout our Other Agents!
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "Drug Classifier",
                icon: <Pill className="w-6 h-6 text-cyan-400" />,
                cmd: "drug_classifier",
                desc: "Classify drugs based on their properties.",
              },
              {
                title: "Drug Recommender",
                icon: <Pill className="w-6 h-6 text-cyan-400" />,
                cmd: "drug_recommender",
                desc: "Get personalized drug recommendations.",
              },
              {
                title: "Side Effects Checker",
                icon: <Info className="w-6 h-6 text-cyan-400" />,
                cmd: "side_effects_checker",
                desc: "Check potential side effects of medications.",
              },
              {
                title: "Allergy-safe Search",
                icon: <HeartPulse className="w-6 h-6 text-purple-300" />,
                cmd: "allergy_safe_search",
                desc: "Find medications safe for your allergies.",
              },
            ].map((card, i) => (
                <motion.div
                key={i}
                className="cursor-pointer rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-md shadow hover:shadow-xl transition-shadow hover:ring-2 hover:ring-cyan-400/60 hover:ring-offset-2"
                onClick={() => handleAgentClick(card.cmd)}
                whileHover={{
                  scale: 1.03,
                  boxShadow:
                  card.title === "Allergy-safe Search"
                  ? "0 0 16px 2px rgba(168,139,250,0.5)" // purple glow
                  : "0 0 16px 2px rgba(6,182,212,0.5)", // cyan glow
                }}
                >
                <div className="mb-2 flex items-center gap-2">
                  {card.icon}
                  <h4 className="text-base font-semibold">{card.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {card.desc}
                </p>
                </motion.div>
            ))}
          </div>
        </div>

        {/* Other Features Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-cyan-100">
            More Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-md shadow hover:shadow-xl transition-shadow relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Decorative ring */}
              <span className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-tr from-cyan-400/30 to-purple-400/20 rounded-full blur-2xl z-0" />
              <div className="mb-3 flex items-center gap-3 relative z-10">
              <User className="w-6 h-6 text-cyan-300" />
              <h3 className="text-lg font-semibold">Profile</h3>
              <span className="ml-auto bg-cyan-900/30 text-cyan-200 text-xs px-2 py-0.5 rounded-full">New</span>
              </div>
              <p className="text-sm text-muted-foreground relative z-10">
              Update your health preferences.
              </p>
              {/* Example preferences */}
              <div className="mt-4 flex flex-wrap gap-2 relative z-10">
              <span className="bg-cyan-400/20 text-cyan-300 text-xs px-2 py-1 rounded">Allergy: Penicillin</span>
              <span className="bg-purple-400/20 text-purple-300 text-xs px-2 py-1 rounded">Diet: Vegan</span>
              <span className="bg-cyan-400/20 text-cyan-300 text-xs px-2 py-1 rounded">Age: 32</span>
              </div>
              <button className="mt-4 bg-cyan-800 hover:bg-cyan-600 text-white text-xs px-3 py-1 rounded transition-colors shadow relative z-10">
              Edit Profile
              </button>
            </motion.div>


            {/* Recent Queries Card */}
            <motion.div
              className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-md shadow hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-3 flex items-center gap-3">
              <History className="w-6 h-6 text-purple-300" />
              <h3 className="text-lg font-semibold">Recent Queries</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-4">
              <li>
                <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full" />
                <span>What are the side effects of Ibuprofen?</span>
                <span className="ml-auto text-xs text-gray-400">2 min ago</span>
                </div>
                <div className="ml-5 mt-1 text-xs text-cyan-200 bg-cyan-900/30 rounded px-2 py-1">
                Response: Ibuprofen may cause nausea, dizziness and stomach upset.
                </div>
              </li>

              <li>
                <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full" />
                <span>Classify Paracetamol.</span>
                <span className="ml-auto text-xs text-gray-400">30 min ago</span>
                </div>
                <div className="ml-5 mt-1 text-xs text-cyan-200 bg-cyan-900/30 rounded px-2 py-1">
                Response: Paracetamol is an analgesic and antipyretic.
                </div>
              </li>
              </ul>
            </motion.div>

            {/* Recommended Tips Card */}
            <motion.div
              className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-md shadow hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-3 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-cyan-200" />
              <h3 className="text-lg font-semibold">Recommended Tips</h3>
              <span className="ml-auto bg-purple-900/30 text-purple-200 text-xs px-2 py-0.5 rounded-full">Upcoming</span>
              </div>
              <p className="text-sm text-muted-foreground">
              Custom health insights.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

