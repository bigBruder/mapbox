import { fetchTopicById, fetchUserVotes, publishVote } from "@/api/client";
import { Vote } from "@/components/pulseInfo/PulseInfo";
import { Topic } from "@/types/responses/cellInfoResponse";
import { create } from "zustand";

interface VotingState {
  votes: Vote[];
  loading: boolean;
  selectedTopicDetails: Topic | null;
  lastVoteTime: string | null;

  fetchVotes: (userId: string) => void;
  setLoading: (loading: boolean) => void;
  updateVote: (vote: Vote) => void;
  fetchTopicById: (topicId: number) => void;
  publishVote: (
    userId: string,
    topicId: string,
    location: { latitude: string; longitude: string },
    locationName: string
  ) => Promise<Vote | null>;
  setLastVoteTime: (time: string) => void;
}

export const useVotingStore = create<VotingState>()((set) => ({
  votes: [],
  selectedTopicDetails: null,
  loading: true,
  lastVoteTime: null,
  setLastVoteTime: (time) => {
    set({ lastVoteTime: time });
  },
  setLoading: (loading) => {
    set({ loading: loading });
  },
  fetchVotes: async (userId) => {
    const votes = await fetchUserVotes(userId);
    set({ votes: votes });
  },
  fetchTopicById: async (topicId) => {
    const topicDetails = await fetchTopicById(topicId);

    // console.log("topicDetails", topicDetails);
    set({ selectedTopicDetails: topicDetails });
  },
  updateVote: (vote: Vote) => {
    set((state) => ({
      votes: [...state.votes, vote],
    }));
  },
  publishVote: async (userId, topicId, location, locationName) => {
    const response = await publishVote(userId, topicId, location, locationName);
    return response;
  },
}));
