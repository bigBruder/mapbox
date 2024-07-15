import React, { useContext, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  SafeAreaView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import { formatDate } from "../../utils/helpersFunctions";
import { StatusBar } from "expo-status-bar";
import MyContext from "../../providers/mapContext/MapContext";

import styles from "./styles";
import { DATE_RANGES } from "../../constants/dateRanges";
import { useMapStore } from "@/store/MapStore";

interface Props {
  onSelect: (date: string) => void;
  onCloseModal: (value: boolean) => void;
  selectedDate: string;
}

export const DateSelectionModal: React.FC<Props> = ({
  onSelect,
  onCloseModal,
  selectedDate,
}) => {
  const customDate = useMapStore((state) => state.customDate);
  const setCustomDate = useMapStore((state) => state.setCustomDate);
  const clearCustomDate = useMapStore((state) => state.clearCustomDate);
  const setSelectedDate = useMapStore((state) => state.setSelectedDate);

  const [showDatePiker, setShowDatePiker] = useState(false);

  const preparedStartDate = formatDate(customDate.startDate).split(",")[1];
  const preparedEndDate = formatDate(customDate.endDate).split(",")[1];

  const handleClear = () => {
    clearCustomDate();

    setSelectedDate("Now");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => onCloseModal(false)}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Select Date</Text>

        <TouchableOpacity onPress={() => onCloseModal(false)}>
          <Text style={styles.headerCancel}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.modalContainer}>
        {DATE_RANGES.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.buttonDate}
            onPress={() => {
              if (button.label === "Custom") {
                setShowDatePiker(true);
                onSelect(button.label);
                return;
              }

              onSelect(button.label);
              onCloseModal(false);
            }}
          >
            {selectedDate === button.label && (
              <AntDesign
                name="check"
                size={24}
                color="#21B24C"
                style={styles.icon}
              />
            )}

            <Text style={styles.textDate}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={showDatePiker} animationType="slide">
        <SafeAreaView>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => setShowDatePiker(false)}>
              <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.headerText}>Select Date Range</Text>

            <TouchableOpacity
              onPress={() => {
                handleClear();
              }}
            >
              <Text style={styles.headerCancel}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.containerDatePiker}>
            <DateTimePicker
              mode="range"
              selectedItemColor="#005DF2"
              todayContainerStyle={{
                borderColor: "#fff",
              }}
              startDate={customDate.startDate}
              endDate={customDate.endDate}
              onChange={(params) => {
                setCustomDate(params.startDate, params.endDate);
              }}
              minDate={new Date().setDate(new Date().getDate() - 1)}
              maxDate={new Date().setMonth(new Date().getMonth() + 3)}
            />

            <View>
              <Text style={styles.dateTime}>
                {formatDate(customDate.startDate)} -{" "}
                {formatDate(customDate.endDate)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.buttonApplyDate}
              onPress={() => {
                if (!customDate.startDate || !customDate.endDate) {
                  return;
                }
                setShowDatePiker(false);
                setCustomDate(startDate, endDate);
              }}
            >
              <Text style={styles.textApplyDate}>Apply</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <StatusBar style="auto" backgroundColor="white" />
    </SafeAreaView>
  );
};
