import React, { useState } from "react";
import { 
  Save, 
  Check, 
  HelpCircle, 
  Compass, 
  Cpu, 
  CheckCircle,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { CommitFormat, DescriptionLength, GenLanguage, ConfigStatus } from "../types";

interface SettingsViewProps {
  config: ConfigStatus | null;
  defaultFormat: CommitFormat;
  setDefaultFormat: (val: CommitFormat) => void;
  defaultLength: DescriptionLength;
  setDefaultLength: (val: DescriptionLength) => void;
  defaultLanguage: GenLanguage;
  setDefaultLanguage: (val: GenLanguage) => void;
}

export function SettingsView({
  config,
  defaultFormat,
  setDefaultFormat,
  defaultLength,
  setDefaultLength,
  defaultLanguage,
  setDefaultLanguage
}: SettingsViewProps) {
  
  // Settings modification tracking
  const [format, setFormat] = useState<CommitFormat>(defaultFormat);
  const [length, setLength] = useState<DescriptionLength>(defaultLength);
  const [language, setLanguage] = useState<GenLanguage>(defaultLanguage);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDefaultFormat(format);
    setDefaultLength(length);
    setDefaultLanguage(language);
    
    // Save to client local persistence
    localStorage.setItem("commitcraft_default_format", format);
    localStorage.setItem("commitcraft_default_length", length);
    localStorage.setItem("commitcraft_default_language", language);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const languagesList: GenLanguage[] = ["English", "French", "Spanish", "German", "Arabic"];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in text-[#141414]">
      
      {/* Settings Title */}
      <div className="border border-[#141414] bg-[#EBEAE7] p-5 rounded-none flex items-center gap-3 shadow-[4px_4px_0px_#141414]">
        <div className="p-1.5 bg-[#141414] text-white rounded-none">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#141414]">System Preferences</h2>
          <p className="text-[10px] font-mono uppercase text-[#141414]/60 leading-none mt-1">
            Configure default variables and review Gemini server authentication status
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Settings Form Panel (Left Columns) */}
        <form onSubmit={handleSave} className="md:col-span-2 rounded-none border border-[#141414] bg-[#EBEAE7] p-6 space-y-6 shadow-[4px_4px_0px_#141414]">
          
          <h3 className="text-sm font-bold text-[#141414] tracking-wider uppercase border-b border-[#141414]/15 pb-2">
            Default Creation Rules
          </h3>

          {/* Format preference */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <span>Default Commit Format</span>
              <span className="text-[9px] font-mono font-normal normal-case opacity-75">(Conventional Commits specify tags)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="settings-format-conventional"
                type="button"
                onClick={() => setFormat("conventional")}
                className={`py-2 px-3 text-xs rounded-none border text-center font-bold uppercase transition-all cursor-pointer ${
                  format === "conventional"
                    ? "bg-[#141414] text-white border-[#141414]"
                    : "border-[#141414] bg-white hover:bg-[#F5F5F5] text-[#141414]"
                }`}
              >
                Conventional (feat/fix)
              </button>
              <button
                id="settings-format-standard"
                type="button"
                onClick={() => setFormat("standard")}
                className={`py-2 px-3 text-xs rounded-none border text-center font-bold uppercase transition-all cursor-pointer ${
                  format === "standard"
                    ? "bg-[#141414] text-white border-[#141414]"
                    : "border-[#141414] bg-white hover:bg-[#F5F5F5] text-[#141414]"
                }`}
              >
                Standard (Imperative)
              </button>
            </div>
          </div>

          {/* Length Preference */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/60">
              Default Commit Body Depth
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(["short", "medium", "detailed"] as DescriptionLength[]).map((len) => (
                <button
                  id={`settings-len-${len}`}
                  key={len}
                  type="button"
                  onClick={() => setLength(len)}
                  className={`py-2 text-xs rounded-none border text-center font-bold uppercase transition-all cursor-pointer capitalize ${
                    length === len
                      ? "bg-[#141414] text-white border-[#141414]"
                      : "border-[#141414] bg-white hover:bg-[#F5F5F5] text-[#141414]"
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* Language Preference */}
          <div className="space-y-2">
            <label htmlFor="settings-language" className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/60 block">
              Default Write Language
            </label>
            <select
              id="settings-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as GenLanguage)}
              className="w-full text-xs p-3 rounded-none bg-white border border-[#141414] text-[#141414] font-bold uppercase outline-hidden focus:outline-hidden"
            >
              {languagesList.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <button
            id="settings-save-button"
            type="submit"
            className="w-full py-3.5 bg-[#141414] hover:bg-[#2c2c2c] text-white font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 rounded-none cursor-pointer shadow-[4px_4px_0px_rgba(20,20,20,0.25)]"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saveSuccess ? "Configuration Saved!" : "Save Rules Preference"}
          </button>

        </form>

        {/* Secrets Configuration Status (Right column instructions) */}
        <div className="rounded-none border border-[#141414] bg-[#EBEAE7] p-5 space-y-5 shadow-[4px_4px_0px_#141414]">
          
          <h3 className="text-sm font-bold text-[#141414] tracking-wider uppercase border-b border-[#141414]/15 pb-2">
            Secrets Status
          </h3>

          {/* Live Status indicator */}
          <div className="p-4 rounded-none bg-white border border-[#141414] space-y-4">
            <span className="text-[9px] font-mono font-bold text-[#141414]/50 block uppercase leading-none">Gemini Connection</span>
            
            {config ? (
              config.hasApiKey ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase font-mono">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-600" />
                    <span>Keys Active</span>
                  </div>
                  <p className="text-[11px] text-[#141414]/80 leading-relaxed">
                    CommitCraft located a secure server-side <code className="text-[#141414] font-mono font-bold bg-[#F5F5F5] px-1 border border-[#141414]/15">GEMINI_API_KEY</code>. AI channels are active.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase font-mono animate-pulse">
                    <span className="w-2 h-2 bg-red-600 inline-block" />
                    <span>Missing Key</span>
                  </div>
                  <p className="text-[11px] text-[#141414]/80 leading-relaxed">
                    Local container does not detect a server <code className="text-red-900 bg-red-50 px-1 font-bold border border-red-200">GEMINI_API_KEY</code>. Follow rules below.
                  </p>
                </div>
              )
            ) : (
              <div className="h-20 animate-pulse bg-gray-100 border border-[#141414]/15" />
            )}
          </div>

          {/* Key Binding Instructions */}
          <div className="space-y-3">
            <span className="text-[9px] font-mono font-bold text-[#141414]/50 block uppercase leading-none">Security Directives</span>
            <div className="text-[11px] text-[#141414]/70 leading-relaxed space-y-2 font-medium">
              <p>
                We handle credentials securely server-side. Set up the key as follows:
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 text-[10px] text-[#141414]/60">
                <li>Navigate to the top-right <span className="text-[#141414] font-bold">Settings & Secrets</span> panel.</li>
                <li>Bind your Gemini API key under matching variable name: <code className="text-[#141414] bg-white border border-[#141414]/15 px-1 font-mono font-bold text-[9px] leading-none">GEMINI_API_KEY</code>.</li>
                <li>Save secrets. The sandbox automatically integrates variables and opens the generative channels.</li>
              </ol>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
