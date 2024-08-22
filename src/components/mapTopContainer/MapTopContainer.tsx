import { FC, useContext } from "react";
import {
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import { DateSelectionModal } from "@/components/DateSelectionModal/DateSelectionModal";
import { Tag } from "@/components/tag/Tag";
import MapContext from "@/providers/mapContext/MapContext";
import { TotalResults } from "./TotalResults";
import { CalendarIcon } from "@/assets/icons";
import { styles } from "./styles";
import { dateToShortFormat } from "@/utils";
import { useMapStore } from "@/store/MapStore";
import { useNavigation } from "@react-navigation/native";
import ProfileIcon from "@/assets/icons/profile";
import ShareIcon from "@/assets/icons/share";
import { SearchIcon } from "../../../assets/icons";
import { colors } from "@/constants/colors";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export const MapTopContainer: FC<Props> = ({ showModal, setShowModal }) => {
  // const selectedTag = useMapStore((state) => state.selectedTag);
  // const setSelectedTag = useMapStore((state) => state.setSelectedTag);
  // const { selectedDate, setSelectedDate } = useContext(MapContext);
  // const customDate = useMapStore((state) => state.customDate);
  // const totalResults = useMapStore((state) => state.totalResultsInVisibleArea);
  // const tags = useMapStore((state) => state.tags);
  // const handleDateSelect = (date: string) => {
  //   setSelectedDate(date);
  // };
  const navigation = useNavigation();
  return (
    <View style={styles.topContainer}>
      <View style={styles.upperContainer}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            navigation.navigate("MyProfile");
          }}
        >
          <ProfileIcon />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <SearchIcon />
          <TextInput
            placeholder="Search"
            style={styles.search}
            placeholderTextColor={colors.pulseGrey}
          />
        </View>
        {/* <TotalResults total={totalResults} visible={totalResults} /> */}
        <TouchableOpacity style={styles.searchButton}>
          <ShareIcon />
        </TouchableOpacity>
      </View>
      {/* <View style={styles.tagsContainer}>
        <Modal visible={showModal} animationType="slide">
          <DateSelectionModal
            onSelect={handleDateSelect}
            onCloseModal={setShowModal}
            selectedDate={selectedDate}
          />
        </Modal>

        <>
          <TouchableOpacity
            style={styles.calendarContainer}
            onPress={() => setShowModal(true)}
          >
            <CalendarIcon />
            <Text>
              {selectedDate === "Custom"
                ? dateToShortFormat(customDate.startDate) +
                  " - " +
                  dateToShortFormat(customDate.endDate)
                : selectedDate}
            </Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedTag && (
              <TouchableOpacity onPress={() => setSelectedTag(null)}>
                <Tag tag={selectedTag || ""} isActive={true} />
              </TouchableOpacity>
            )}
            {tags &&
              tags
                .filter((tag) => selectedTag !== tag)
                .map((tag, id) => (
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedTag(selectedTag === tag ? null : tag)
                    }
                    key={tag}
                  >
                    <Tag key={id} tag={tag} />
                  </TouchableOpacity>
                ))}
          </ScrollView>
        </>
      </View> */}
    </View>
  );
};
