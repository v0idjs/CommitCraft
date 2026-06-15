import React from "react";
import { 
  Github, 
  Terminal, 
  FileText, 
  Users, 
  Bookmark, 
  Compass, 
  CheckCircle2, 
  Cpu, 
  Activity, 
  Layers,
  ArrowRight
} from "lucide-react";

export function AboutView() {
  const contributors = [
    { name: "V0idjs", role: "Core Engine Compiler Architect", avatar: "VJ" },
    { name: "You!", role: "Community Open Source Contributor", avatar: "CC" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-[#141414]">
      
      {/* Brand Hero Introduction */}
      <div className="relative overflow-hidden rounded-none border border-[#141414] bg-[#EBEAE7] p-6 sm:p-8 shadow-[4px_4px_0px_#141414]">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/30 blur-3xl p-1" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141414] italic font-serif flex items-center gap-2">
              CommitCraft Project
            </h1>
            <p className="text-xs text-[#141414]/75 max-w-xl leading-relaxed font-medium">
              An open-source Git pipeline utility built to replace uninformative commit headers with beautifully classified, well-reasoned, semantic conventional messages and complete reviewer pull request descriptions.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 bg-[#141414] text-white px-4 py-2.5 rounded-none font-mono text-[10px] uppercase font-bold tracking-wider">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Open Source LICENSE: MIT</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Columns: System Modules */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Main system architecture list */}
          <div className="rounded-none border border-[#141414] bg-[#EBEAE7] p-6 space-y-5 shadow-[4px_4px_0px_#141414]">
            <h3 className="text-sm font-bold text-[#141414] tracking-wider uppercase border-b border-[#141414]/15 pb-2">
              System Architecture (V1)
            </h3>
            
            <div className="space-y-4 text-xs text-[#141414]/80 leading-relaxed font-medium">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[#141414] text-white rounded-none mt-0.5">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#141414] block text-sm">Server-Side Guard Proxy</span>
                  Express server handles prompt encapsulation, caching SQLite queries, and secure communications. Your Gemini keys are never shared with client-side frame threads.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[#141414] text-white rounded-none mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#141414] block text-sm">Structured JSON Outputs</span>
                  Uses the latest native `@google/genai` schema constraints to return predictable payload formats including categorization types, summaries, and Markdown logs without syntax failures.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[#141414] text-white rounded-none mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#141414] block text-sm">Durable SQLite Layer</span>
                  Saves local states, timestamps, and parameters into a self-contained, transactional SQL database inside standard container file systems.
                </div>
              </div>
            </div>
          </div>

          {/* V2 Integration Roadmap */}
          <div className="rounded-none border border-[#141414] bg-[#EBEAE7] p-6 space-y-4 shadow-[4px_4px_0px_#141414]">
            <h3 className="text-sm font-bold text-[#141414] tracking-wider uppercase border-b border-[#141414]/15 pb-2">
              Evolution roadmap (V2)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-none bg-white border border-[#141414] shadow-[2px_2px_0px_#141414]">
                <span className="text-xs font-bold text-[#141414] block mb-1 uppercase tracking-wide">Desktop Client</span>
                System tray triggers and native filesystem watcher for automatic repository scan logs.
              </div>
              <div className="p-4 rounded-none bg-white border border-[#141414] shadow-[2px_2px_0px_#141414]">
                <span className="text-xs font-bold text-[#141414] block mb-1 uppercase tracking-wide">Multi-Provider</span>
                Multi-model selector extending integration channels for local LLMs, OpenAI, Claude, and Gemini 2.5.
              </div>
              <div className="p-4 rounded-none bg-white border border-[#141414] shadow-[2px_2px_0px_#141414]">
                <span className="text-xs font-bold text-[#141414] block mb-1 uppercase tracking-wide">GitHub Hooks</span>
                Deploy pull requests directly from your browser panel with one single commit dispatch click.
              </div>
              <div className="p-4 rounded-none bg-white border border-[#141414] shadow-[2px_2px_0px_#141414]">
                <span className="text-xs font-bold text-[#141414] block mb-1 uppercase tracking-wide">File Analyzer</span>
                Direct parsing of diff, patch, or log payload attachments for massive repository increments.
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Contributors & Licensing */}
        <div className="space-y-6">
          
          {/* Active Contributors Block */}
          <div className="rounded-none border border-[#141414] bg-[#EBEAE7] p-5 space-y-4 shadow-[4px_4px_0px_#141414]">
            <h3 className="text-xs font-bold text-[#141414] tracking-wider uppercase flex items-center gap-1.5 border-b border-[#141414]/15 pb-2">
              <Users className="w-4 h-4 text-[#141414]" />
              Contributors
            </h3>
            
            <div className="space-y-3.5">
              {contributors.map((contrib, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-[#141414] text-white flex items-center justify-center font-bold text-xs border border-[#141414]">
                    {contrib.avatar}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#141414] block leading-none">{contrib.name}</span>
                    <span className="text-[9px] text-[#141414]/60 font-mono font-bold uppercase block mt-1">{contrib.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Licensing Information */}
          <div className="rounded-none border border-[#141414] bg-[#EBEAE7] p-5 space-y-3.5 shadow-[4px_4px_0px_#141414]">
            <h3 className="text-xs font-bold text-[#141414] tracking-wider uppercase flex items-center gap-1.5 border-b border-[#141414]/15 pb-2">
              <FileText className="w-4 h-4 text-[#141414]" />
              MIT LICENSE
            </h3>
            <p className="text-[11px] text-[#141414]/70 leading-relaxed font-medium">
              Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction...
            </p>
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase font-bold text-[#141414]/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#141414]" />
              <span>LICENSE COPY INCLUDED</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
