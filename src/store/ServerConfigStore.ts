import {
  fetchSettings,
  fetchTopicById,
  fetchUserVotes,
  publishVote,
} from "@/api/client";
import { Vote } from "@/components/pulseInfo/PulseInfo";
import { Topic } from "@/types/responses/cellInfoResponse";
import { create } from "zustand";

interface ConfigStore {
  appStoreUrl: string;
  blobUrlPrefix: string;
  googlePlayUrl: string;
  latestAppVersionNumber: number;
  minVoteInterval: number;

  updateConfig: () => Promise<void>;
  setAppStoreUrl: (url: string) => void;
  setBlobUrlPrefix: (url: string) => void;
  setGooglePlayUrl: (url: string) => void;
  setLatestAppVersionNumber: (version: number) => void;
  setMinVoteInterval: (interval: number) => void;
}

export const useConfigStore = create<ConfigStore>()((set) => ({
  appStoreUrl: "",
  blobUrlPrefix: "",
  googlePlayUrl: "",
  latestAppVersionNumber: 0,
  minVoteInterval: 0,

  updateConfig: async () => {
    const config = await fetchSettings();
    set({
      appStoreUrl: config.appStoreUrl,
      blobUrlPrefix: config.blobUrlPrefix,
      googlePlayUrl: config.googlePlayUrl,
      latestAppVersionNumber: config.latestAppVersionNumber,
      minVoteInterval: config.minVoteInterval,
    });
  },
  setAppStoreUrl: (url: string) => {
    set({ appStoreUrl: url });
  },
  setBlobUrlPrefix: (url: string) => {
    set({ blobUrlPrefix: url });
  },
  setGooglePlayUrl: (url: string) => {
    set({ googlePlayUrl: url });
  },
  setLatestAppVersionNumber: (version: number) => {
    set({ latestAppVersionNumber: version });
  },
  setMinVoteInterval: (interval: number) => {
    set({ minVoteInterval: interval });
  },
}));
