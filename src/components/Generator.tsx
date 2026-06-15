import React, { useState } from "react";
import { 
  Wand2, 
  Copy, 
  Check, 
  BookOpen, 
  RefreshCw, 
  AlertTriangle, 
  Cpu, 
  ChevronRight, 
  FileText, 
  MessageSquare,
  Sparkles,
  HelpCircle,
  Code
} from "lucide-react";
import { CommitFormat, DescriptionLength, GenLanguage, HistoryItem, ConfigStatus } from "../types";
import { Markdown } from "./Markdown";

interface GeneratorProps {
  config: ConfigStatus | null;
  onGenerationComplete: (item: HistoryItem) => void;
  defaultFormat: CommitFormat;
  defaultLength: DescriptionLength;
  defaultLanguage: GenLanguage;
}

// Sample presets for users to quickly pre-fill and verify CommitCraft performance
const PRESETS = [
  {
    title: "Bug Fix Summary",
    text: "Fixed client authorization middleware falling through on missing cookies. Updated index validation in token helper to catch undefined values instead of crashing. Added unit tests for invalid cookie cookie payloads under security cases."
  },
  {
    title: "AI Assistant Log",
    text: "I have implemented the SQL database connection pool using our database schemas. Additionally updated the user registration endpoint to validate password strength. Created migration script 0023_add_password_hash.sql. Modified package.json to include password validation dependencies."
  },
  {
    title: "Component Refactoring",
    text: "Refactored components to separate concerns. Extracted TaskList, TaskForm and TaskCategoryCard from App.tsx into individual React component files. Created src/types.ts with shared interfaces. Updated state selectors."
  }
];

