export type CommitFormat = "conventional" | "standard";
export type DescriptionLength = "short" | "medium" | "detailed";
export type GenLanguage = "English" | "French" | "Spanish" | "German" | "Arabic";
export type ProviderType = "gemini" | "openai" | "claude" | "local";

export interface GenerationConfig {
  format: CommitFormat;
  length: DescriptionLength;
  language: GenLanguage;
  provider: ProviderType;
  model: string;
}

export interface HistoryItem {
  id: number;
  createdAt: string;
  inputText: string;
  commitMessage: string;
  commitDescription: string;
  prTitle: string;
  prDescription: string;
  language: GenLanguage;
  commitType: string;
  provider?: ProviderType;
  model?: string;
}

export interface ConfigStatus {
  hasApiKey: boolean;
  hasOpenAiKey?: boolean;
  hasAnthropicKey?: boolean;
  localLlmUrl?: string;
  appUrl: string;
}
