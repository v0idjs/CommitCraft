import React, { useState, useEffect } from "react";
import { 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Database,
  RefreshCw,
  Clock,
  ExternalLink,
  MessageSquare,
  FileText
} from "lucide-react";
import { HistoryItem, GenLanguage } from "../types";
import { Markdown } from "./Markdown";

interface HistoryListProps {
  refreshTrigger: number;
}

export function HistoryList({ refreshTrigger }: HistoryListProps) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<{ [key: string]: boolean }>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger, searchQuery]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const url = searchQuery.trim() 
        ? `/api/history?q=${encodeURIComponent(searchQuery.trim())}`
        : "/api/history";
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setItems(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load history items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this generation log from your SQLite history?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setItems(items.filter((item) => item.id !== id));
        if (expandedId === id) setExpandedId(null);
      }
    } catch (error) {
      console.error("Failed to delete log:", error);
    }
  };

  const clearAllHistory = async () => {
    if (!window.confirm("WARNING: Are you sure you want to permanently clear ALL generation logs from SQLite? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch("/api/history", {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setItems([]);
        setExpandedId(null);
      }
    } catch (error) {
      console.error("Failed to clear history database:", error);
    }
  };

  const handleCopyText = async (idKey: string, text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId((prev) => ({ ...prev, [idKey]: true }));
      setTimeout(() => {
        setCopiedId((prev) => ({ ...prev, [idKey]: false }));
      }, 1500);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const toggleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#141414]">

      {/* Banner Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#141414] bg-[#EBEAE7] p-5 rounded-none shadow-[4px_4px_0px_#141414]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#141414] text-white rounded-none">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#141414]">Generation Registry</h2>
            <p className="text-[10px] font-mono uppercase text-[#141414]/60 leading-none mt-1">
              Locally managed logs in standard container SQLite
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <button
            id="btn-clear-history"
            onClick={clearAllHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#141414] bg-white hover:bg-[#141414] hover:text-white text-[10px] font-bold uppercase transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Logs
          </button>
        )}
      </div>

      {/* Search Header control */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#141414]/60">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="search-history-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search through inputs, commits, or pull requests logs..."
          className="w-full pl-10 pr-4 py-3 rounded-none bg-white border border-[#141414] text-sm text-[#141414] placeholder:text-gray-400 transition shadow-[2px_2px_0px_#141414] outline-hidden focus:outline-hidden"
        />
      </div>

      {/* Primary table layout or list */}
      {isLoading && items.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <RefreshCw className="w-6 h-6 text-[#141414] animate-spin mb-3" />
          <p className="text-[10px] font-mono uppercase font-bold text-[#141414]/60">Scanning SQLite entries...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-none border border-dashed border-[#141414] p-16 text-center bg-white shadow-[4px_4px_0px_rgba(20,20,20,0.05)]">
          <div className="w-12 h-12 bg-[#F5F5F5] border border-[#141414] flex items-center justify-center text-[#141414] mb-3 mx-auto">
            <Database className="w-5 h-5 mx-auto" />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#141414]">No Logs Found</p>
          <p className="text-xs text-[#141414]/60 leading-relaxed mt-1 max-w-xs mx-auto">
            {searchQuery 
              ? `No logs match raw query pattern: "${searchQuery}". Try searching for other segments.`
              : "No Git metadata has been manufactured yet. Build a commit message at the generator to establish logs."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-[10px] font-mono font-bold text-[#141414]/60 tracking-wider uppercase px-1 flex items-center justify-between">
            <span>Commit Archives ({items.length})</span>
            <span className="hidden sm:inline normal-case font-normal">Click on logs to review full details</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const isOpen = expandedId === item.id;
              return (
                <div
                  id={`history-card-${item.id}`}
                  key={item.id}
                  onClick={() => toggleExpand(item.id)}
                  className={`rounded-none border border-[#141414] bg-white overflow-hidden transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_#141414] ${
                    isOpen ? "bg-[#F5F5F5]/60" : "hover:bg-[#F9F9F8]"
                  }`}
                >
                  
                  {/* Collapsed Brief Bar */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      
                      {/* Technical Meta Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-none text-[9px] uppercase font-bold border ${
                          item.commitType.toLowerCase() === "fix"
                            ? "bg-rose-50 border-rose-800 text-rose-900"
                            : item.commitType.toLowerCase() === "feature" || item.commitType.toLowerCase() === "feat"
                            ? "bg-green-50 border-green-800 text-green-900"
                            : "bg-[#EBEAE7] border-[#141414] text-[#141414]"
                        }`}>
                          {item.commitType}
                        </span>
                        
                        <span className="px-1.5 py-0.5 rounded-none text-[9px] bg-white border border-[#141414] text-[#141414] font-bold uppercase">
                          {item.language}
                        </span>

                        <div className="flex items-center gap-1 text-[#141414]/60 text-[10px] font-mono uppercase">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(item.createdAt)}</span>
                        </div>
                      </div>

                      {/* Commit Title representation */}
                      <h3 className="text-sm font-bold font-mono tracking-tight text-[#141414] line-clamp-1 select-all" title="Click icon to copy message">
                        {item.commitMessage}
                      </h3>

                      {/* Brief input preview */}
                      <p className="text-xs text-[#141414]/70 line-clamp-1 italic max-w-3xl">
                        Log: "{item.inputText}"
                      </p>

                    </div>

                    {/* Actions panel */}
                    <div className="flex items-center gap-1 sm:self-center self-end flex-shrink-0">
                      
                      {/* Individual Copy Fast Button */}
                      <button
                        id={`btn-history-copy-commit-${item.id}`}
                        onClick={(e) => handleCopyText(`h-com-${item.id}`, item.commitMessage, e)}
                        title="Copy commit message header"
                        className="p-2 text-[#141414]/60 hover:text-[#141414] rounded-none hover:bg-white/40 transition"
                      >
                        {copiedId[`h-com-${item.id}`] ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Individual Trash Button */}
                      <button
                        id={`btn-history-delete-${item.id}`}
                        onClick={(e) => deleteItem(item.id, e)}
                        title="Delete log"
                        className="p-2 text-[#141414]/50 hover:text-red-600 rounded-none hover:bg-white/40 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Collapse */}
                      <div className="p-1.5 text-[#141414]/50">
                        {isOpen ? <ChevronUp className="w-4 h-4 text-[#141414]" /> : <ChevronDown className="w-4 h-4 hover:text-[#141414]" />}
                      </div>

                    </div>
                  </div>

                  {/* Expanded Complete Panel */}
                  {isOpen && (
                    <div className="border-t border-[#141414] bg-[#FAFAFA] p-5 space-y-5 select-text" onClick={(e) => e.stopPropagation()}>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Raw manual Log summary input */}
                        <div className="p-3.5 rounded-none border border-[#141414] bg-white">
                          <span className="text-[10px] font-bold text-[#141414]/50 block mb-2 tracking-wide uppercase">Your Original Log Input</span>
                          <p className="text-xs font-mono text-[#141414]/80 leading-relaxed whitespace-pre-wrap line-clamp-6">
                            {item.inputText}
                          </p>
                        </div>

                        {/* Generated commit explanation */}
                        <div className="p-3.5 rounded-none border border-[#141414] bg-white relative">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-[#141414]/50 block tracking-wide uppercase">Commit Body Description</span>
                            <button
                              id={`btn-history-copy-desc-${item.id}`}
                              onClick={() => handleCopyText(`h-desc-${item.id}`, item.commitDescription)}
                              className="p-1 hover:text-[#141414] text-[#141414]/50 transition-colors"
                            >
                              {copiedId[`h-desc-${item.id}`] ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-[#141414]/80 leading-relaxed whitespace-pre-line">
                            {item.commitDescription}
                          </p>
                        </div>

                      </div>

                      {/* Generated Pull Request Markdown Section */}
                      <div className="border border-[#141414] rounded-none bg-white overflow-hidden">
                        
                        <div className="px-4 py-2 bg-[#EBEAE7] border-b border-[#141414] flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-[#141414]/60 tracking-wider uppercase">PULL REQUEST TEMPLATE</span>
                          <button
                            id={`btn-history-copy-pr-${item.id}`}
                            onClick={() => handleCopyText(`h-pr-${item.id}`, `# ${item.prTitle}\n\n${item.prDescription}`)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[10px] text-[#141414] hover:bg-[#141414] hover:text-white border border-[#141414] rounded-none transition font-bold uppercase cursor-pointer"
                          >
                            {copiedId[`h-pr-${item.id}`] ? (
                              <>
                                <Check className="w-3 h-3 text-green-600" />
                                <span className="text-[10px]">PR Markdown Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span className="text-[10px]">Copy PR Markdown</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Title representation */}
                        <div className="p-4 bg-white border-b border-[#141414]/10 text-xs text-[#141414]/60 select-all">
                          <span className="text-[9px] text-[#141414]/50 font-bold block mb-1 uppercase tracking-widest">PROPOSED PR TITLE</span>
                          <span className="text-sm font-bold text-[#141414]">{item.prTitle}</span>
                        </div>

                        {/* Description markdown parsed rendering */}
                        <div className="p-4 sm:p-5 max-h-72 overflow-y-auto bg-white">
                          <Markdown content={item.prDescription} />
                        </div>

                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
