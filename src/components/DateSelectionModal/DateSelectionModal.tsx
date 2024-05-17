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
import { buttonsSelectData } from "../../utils/mockMarkers";
import { formatDate } from "../../utils/helpersFunctions";
import { StatusBar } from "expo-status-bar";
import MyContext from "../../providers/mapContext/MapContext";

import styles from "./styles";

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
  const { customDate, setCustomDate, setSelectedDate } = useContext(MyContext);
  const [showDatePiker, setShowDatePiker] = useState(false);

  const [startDate, setStartDate] = useState<DateType>(
    customDate?.startDate || new Date()
  );
  const [endDate, setEndDate] = useState<DateType>(
    customDate?.endDate || new Date()
  );

  const preparedStartDate = formatDate(startDate).split(",")[1];
  const preparedEndDate = formatDate(endDate).split(",")[1];

  const handleClear = () => {
    setCustomDate({
      startDate: new Date(),
      endDate: new Date(),
    });

    setSelectedDate("Now");

    setStartDate(new Date());
    setEndDate(new Date());
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
        {buttonsSelectData.map((button, index) => (
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
              startDate={startDate}
              endDate={endDate}
              onChange={(params) => {
                setStartDate(params.startDate);
                setEndDate(params.endDate);
              }}
              minDate={new Date().setDate(new Date().getDate() - 1)}
              maxDate={new Date().setMonth(new Date().getMonth() + 3)}
            />

            <View>
              <Text style={styles.dateTime}>
                {formatDate(startDate)} - {formatDate(endDate)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.buttonApplyDate}
              onPress={() => {
                if (!customDate.startDate || !customDate.endDate) {
                  return;
                }
                setShowDatePiker(false);

                setCustomDate({
                  startDate: startDate,
                  endDate: endDate,
                });
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
