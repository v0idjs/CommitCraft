import React from "react";
import { Terminal, Cpu, Database, CheckCircle2, AlertCircle } from "lucide-react";
import { ConfigStatus } from "../types";

interface HeaderProps {
  config: ConfigStatus | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ config, activeTab, setActiveTab }: HeaderProps) {
  const tabs = [
    { id: "generator", label: "Generate", icon: Terminal },
    { id: "history", label: "History", icon: Database },
    { id: "settings", label: "Settings", icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#141414] bg-white text-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#141414] rounded-sm flex items-center justify-center transition-transform hover:rotate-45 duration-300">
              <div className="w-4 h-4 border-2 border-white rotate-45"></div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold tracking-tighter uppercase italic text-[#141414]">
                  CommitCraft
                </span>
                <span className="text-[10px] font-mono text-[#141414]/50">
                  v1.0
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="hidden md:flex items-center gap-8 self-stretch">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  id={`nav-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-full flex items-center px-1 text-xs font-bold uppercase tracking-widest border-b-2 transition-all duration-150 ${
                    isActive
                      ? "border-[#141414] text-[#141414]"
                      : "border-transparent text-[#141414] opacity-40 hover:opacity-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            
            {/* Project About button */}
            <button
              id="nav-tab-about"
              onClick={() => setActiveTab("about")}
              className={`h-full flex items-center px-1 text-xs font-bold uppercase tracking-widest border-b-2 transition-all duration-150 ${
                activeTab === "about"
                  ? "border-[#141414] text-[#141414]"
                  : "border-transparent text-[#141414] opacity-40 hover:opacity-100"
              }`}
            >
              About
            </button>
          </nav>

          {/* API Secret Status Badge */}
          <div className="flex items-center gap-3">
            {config ? (
              config.hasApiKey ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-150 border border-green-800 text-green-900 text-[10px] font-mono font-bold uppercase rounded-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                  <span className="hidden sm:inline">Gemini:</span> Connected
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-100 border border-red-800 text-red-900 text-[10px] font-mono font-bold uppercase rounded-sm" title="API key is missing in your system secrets.">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="hidden sm:inline">Gemini:</span> Unconfigured
                </div>
              )
            ) : (
              <div className="w-24 h-6 animate-pulse bg-[#EBEAE7] rounded-sm" />
            )}
          </div>

        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden border-t border-[#141414] flex items-center justify-around py-2.5 bg-white">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`mobile-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                isActive ? "text-[#141414] underline underline-offset-4" : "text-[#141414]/50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
        <button
          id="mobile-tab-about"
          onClick={() => setActiveTab("about")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
            activeTab === "about" ? "text-[#141414] underline underline-offset-4" : "text-[#141414]/50"
          }`}
        >
          About
        </button>
      </div>
    </header>
  );
}
