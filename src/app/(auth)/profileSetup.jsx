import Ionicons from "@react-native-vector-icons/ionicons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../../components/ui/button";
import Input from "../../components/ui/textInput";
import { getSession } from "../../services/auth";
import { updateProfile, uploadAvatar } from "../../services/profile";
// STYLES
import { COLORS, FONT_SIZE } from "../../constants/brand";
import { globalStyles } from "../../styles/global";

export default function profileSetup() {
  const [displayName, setDisplayName] = useState("");
  const [image, setImage] = useState(null); //Stors the selected image
  const [imageUri, setImageUri] = useState(null); //Stores the URI of the selected image
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Select an image from the device's gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Picked image:", result.assets[0].uri);
      setImage(result.assets[0]);
      setImageUri(result.assets[0].uri);
    }
  };

  // Updates user profile
  const handleProfileSetup = async () => {
    setErrorMessage("");
    setLoading(true);

    // Get the current logged-in user's id from the session
    const { session, error: sessionError } = await getSession();

    if (sessionError || !session) {
      setErrorMessage("You must be logged in to set up your profile.");
      setLoading(false);
      return;
    }

    const userId = session.user.id;

    // Build the fields to update, starting with the ones that always apply
    const updates = { username, bio, display_name: displayName };

    // Only upload and attach an avatar if the user actually picked one
    if (imageUri) {
      const { url, error: uploadError } = await uploadAvatar(userId, imageUri);

      if (uploadError) {
        setErrorMessage(uploadError);
        setLoading(false);
        return;
      }

      updates.avatar_url = url;
    }

    // Save username, bio, displayName and (if present) avatar_url to the profiles table
    const { profile, error: updateError } = await updateProfile(
      userId,
      updates,
    );

    setLoading(false);

    if (updateError) {
      setErrorMessage(updateError);
      return;
    }

    router.replace("/(auth)/locationSetup");
  };

  return (
    <View style={globalStyles.screen}>
      {errorMessage && <Text>{errorMessage}</Text>}

      <Text style={profileSetupStyle.introText}>Set up your profile</Text>
      <Text style={profileSetupStyle.subText}>
        A photo helps people feel comfortable joining your hangouts.
      </Text>

      {/* UPLOAD AVATAR */}
      <View style={profileSetupStyle.addImage}>
        <Pressable onPress={pickImage} style={profileSetupStyle.addImageIcon}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={profileSetupStyle.avatarPreview}
            />
          ) : (
            <Ionicons name="person" size={30} color="black" />
          )}
        </Pressable>

        <Text>{imageUri ? "Tap to change photo" : "Tap to add photo"}</Text>
      </View>

      {/* FORM */}
      <View style={profileSetupStyle.form}>
        <Text style={profileSetupStyle.label}>DISPLAY NAME</Text>
        <Input
          placeholder=""
          value={displayName}
          onChangeText={setDisplayName}
          keyboardType=""
          autoCapitalize="none"
        />

        <Text style={profileSetupStyle.label}>USERNAME</Text>
        <Input
          placeholder=""
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={profileSetupStyle.label}>SHORT BIO (optional)</Text>
        <Input
          placeholder="Tell people a little about yourself"
          value={bio}
          onChangeText={setBio}
          autoCapitalize="none"
        />
      </View>

      {/* FORM BUTTONS */}
      <View style={profileSetupStyle.formButtons}>
        <Button
          title={
            loading ? <ActivityIndicator color={COLORS.white} /> : "Looks good"
          }
          variant="fill"
          onPress={handleProfileSetup}
        />

        <Button
          title={
            loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              "Skip for now"
            )
          }
          variant="outline"
          onPress={() => router.replace("/(auth)/locationSetup")}
        />
      </View>
    </View>
  );
}

const profileSetupStyle = StyleSheet.create({
  introText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 600,
  },

  subText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 500,
    color: COLORS.textSecondary,
  },

  addImage: {
    alignItems: "center",
    justifyContent: "center",
  },

  addImageIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 999,
    borderColor: COLORS.primary,
    // padding: 30,
    backgroundColor: COLORS.secondary,
    width: 100,
    height: 100,
    overflow: "hidden",
  },

  avatarPreview: {
    // borderRadius: 999,
    width: "100%",
    height: "100%",
  },

  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 500,
    color: COLORS.textSecondary,
    marginTop: 20,
    marginBottom: 5,
  },

  formButtons: {
    marginTop: 20,
    gap: 10,
  },
});