export function Generator({ 
  config, 
  onGenerationComplete, 
  defaultFormat, 
  defaultLength, 
  defaultLanguage 
}: GeneratorProps) {
  
  // User Configuration preferences
  const [inputText, setInputText] = useState("");
  const [format, setFormat] = useState<CommitFormat>(defaultFormat);
  const [length, setLength] = useState<DescriptionLength>(defaultLength);
  const [language, setLanguage] = useState<GenLanguage>(defaultLanguage);

  // Run states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  // Current Outputs state
  const [output, setOutput] = useState<HistoryItem | null>(null);

  // Individual copy confirmation states
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const languagesList: GenLanguage[] = ["English", "French", "Spanish", "German", "Arabic"];

  const handlePresetSelect = (text: string) => {
    setInputText(text);
    setErrorStatus(null);
  };

  const startProgressSimulation = () => {
    const steps = [
      "Establishing link with local server node...",
      "Forwarding logs to Gemini-3.5 cognitive analyzer...",
      "Extracting critical modifications and dependencies...",
      "Formulating commit standard syntax tree...",
      "Assembling and translating formatted Markdown summary...",
      "Polishing commit language alignment..."
    ];
    
    let currentIndex = 0;
    setLoadingMessage(steps[0]);

    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < steps.length) {
        setLoadingMessage(steps[currentIndex]);
      } else {
        clearInterval(interval);
      }
    }, 750);

    return () => clearInterval(interval);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setErrorStatus(null);
    const stopSimulation = startProgressSimulation();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputText: inputText.trim(),
          format,
          length,
          language
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Generation request failed. Please review server reports.");
      }

      if (resData.success && resData.data) {
        setOutput(resData.data);
        onGenerationComplete(resData.data);
      } else {
        throw new Error("Unable to parse API response structure.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "A persistent network mismatch occurred.");
    } finally {
      stopSimulation();
      setIsLoading(false);
    }
  };

  const triggerCopy = async (fieldKey: string, textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedStates((prev) => ({ ...prev, [fieldKey]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [fieldKey]: false }));
      }, 1800);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutput(null);
    setErrorStatus(null);
  };

  // Create a combined single clipboard block for rapid developer workflows
  const handleCopyAll = () => {
    if (!output) return;
    const combinedText = `COMMIT HEADER:\n${output.commitMessage}\n\nCOMMIT DESCRIPTION:\n${output.commitDescription}\n\n===========================================\n\nPULL REQUEST:\n# ${output.prTitle}\n\n${output.prDescription}`;
    triggerCopy("all", combinedText);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#141414]">
      
      {/* Visual Workspace Hero */}
      <div className="relative overflow-hidden rounded-none border border-[#141414] bg-[#EBEAE7] p-6 sm:p-8 shadow-[4px_4px_0px_#141414]">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/30 blur-3xl" />
        
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#141414] text-white text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            Powered by Google Gemini 3.5 Flash
          </div>
          <h1 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight text-[#141414] italic font-serif leading-tight">
            Elevate Your Github History
          </h1>
          <p className="mt-2 text-xs text-[#141414]/75 font-medium leading-relaxed max-w-2xl">
            Input manual code logs or copy messy changes. 
            CommitCraft structures proper conventional commits, translates languages, and outlines complete reviewer pull request descriptions.
          </p>
        </div>

        {/* API Secrets Status warning if user is unconfigured */}
        {config && !config.hasApiKey && (
          <div className="relative mt-6 p-4 rounded-none border border-red-500 bg-red-50 text-red-900 flex flex-col sm:flex-row gap-3.5 items-start">
            <div className="p-1.5 bg-red-150 text-red-800 rounded-none">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-red-900 leading-none">System API Authentication Status: Inactive</h4>
              <p className="text-[11px] text-red-800/80 leading-relaxed mt-1.5">
                Your server does not have an active <code className="text-[#141414] font-mono px-1 py-0.5 bg-white/70 border border-red-200 rounded text-[10px]">GEMINI_API_KEY</code> environment variable configured. Generative AI calls will fail until configured under the "Settings &gt; Secrets" panel in the Google AI Studio environment.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Core Settings & Logs Form Input (Left Panel) */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col">
          <form onSubmit={handleGenerate} className="flex-1 rounded-none border border-[#141414] bg-[#EBEAE7] p-6 space-y-5 shadow-[4px_4px_0px_#141414] flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="change-input" className="text-[10px] font-mono font-bold text-[#141414]/60 tracking-[0.2em] uppercase flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#141414]"></span>
                  01 / Input Context
                </label>
                {inputText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-[10px] font-bold uppercase text-blue-600 hover:underline cursor-pointer"
                  >
                    Clear Canvas
                  </button>
                )}
              </div>

              <textarea
                id="change-input"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setErrorStatus(null);
                }}
                placeholder={`Added a new middleware for JWT validation.
Refactored the /api/auth/login route to handle expired tokens.
Updated user model password schemas...`}
                className="w-full h-44 p-4 rounded-none bg-white border border-[#141414] focus:outline-hidden transition-all duration-200 text-sm font-mono placeholder:text-gray-400 outline-hidden tracking-normal leading-relaxed text-[#141414] shadow-[2px_2px_0px_rgba(20,20,20,0.05)]"
                required
              />

              {/* Quick Presets Selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#141414]/50 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Quick Presets
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PRESETS.map((preset, index) => (
                    <button
                      id={`preset-${index}`}
                      key={index}
                      type="button"
                      onClick={() => handlePresetSelect(preset.text)}
                      className="p-2.5 text-left rounded-none border border-[#141414] bg-white hover:bg-[#F5F5F5] transition-all text-xs text-[#141414] flex flex-col justify-between truncate"
                    >
                      <span className="font-bold text-[#141414] block mb-0.5 truncate">{preset.title}</span>
                      <span className="text-[10px] text-[#141414]/60 line-clamp-1">{preset.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings Options Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#141414]/15">
                
                {/* Commit Style Header Format */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/60">Format Scheme</span>
                  <div className="flex gap-1 p-1 rounded-none bg-white border border-[#141414]">
                    <button
                      id="btn-format-conventional"
                      type="button"
                      onClick={() => setFormat("conventional")}
                      className={`flex-1 py-1 text-[11px] font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer ${
                        format === "conventional"
                          ? "bg-[#141414] text-white"
                          : "text-[#141414] opacity-50 hover:opacity-100"
                      }`}
                    >
                      Conventional
                    </button>
                    <button
                      id="btn-format-standard"
                      type="button"
                      onClick={() => setFormat("standard")}
                      className={`flex-1 py-1 text-[11px] font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer ${
                        format === "standard"
                          ? "bg-[#141414] text-white"
                          : "text-[#141414] opacity-50 hover:opacity-100"
                      }`}
                    >
                      Standard
                    </button>
                  </div>
                </div>

                {/* Description Depth Length */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/60">Detail Depth</span>
                  <div className="flex gap-1 p-1 rounded-none bg-white border border-[#141414]">
                    {(["short", "medium", "detailed"] as DescriptionLength[]).map((len) => (
                      <button
                        id={`btn-len-${len}`}
                        key={len}
                        type="button"
                        onClick={() => setLength(len)}
                        className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer ${
                          length === len
                            ? "bg-[#141414] text-white"
                            : "text-[#141414] opacity-50 hover:opacity-100"
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Targets translation language */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="language-select" className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/60 block">
                    Write Result In Language
                  </label>
                  <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as GenLanguage)}
                    className="w-full text-xs p-2 bg-white border border-[#141414] text-[#141414] rounded-none font-bold uppercase outline-none focus:outline-hidden"
                  >
                    {languagesList.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-4 mt-4">
              <button
                id="btn-submit-generate"
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="w-full py-3.5 bg-[#141414] hover:bg-[#2c2c2c] disabled:opacity-30 disabled:hover:bg-[#141414] disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-[4px_4px_0px_rgba(20,20,20,0.25)] rounded-none cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                {isLoading ? "Analyzing and Formulating..." : "Generate Artifacts"}
              </button>
            </div>

            {/* Error messaging state */}
            {errorStatus && (
              <div className="mt-4 p-4 rounded-none border border-red-600 bg-red-50 text-xs text-red-800 leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-700 mt-0.5" />
                <div>
                  <span className="font-bold">Interrupted:</span> {errorStatus}
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Visual Outputs & Review Cards (Right Panel) */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col">
          
          {/* Active Generation Loading Screen */}
          {isLoading && (
            <div className="rounded-none border border-[#141414] bg-white p-12 text-center flex flex-col items-center justify-center min-h-[460px] shadow-[4px_4px_0px_#141414] animate-pulse">
              <div className="relative flex items-center justify-center w-16 h-16 mb-6">
                <div className="absolute inset-0 border-2 border-[#141414] rotate-45" />
                <div className="absolute inset-0 border-2 border-t-transparent border-[#141414] animate-spin" />
                <Wand2 className="w-5 h-5 text-[#141414]" />
              </div>
              <h3 className="text-sm font-bold text-[#141414] uppercase tracking-wider">Processing Change Data</h3>
              <p className="text-xs text-[#141414]/60 max-w-sm leading-relaxed mt-2.5">
                {loadingMessage || "Reassembling logs..."}
              </p>
              
              {/* Fake visual steps timeline */}
              <div className="mt-8 space-y-1.5 w-64 text-left border-l border-[#141414] pl-4 py-1.5 text-[10px] font-mono uppercase text-[#141414]/60">
                <div className="flex items-center gap-2 text-green-700 font-bold">
                  <span className="w-1.5 h-1.5 bg-green-600" /> API payload uploaded
                </div>
                <div className="flex items-center gap-2 text-[#141414] font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 bg-[#141414]" /> Analyzing commit context...
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-300" /> Building Markdown description
                </div>
              </div>
            </div>
          )}

          {/* Empty welcome setup if no output exists */}
          {!output && !isLoading && (
            <div className="rounded-none border border-dashed border-[#141414] bg-white p-12 text-center flex flex-col items-center justify-center min-h-[460px] shadow-[4px_4px_0px_rgba(20,20,20,0.05)]">
              <div className="w-12 h-12 bg-[#F5F5F5] border border-[#141414] flex items-center justify-center text-[#141414] mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#141414]">Review Pipeline Standing By</h3>
              <p className="text-xs text-[#141414]/60 leading-relaxed max-w-xs mt-1.5">
                Submit raw instructions, code summaries, or developer logs using the form to analyze commit details.
              </p>
              
              {/* Explaining deliverables list */}
              <div className="grid grid-cols-2 gap-3 mt-8 text-left max-w-sm">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#141414] bg-[#F5F5F5] px-3 py-2 border border-[#141414]">
                  <ChevronRight className="w-3 h-3 text-[#141414]" /> Standard Git Commits
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#141414] bg-[#F5F5F5] px-3 py-2 border border-[#141414]">
                  <ChevronRight className="w-3 h-3 text-[#141414]" /> Body Explanations
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#141414] bg-[#F5F5F5] px-3 py-2 border border-[#141414]">
                  <ChevronRight className="w-3 h-3 text-[#141414]" /> PR Titles
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#141414] bg-[#F5F5F5] px-3 py-2 border border-[#141414]">
                  <ChevronRight className="w-3 h-3 text-[#141414]" /> Revision Markdown
                </div>
              </div>
            </div>
          )}

          {/* Output Cards Section */}
          {output && !isLoading && (
            <div className="space-y-6">
              
              {/* Summary of classification header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-none border border-[#141414] shadow-[4px_4px_0px_#141414]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono font-bold text-[#141414]/60 tracking-wider uppercase block">
                    Classification Result:
                  </span>
                  <span className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase border ${
                    output.commitType.toLowerCase() === "fix" 
                      ? "bg-rose-50 border-rose-800 text-rose-900"
                      : output.commitType.toLowerCase() === "feature" || output.commitType.toLowerCase() === "feat"
                      ? "bg-green-50 border-green-800 text-green-900"
                      : "bg-[#F5F5F5] border-[#141414] text-[#141414]"
                  }`}>
                    {output.commitType}
                  </span>
                </div>
                <button
                  id="btn-copy-all"
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#141414] hover:bg-[#141414] hover:text-white text-[10px] font-mono font-bold uppercase transition-all cursor-pointer bg-white"
                >
                  {copiedStates["all"] ? (
                    <>
                      <Check className="w-3 h-3 text-green-700" />
                      <span className="text-green-700">Copied All Bundle!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Entire Bundle</span>
                    </>
                  )}
                </button>
              </div>

              {/* CARD 1: Commit Header Message */}
              <div className="rounded-none border border-[#141414] bg-white overflow-hidden shadow-[4px_4px_0px_#141414]">
                <div className="px-5 py-3 border-b border-[#141414] bg-[#EBEAE7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#141414]" />
                    <h3 className="text-xs font-bold text-[#141414] tracking-wide uppercase">Commit Message Header</h3>
                  </div>
                  <button
                    id="btn-copy-commit"
                    onClick={() => triggerCopy("commit", output.commitMessage)}
                    className="p-1 text-[#141414]/60 hover:text-[#141414] rounded-none hover:bg-white/40 transition"
                  >
                    {copiedStates["commit"] ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="p-5 font-mono text-sm leading-relaxed text-[#141414] bg-[#FAFAFA] select-all border-b border-[#141414]/10">
                  {output.commitMessage}
                </div>
              </div>

              {/* CARD 2: Commit Explanation Details */}
              <div className="rounded-none border border-[#141414] bg-white overflow-hidden shadow-[4px_4px_0px_#141414]">
                <div className="px-5 py-3 border-b border-[#141414] bg-[#EBEAE7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#141414]" />
                    <h3 className="text-xs font-bold text-[#141414] tracking-wide uppercase">Commit Body Description</h3>
                  </div>
                  <button
                    id="btn-copy-desc"
                    onClick={() => triggerCopy("desc", output.commitDescription)}
                    className="p-1 text-[#141414]/60 hover:text-[#141414] rounded-none hover:bg-white/40 transition"
                  >
                    {copiedStates["desc"] ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="p-5 text-sm text-[#141414]/90 bg-[#FAFAFA] select-text whitespace-pre-line leading-relaxed">
                  {output.commitDescription}
                </div>
              </div>

              {/* CARD 3: Pull Request Details */}
              <div className="rounded-none border border-[#141414] bg-white overflow-hidden shadow-[4px_4px_0px_#141414]">
                
                {/* PR Banner Header */}
                <div className="px-5 py-4 border-b border-[#141414] bg-[#EBEAE7] flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-[#141414] animate-pulse" />
                    <div>
                      <h3 className="text-xs font-bold text-[#141414] tracking-wide uppercase leading-none">Pull Request Description</h3>
                      <span className="text-[9px] text-[#141414]/50 font-bold uppercase block mt-1 tracking-wider">Aesthetic Markdown Deliverable</span>
                    </div>
                  </div>
                  
                  {/* Copy PR Details content button */}
                  <button
                    id="btn-copy-pr"
                    onClick={() => triggerCopy("pr", `# ${output.prTitle}\n\n${output.prDescription}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#141414] bg-white hover:bg-[#141414] hover:text-white transition text-[10px] font-mono font-bold uppercase"
                  >
                    {copiedStates["pr"] ? (
                      <>
                        <Check className="w-3 h-3 text-green-700" />
                        <span className="text-green-700">Copied PR Content</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy PR Content</span>
                      </>
                    )}
                  </button>
                </div>

                {/* PR TITLE CARD DISPLAY */}
                <div className="p-4 bg-white border-b border-[#141414]/15">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[9px] font-mono font-bold text-[#141414]/50 tracking-widest uppercase">PR TITLE SUGGESTION</span>
                    <button
                      id="btn-copy-pr-title"
                      onClick={() => triggerCopy("prtitle", output.prTitle)}
                      className="p-1 text-[#141414]/50 hover:text-[#141414] transition"
                    >
                      {copiedStates["prtitle"] ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <div className="text-sm font-bold border-b border-gray-100 pb-2 text-[#141414]">
                    {output.prTitle}
                  </div>
                </div>

                {/* PR MARKDOWN GRAPHIC DISPLAY */}
                <div className="p-5 text-sm leading-relaxed bg-[#FAFAFA] max-h-[500px] overflow-y-auto">
                  <div className="border border-[#141414] bg-white p-5 select-text">
                    <Markdown content={output.prDescription} />
                  </div>
                </div>

              </div>
              
              {/* Direct Tips Panel */}
              <div className="p-4 rounded-none border border-[#141414] bg-white shadow-[2px_2px_0px_#141414] flex items-start gap-2.5 text-xs text-[#141414]/80 leading-relaxed">
                <HelpCircle className="w-4 h-4 text-[#141414] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Pro Tip:</span> Direct clipboard dumps are formatted correctly. You can copy the code above and paste it straight into Github Pull Request fields or terminal dispatches.
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
