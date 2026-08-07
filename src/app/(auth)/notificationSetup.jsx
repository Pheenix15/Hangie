import AntDesign from "@react-native-vector-icons/ant-design";
import Ionicons from "@react-native-vector-icons/ionicons";
import Lucide from "@react-native-vector-icons/lucide";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../components/ui/button";
import { COLORS } from "../../constants/brand";
import { globalStyles } from "../../styles/global";

export default function notificationSetup() {
  return (
    <View style={[globalStyles.screen, notificationSetupStyle.screen]}>
      <View style={notificationSetupStyle.bell}>
        <AntDesign name="bell" size={35} color={COLORS.primary} />
      </View>
      <View style={notificationSetupStyle.textContainer}>
        <Text
          style={[globalStyles.introText, notificationSetupStyle.introText]}
        >
          Don't miss your hangout
        </Text>
        <Text style={[globalStyles.subText, notificationSetupStyle.subText]}>
          We'll notify you when AI finds a match, when friends are going to the
          same event, and 24 hours before your hangout.
        </Text>
      </View>

      <View style={notificationSetupStyle.box}>
        <View style={notificationSetupStyle.boxItem}>
          <Ionicons name="sparkles-outline" size={18} color={COLORS.primary} />

          <Text style={notificationSetupStyle.boxItemText}>
            New hangout matched to you
          </Text>
        </View>

        <View style={notificationSetupStyle.boxItem}>
          <Lucide name="users-round" size={18} color={COLORS.success} />

          <Text style={notificationSetupStyle.boxItemText}>
            Someone you know is going too
          </Text>
        </View>

        <View style={notificationSetupStyle.boxItem}>
          <Lucide name="clock-5" size={18} color={COLORS.error} />

          <Text style={notificationSetupStyle.boxItemText}>
            Reminder 24 hrs before your hangout
          </Text>
        </View>

        <View style={notificationSetupStyle.boxItem}>
          <Lucide
            name="message-square-more"
            size={18}
            color={COLORS.textSecondary}
          />

          <Text style={notificationSetupStyle.boxItemText}>
            Messages from your hangout crew
          </Text>
        </View>
      </View>

      <View style={notificationSetupStyle.buttonContainer}>
        <Button
          title="Turn on notifications"
          variant="fill"
          onPress={() => router.replace("/(tabs)/feeds")}
        />

        <Button
          title="Not now"
          variant="outline"
          onPress={() => router.replace("/(tabs)/feeds")}
        />
      </View>
    </View>
  );
}

const notificationSetupStyle = StyleSheet.create({
  screen: {
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },

  bell: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    backgroundColor: COLORS.secondary,
    borderRadius: 50,
  },

  introText: {
    textAlign: "center",
  },

  subText: {
    textAlign: "center",
  },

  box: {
    gap: 20,
    backgroundColor: COLORS.surface,
    padding: 15,
    width: "100%",
  },

  boxItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  boxItemText: {
    fontWeight: 600,
  },

  buttonContainer: {
    flexDirection: "column",
    gap: 15,
    width: "100%",
  },
});
