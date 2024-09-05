import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { PulseInfoFooter } from "./PulseInfoFooter";
import { PulseInfoTop } from "./PulseInfoTop";
import { PulseInfoContent } from "./PulseInfoContent";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/types/Navigation";
import styles from "./styles";
import { useUserStore } from "@/store/userStore";
import { useVotingStore } from "@/store/votingStore";
import { fetchUserVotes, fetchVoteByTopicId, publishVote } from "@/api/client";
import useCountdown from "@/hooks/useCountDown";
import { useConfigStore } from "@/store/ServerConfigStore";
import {
  cancelNotification,
  scheduleNotification,
} from "@/services/scheduleNotification";
import * as Notifications from "expo-notifications";
import { useNotificationObserver } from "@/hooks/useNotifications";

const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

const SECONDS_IN_DAY = 86400;

export type Vote = {
  topicId: number;
  updatedAt: string;
  location: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
  timestamp: string;
};

export const PulseInfo = () => {
  const route =
    useRoute<RouteProp<Pick<RootStackParamList, "Pulse">, "Pulse">>();
  const topicId = route.params?.state.itemId;
  const { userLocation } = useUserStore((state) => ({
    userLocation: state.userLocation,
  }));
  const { minVoteInterval } = useConfigStore((state) => ({
    minVoteInterval: state.minVoteInterval,
  }));
  const { setLoading, loading } = useVotingStore((state) => ({
    setLoading: state.setLoading,
    loading: state.loading,
  }));
  const [vote, setVote] = useState<Vote | null>(null);
  const { selectedTopicDetails, fetchTopicById } = useVotingStore((state) => ({
    selectedTopicDetails: state.selectedTopicDetails,
    fetchTopicById: state.fetchTopicById,
  }));
  const [isVotingProcess, setIsVotingProcess] = useState(false);

  useEffect(() => {
    if (!topicId) {
      return;
    }
    const updatePage = async () => {
      try {
        setLoading(true);
        await fetchTopicById(topicId);
        const vote = await fetchVoteByTopicId(userId, topicId.toString());
        if (vote && vote[0]) {
          setVote(vote[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    updatePage();
  }, [route.params?.state.itemId]);

  const handleVote = async () => {
    const vote = await publishVote(
      userId,
      topicId.toString(),
      {
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
      },
      "mock location"
    );

    if (vote) {
      setVote(vote);
    }
    await cancelNotification(topicId.toString());
    scheduleNotification({ seconds: SECONDS_IN_DAY }, topicId + "");
  };

  const voteTargetTime =
    vote?.updatedAt || vote?.timestamp
      ? new Date(
          new Date(
            new Date(
              vote?.updatedAt || vote?.timestamp || new Date()
            ).getTime() +
              60000 * minVoteInterval
          )
        )
      : new Date(new Date().getTime() - 1000);

  const timeleft = useCountdown(voteTargetTime);
  const isVotingAvailable =
    (timeleft?.differenceInMilliseconds <= 0 &&
      vote &&
      (new Date(vote?.updatedAt) || new Date(vote?.timestamp)).getTime() +
        60000 * minVoteInterval <
        new Date().getTime()) ||
    (!vote && !loading);

  return (
    <View style={styles.pulseInfoContainer}>
      <PulseInfoTop topic={selectedTopicDetails} loading={loading} />
      <PulseInfoContent topic={selectedTopicDetails} loading={loading} />
      {loading ? (
        <PulseInfoFooter
          handleVote={handleVote}
          title={"Pulse"}
          disabled={true}
        />
      ) : (
        <PulseInfoFooter
          handleVote={handleVote}
          title={
            loading
              ? "Loading..."
              : timeleft?.differenceInMilliseconds <= 0 &&
                timeleft.hours === 0 &&
                timeleft.minutes === 0 &&
                timeleft.seconds === 0
              ? "Pulse"
              : `You can renew pulse in ${
                  timeleft.hours ? timeleft.hours + "h " : ""
                } ${timeleft.minutes ? timeleft.minutes + "m " : ""}${
                  timeleft.seconds ? timeleft.seconds + "s" : ""
                }`
          }
          disabled={
            timeleft?.differenceInMilliseconds > 0 || !isVotingAvailable
          }
        />
      )}
    </View>
  );
};
