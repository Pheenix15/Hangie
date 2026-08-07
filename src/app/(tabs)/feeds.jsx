import Lucide from "@react-native-vector-icons/lucide";
import { Pressable, StyleSheet, View } from "react-native";
import Button from "../../components/ui/button";
import { COLORS } from "../../constants/brand";
import { signOut } from "../../services/auth";
import { globalStyles } from "../../styles/global";

export default function feeds() {
  // TEMPORARY: Logout button for testing purposes
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={globalStyles.screen}>
      {/* Stories section */}
      <View style={feedsStyles.storiesSection}>
        <View style={feedsStyles.storiesContainer}>
          {/* Add Story */}
          <Pressable style={feedsStyles.addStory}>
            <Lucide name="plus" size={20} color={COLORS.textSecondary} />
          </Pressable>

          {/* Followings status */}
        </View>
      </View>

      {/* Feeds */}

      <Button title={"Logout"} variant="fill" onPress={handleLogout} />
    </View>
  );
}

const feedsStyles = StyleSheet.create({});
