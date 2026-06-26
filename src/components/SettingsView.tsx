import React, { useState, useEffect } from "react";
import { 
  Save, 
  Check, 
  HelpCircle, 
  Compass, 
  Cpu, 
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Globe,
  Settings
} from "lucide-react";
import { CommitFormat, DescriptionLength, GenLanguage, ConfigStatus, ProviderType } from "../types";

export const PROVIDER_MODELS: Record<ProviderType, { id: string; label: string }[]> = {
  gemini: [
    { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash (Default)" },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro" }
  ],
  openai: [
    { id: "gpt-4o", label: "GPT-4o (Premium)" },
    { id: "gpt-4o-mini", label: "GPT-4o Mini (Fast)" },
    { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" }
  ],
  claude: [
    { id: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
    { id: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku" },
    { id: "claude-3-opus-20240229", label: "Claude 3 Opus" }
  ],
  local: [
    { id: "llama3", label: "Llama 3 (Local)" },
    { id: "mistral", label: "Mistral (Local)" },
    { id: "gemma2", label: "Gemma 2 (Local)" }
  ]
};

interface SettingsViewProps {
  config: ConfigStatus | null;
  defaultFormat: CommitFormat;
  setDefaultFormat: (val: CommitFormat) => void;
  defaultLength: DescriptionLength;
  setDefaultLength: (val: DescriptionLength) => void;
  defaultLanguage: GenLanguage;
  setDefaultLanguage: (val: GenLanguage) => void;
  defaultProvider: ProviderType;
  setDefaultProvider: (val: ProviderType) => void;
  defaultModel: string;
  setDefaultModel: (val: string) => void;
}

export function SettingsView({
  config,
  defaultFormat,
  setDefaultFormat,
  defaultLength,
  setDefaultLength,
  defaultLanguage,
  setDefaultLanguage,
  defaultProvider,
  setDefaultProvider,
  defaultModel,
  setDefaultModel
}: SettingsViewProps) {
  
  // Settings modification tracking
  const [format, setFormat] = useState<CommitFormat>(defaultFormat);
  const [length, setLength] = useState<DescriptionLength>(defaultLength);
  const [language, setLanguage] = useState<GenLanguage>(defaultLanguage);
  const [provider, setProvider] = useState<ProviderType>(defaultProvider);
  const [model, setModel] = useState<string>(defaultModel);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Keep model selection in sync if provider changes
  const handleProviderChange = (newProvider: ProviderType) => {
    setProvider(newProvider);
    const available = PROVIDER_MODELS[newProvider];
    if (available && available.length > 0) {
      setModel(available[0].id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDefaultFormat(format);
    setDefaultLength(length);
    setDefaultLanguage(language);
    setDefaultProvider(provider);
    setDefaultModel(model);
    
    // Save to client local persistence
    localStorage.setItem("commitcraft_default_format", format);
    localStorage.setItem("commitcraft_default_length", length);
    localStorage.setItem("commitcraft_default_language", language);
    localStorage.setItem("commitcraft_default_provider", provider);
    localStorage.setItem("commitcraft_default_model", model);

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

          {/* Provider Preference */}
          <div className="space-y-2">
            <label htmlFor="settings-provider" className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/60 block">
              Default AI Provider
            </label>
            <select
              id="settings-provider"
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value as ProviderType)}
              className="w-full text-xs p-3 rounded-none bg-white border border-[#141414] text-[#141414] font-bold uppercase outline-hidden focus:outline-hidden"
            >
              <option value="gemini">Google Gemini 2.5/3.5</option>
              <option value="openai">OpenAI GPT-4o</option>
              <option value="claude">Anthropic Claude 3.5</option>
              <option value="local">Local LLM (Ollama / Llama 3)</option>
            </select>
          </div>

          {/* Model Preference */}
          <div className="space-y-2">
            <label htmlFor="settings-model" className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/60 block">
              Default AI Model
            </label>
            <select
              id="settings-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full text-xs p-3 rounded-none bg-white border border-[#141414] text-[#141414] font-bold uppercase outline-hidden focus:outline-hidden"
            >
              {(PROVIDER_MODELS[provider] || []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
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
            <span className="text-[9px] font-mono font-bold text-[#141414]/50 block uppercase leading-none">Connection Statuses</span>
            
            {config ? (
              <div className="space-y-4 divide-y divide-[#141414]/10">
                {/* Gemini Status */}
                <div className="space-y-1 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Google Gemini</span>
                    {config.hasApiKey ? (
                      <span className="text-[9px] font-mono font-bold uppercase text-green-700 bg-green-50 px-1 border border-green-200">Active</span>
                    ) : (
                      <span className="text-[9px] font-mono font-bold uppercase text-red-700 bg-red-50 px-1 border border-red-200">Missing</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#141414]/60 leading-tight">
                    Uses <code className="font-mono bg-gray-50 px-0.5 border border-black/5 font-bold">GEMINI_API_KEY</code>.
                  </p>
                </div>

                {/* OpenAI Status */}
                <div className="space-y-1 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wide">OpenAI (GPT-4o)</span>
                    {config.hasOpenAiKey ? (
                      <span className="text-[9px] font-mono font-bold uppercase text-green-700 bg-green-50 px-1 border border-green-200">Active</span>
                    ) : (
                      <span className="text-[9px] font-mono font-bold uppercase text-amber-700 bg-amber-50 px-1 border border-amber-200 font-medium">Optional</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#141414]/60 leading-tight">
                    Uses <code className="font-mono bg-gray-50 px-0.5 border border-black/5 font-bold">OPENAI_API_KEY</code>.
                  </p>
                </div>

                {/* Claude Status */}
                <div className="space-y-1 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Anthropic Claude</span>
                    {config.hasAnthropicKey ? (
                      <span className="text-[9px] font-mono font-bold uppercase text-green-700 bg-green-50 px-1 border border-green-200">Active</span>
                    ) : (
                      <span className="text-[9px] font-mono font-bold uppercase text-amber-700 bg-amber-50 px-1 border border-amber-200 font-medium">Optional</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#141414]/60 leading-tight">
                    Uses <code className="font-mono bg-gray-50 px-0.5 border border-black/5 font-bold">ANTHROPIC_API_KEY</code>.
                  </p>
                </div>

                {/* Local LLM Status */}
                <div className="space-y-1 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Local LLM Endpoint</span>
                    <span className="text-[9px] font-mono font-bold uppercase text-blue-700 bg-blue-50 px-1 border border-blue-200">Active</span>
                  </div>
                  <p className="text-[10px] text-[#141414]/60 leading-tight">
                    Points to local node: <code className="font-mono text-[9px] bg-gray-50 px-0.5 border border-black/5">{config.localLlmUrl}</code>
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-40 animate-pulse bg-gray-100 border border-[#141414]/15" />
            )}
          </div>

          {/* Key Binding Instructions */}
          <div className="space-y-3">
            <span className="text-[9px] font-mono font-bold text-[#141414]/50 block uppercase leading-none">Security Directives</span>
            <div className="text-[11px] text-[#141414]/70 leading-relaxed space-y-2 font-medium">
              <p>
                Credentials are saved securely server-side. Set up variables as follows:
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 text-[10px] text-[#141414]/60">
                <li>Navigate to the top-right <span className="text-[#141414] font-bold">Settings & Secrets</span> panel in the AI Studio UI.</li>
                <li>Bind keys under corresponding variable names: <code className="text-[#141414] bg-white border border-[#141414]/15 px-1 font-mono font-bold text-[9px] leading-none">GEMINI_API_KEY</code>, <code className="text-[#141414] bg-white border border-[#141414]/15 px-1 font-mono font-bold text-[9px] leading-none">OPENAI_API_KEY</code>, or <code className="text-[#141414] bg-white border border-[#141414]/15 px-1 font-mono font-bold text-[9px] leading-none">ANTHROPIC_API_KEY</code>.</li>
                <li>To route to a local LLM, set <code className="text-[#141414] bg-white border border-[#141414]/15 px-1 font-mono font-bold text-[9px] leading-none">LOCAL_LLM_URL</code> to point to your endpoint.</li>
              </ol>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
