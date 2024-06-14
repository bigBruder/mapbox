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
import { DateToShortFormat } from "@/utils/dateToShortFormat";
import MapContext from "@/providers/mapContext/MapContext";
import { TotalResults } from "./TotalResults";
import {
  CalendarIcon,
  ProfileIcon,
  SearchIcon,
  ShareIcon,
} from "@/assets/icons";
import { styles } from "./styles";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export const MapTopContainer: FC<Props> = ({ showModal, setShowModal }) => {
  const {
    totalResultsAmount,
    customDate,
    selectedDate,
    setSelectedDate,
    selectedTag,
    setSelectedTag,
    tags,
  } = useContext(MapContext);
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };
  return (
    <View style={styles.topContainer}>
      <View style={styles.upperContainer}>
        <TouchableOpacity style={styles.searchButton}>
          <ProfileIcon />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <SearchIcon />
          <TextInput placeholder="Search" style={styles.search} />
        </View>
        <TotalResults
          total={totalResultsAmount.total}
          visible={totalResultsAmount.visible}
        />
        <TouchableOpacity style={styles.searchButton}>
          <ShareIcon />
        </TouchableOpacity>
      </View>
      <View style={styles.tagsContainer}>
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
                ? DateToShortFormat(customDate.startDate) +
                  " - " +
                  DateToShortFormat(customDate.endDate)
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
                      setSelectedTag((prev) => (prev === tag ? null : tag))
                    }
                    key={tag}
                  >
                    <Tag key={id} tag={tag} />
                  </TouchableOpacity>
                ))}
          </ScrollView>
        </>
      </View>
    </View>
  );
};
