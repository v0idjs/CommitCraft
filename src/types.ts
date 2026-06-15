export type CommitFormat = "conventional" | "standard";
export type DescriptionLength = "short" | "medium" | "detailed";
export type GenLanguage = "English" | "French" | "Spanish" | "German" | "Arabic";

export interface GenerationConfig {
  format: CommitFormat;
  length: DescriptionLength;
  language: GenLanguage;
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
}

export interface ConfigStatus {
  hasApiKey: boolean;
  appUrl: string;
}
