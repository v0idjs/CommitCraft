import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Generator } from "./components/Generator";
import { HistoryList } from "./components/HistoryList";
import { SettingsView } from "./components/SettingsView";
import { AboutView } from "./components/AboutView";
import { ConfigStatus, CommitFormat, DescriptionLength, GenLanguage, ProviderType } from "./types";
import { Sparkles, Terminal, Database, Cpu, HelpCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("generator");
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  
  // Refresh trigger to pull fresh SQLite entries on successful generations
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load preferences from localStorage if they have been previously saved
  const [defaultFormat, setDefaultFormat] = useState<CommitFormat>("conventional");
  const [defaultLength, setDefaultLength] = useState<DescriptionLength>("medium");
  const [defaultLanguage, setDefaultLanguage] = useState<GenLanguage>("English");
  const [defaultProvider, setDefaultProvider] = useState<ProviderType>("gemini");
  const [defaultModel, setDefaultModel] = useState<string>("gemini-3.5-flash");

  useEffect(() => {
    fetchConfig();
    loadPersistedPreferences();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/config");
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error("Unable to contact backend config service:", error);
      setConfig({ hasApiKey: false, appUrl: window.location.origin });
    }
  };

  const loadPersistedPreferences = () => {
    const savedFormat = localStorage.getItem("commitcraft_default_format") as CommitFormat;
    const savedLength = localStorage.getItem("commitcraft_default_length") as DescriptionLength;
    const savedLanguage = localStorage.getItem("commitcraft_default_language") as GenLanguage;
    const savedProvider = localStorage.getItem("commitcraft_default_provider") as ProviderType;
    const savedModel = localStorage.getItem("commitcraft_default_model");

    if (savedFormat) setDefaultFormat(savedFormat);
    if (savedLength) setDefaultLength(savedLength);
    if (savedLanguage) setDefaultLanguage(savedLanguage);
    if (savedProvider) setDefaultProvider(savedProvider);
    if (savedModel) setDefaultModel(savedModel);
  };

  const handleGenerationComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] flex flex-col justify-between selection:bg-[#141414] selection:text-[#E4E3E0]">
      
      {/* Upper header segment and navigation */}
      <div className="flex-grow">
        <Header config={config} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Core Inner Body Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "generator" && (
            <Generator
              config={config}
              onGenerationComplete={handleGenerationComplete}
              defaultFormat={defaultFormat}
              defaultLength={defaultLength}
              defaultLanguage={defaultLanguage}
              defaultProvider={defaultProvider}
              defaultModel={defaultModel}
            />
          )}

          {activeTab === "history" && (
            <HistoryList refreshTrigger={refreshTrigger} />
          )}

          {activeTab === "settings" && (
            <SettingsView
              config={config}
              defaultFormat={defaultFormat}
              setDefaultFormat={setDefaultFormat}
              defaultLength={defaultLength}
              setDefaultLength={setDefaultLength}
              defaultLanguage={defaultLanguage}
              setDefaultLanguage={setDefaultLanguage}
              defaultProvider={defaultProvider}
              setDefaultProvider={setDefaultProvider}
              defaultModel={defaultModel}
              setDefaultModel={setDefaultModel}
            />
          )}

          {activeTab === "about" && (
            <AboutView />
          )}
        </main>
      </div>

      {/* Footer copyright segment */}
      <Footer />
    </div>
  );
}
