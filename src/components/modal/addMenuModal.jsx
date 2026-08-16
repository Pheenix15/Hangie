// components/ui/AddMenuModal.jsx

import Lucide from "@react-native-vector-icons/lucide";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/brand";
import Button from "../ui/button";

export default function AddMenuModal({ visible, onClose }) {
  // Opens the device's camera to capture a photo
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    // If permission was refused, stop here and let the user know why nothing happened
    if (status !== "granted") {
      Alert.alert(
        "Camera access needed",
        "Enable camera access in your device settings to take a photo.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
    });

    // If the user picked a photo (didn't cancel), it's ready to be handled by whatever posting flow comes next
    if (!result.canceled) {
      console.log("Captured photo:", result.assets[0].uri);
    }
  };

  // Opens the device's photo library so the user can pick an existing photo
  const openPhotoLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    // If permission was refused, stop here and let the user know why nothing happened
    if (status !== "granted") {
      Alert.alert(
        "Photo access needed",
        "Enable photo library access in your device settings to choose a photo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
    });

    if (!result.canceled) {
      console.log("Selected photo:", result.assets[0].uri);
    }
  };

  // Opens the device's camera to record a video
  const openVideoCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Camera access needed",
        "Enable camera access in your device settings to record a video.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["videos"],
    });

    if (!result.canceled) {
      console.log("Recorded video:", result.assets[0].uri);
    }
  };

  // Opens the device's video library so the user can pick an existing video
  const openVideoLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Photo access needed",
        "Enable photo library access in your device settings to choose a video.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
    });

    if (!result.canceled) {
      console.log("Selected video:", result.assets[0].uri);
    }
  };

  // Closes the modal, then gives the OS a moment to show its own popup so the two don't visually clash
  const handlePhotoPress = () => {
    onClose();
    setTimeout(() => {
      Alert.alert("Add a Photo", "", [
        { text: "Take Photo", onPress: openCamera },
        { text: "Choose from Library", onPress: openPhotoLibrary },
        { text: "Cancel", style: "cancel" },
      ]);
    }, 300);
  };

  const handleVideoPress = () => {
    onClose();
    setTimeout(() => {
      Alert.alert("Add a Video", "", [
        { text: "Record Video", onPress: openVideoCamera },
        { text: "Choose from Library", onPress: openVideoLibrary },
        { text: "Cancel", style: "cancel" },
      ]);
    }, 300);
  };

  // Closes the modal and sends the host to the Suggest a Hangout screen
  const handleSuggestHangout = () => {
    onClose();
    router.push("/(create)/suggestHangout");
  };

  // Closes the modal and sends the host to the Host an Event flow
  const handleHostEvent = () => {
    onClose();
    router.push("/(create)/hostEvent");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={tabModalStyles.backdrop} onPress={onClose}>
        <Pressable
          style={tabModalStyles.sheet}
          onPress={(event) => event.stopPropagation()}
        >
          <Text style={tabModalStyles.introText}>Share Something</Text>
          <MenuOption
            icon="image"
            label="Photo"
            subLabel="Share a moment from your day"
            onPress={handlePhotoPress}
          />
          <MenuOption
            icon="video"
            label="Video"
            subLabel="Short clip, up to 60 seconds"
            onPress={handleVideoPress}
          />
          <MenuOption
            icon="sparkles"
            label="Suggest a Hangout"
            subLabel="Propose an event to your community"
            onPress={handleSuggestHangout}
          />
          <MenuOption
            icon="calendar-plus"
            label="Host an Event"
            subLabel="Create and manage your own hangout"
            onPress={handleHostEvent}
          />

          <Button title={"Cancle"} variant="outline" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// A single row in the menu, icon plus label, kept separate since all four options share the same layout
function MenuOption({ icon, label, subLabel, onPress }) {
  return (
    <Pressable style={tabModalStyles.option} onPress={onPress}>
      <Lucide name={icon} size={25} color={COLORS.primary} />
      <View style={tabModalStyles.labels}>
        <Text style={tabModalStyles.label}>{label}</Text>
        <Text style={tabModalStyles.subLabel}>{subLabel}</Text>
      </View>
    </Pressable>
  );
}

const tabModalStyles = StyleSheet.create({
  introText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 25,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
    paddingVertical: 16,
    paddingHorizontal: 15,
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    borderColor: COLORS.border,
    borderWidth: 0.5,
  },

  labels: {
    flexDirection: "column",
    gap: 3,
    alignItems: "flex-start",
  },

  label: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: 700,
  },

  subLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: 600,
  },
});
