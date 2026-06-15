import React from "react";
import { Coffee, Terminal, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#141414] bg-[#141414] text-[#E4E3E0] py-4 text-[10px] font-mono uppercase tracking-wider mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left info specs */}
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
          <span>Locale: EN_US</span>
          <span className="hidden md:inline">|</span>
          <span>Engine: Gemini-3.5-Flash</span>
          <span className="hidden md:inline">|</span>
          <span>Security: Server-Side Gateway</span>
        </div>

        {/* Right copyright declaration */}
        <div className="text-center sm:text-right font-medium tracking-widest text-xs">
          MIT License &copy; 2026 CommitCraft Project Contributors
        </div>

      </div>
    </footer>
  );
}
