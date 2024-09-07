import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { PulseInfoFooter } from "./PulseInfoFooter";
import { PulseInfoTop } from "./PulseInfoTop";
import { PulseInfoContent } from "./PulseInfoContent";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/types/Navigation";
import styles from "./styles";
import { useUserStore } from "@/store/userStore";
import { useVotingStore } from "@/store/votingStore";
import { fetchVoteByTopicId, publishVote } from "@/api/client";
import useCountdown from "@/hooks/useCountDown";
import { useConfigStore } from "@/store/ServerConfigStore";
import {
  cancelNotification,
  scheduleNotification,
} from "@/services/scheduleNotification";

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
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));
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
  const { isVotingProcess, setIsVotingProcess } = useVotingStore((state) => ({
    isVotingProcess: state.isVotingProcess,
    setIsVotingProcess: state.setIsVotingProcess,
  }));

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
    try {
      setIsVotingProcess(true);
      const vote = await publishVote(
        user?.id,
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsVotingProcess(false);
    }
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

  // console.log(
  //   timeleft?.differenceInMilliseconds <= 0,
  //   timeleft.hours === 0,
  //   timeleft.minutes === 0,
  //   timeleft.seconds === 0,
  //   !loading,
  //   new Date(vote?.updatedAt || new Date()) ||
  //     new Date(vote?.timestamp || new Date()) <= new Date(),
  //   timeleft?.differenceInMilliseconds === 0 &&
  //     timeleft.hours === 0 &&
  //     timeleft.minutes === 0 &&
  //     timeleft.seconds === 0 &&
  //     !loading &&
  //     (new Date(vote?.updatedAt || new Date()) ||
  //       new Date(vote?.timestamp || new Date()) <= new Date())
  //     ? "Pulse"
  //     : "not pulse"
  // );

  return (
    <View style={styles.pulseInfoContainer}>
      <PulseInfoTop
        topic={selectedTopicDetails}
        loading={loading}
        isShouldPlayAnimation={timeleft.differenceInMilliseconds > 0}
      />
      <PulseInfoContent topic={selectedTopicDetails} loading={loading} />

      <PulseInfoFooter
        handleVote={handleVote}
        title={
          timeleft?.differenceInMilliseconds <= 0 &&
          timeleft.hours === 0 &&
          timeleft.minutes === 0 &&
          timeleft.seconds === 0 &&
          !loading &&
          (new Date(vote?.updatedAt || new Date()) ||
            new Date(vote?.timestamp || new Date()) <= new Date())
            ? "Pulse"
            : `You can renew pulse in ${
                timeleft.hours ? timeleft.hours + "h " : ""
              } ${timeleft.minutes ? timeleft.minutes + "m " : ""}${
                timeleft.seconds ? timeleft.seconds + "s" : ""
              }`
        }
        disabled={timeleft?.differenceInMilliseconds > 0 || !isVotingAvailable}
        loading={loading || isVotingProcess || (!vote && !loading)}
      />
    </View>
  );
};
