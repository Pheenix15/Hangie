import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
// Styles
import Button from "../../components/ui/button";
import { COLORS, FONT_SIZE } from "../../constants/brand";

export default function welcome() {
  return (
    <View style={welcomeStyle.screen}>
      {/* INTRO */}
      <View style={welcomeStyle.intro}>
        <Text style={welcomeStyle.headline}>Your people are out there.</Text>

        <Text style={welcomeStyle.subtext}>
          Gather finds small groups who share your interests and brings you
          together in real life — no awkwardness, no planning.
        </Text>

        <Link href="/signup" asChild>
          <Button title="Get Started" variant="fill" />
        </Link>

        <Link href="/login" asChild>
          <Button title="I already have an account" variant="outline" />
        </Link>
      </View>

      {/* SECOND HALF */}
      <View style={welcomeStyle.features}>
        {/* Card 1 */}
        <View style={welcomeStyle.featureCard}>
          <View>
            {/* <Ionicons
                    name="hardware-chip-outline"
                    size={24}
                    color={COLORS.primary}
                /> */}
          </View>

          <View>
            <Text style={{ fontSize: FONT_SIZE.sm, fontWeight: 900 }}>
              AI picks events for you
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.xs,
                fontWeight: 700,
                color: COLORS.textSecondary,
              }}
            >
              Based on your interests, schedule & location
            </Text>
          </View>
        </View>

        {/* Card 2 */}
        <View style={welcomeStyle.featureCard}>
          <View>
            {/* <Ionicons
                    name="hardware-chip-outline"
                    size={24}
                    color={COLORS.primary}
                /> */}
          </View>

          <View>
            <Text style={{ fontSize: FONT_SIZE.sm, fontWeight: 900 }}>
              See who is going first
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.xs,
                fontWeight: 700,
                color: COLORS.textSecondary,
              }}
            >
              No surprises — meet people before you arrive
            </Text>
          </View>
        </View>

        {/* Card 3 */}
        <View style={welcomeStyle.featureCard}>
          <View>
            {/* <Ionicons
                    name="hardware-chip-outline"
                    size={24}
                    color={COLORS.primary}
                /> */}
          </View>

          <View>
            <Text style={{ fontSize: FONT_SIZE.sm, fontWeight: 900 }}>
              Max 15 people per hangout
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.xs,
                fontWeight: 700,
                color: COLORS.textSecondary,
              }}
            >
              Small groups only — intimate by design
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const welcomeStyle = StyleSheet.create({
  screen: {
    justifyContent: "space-around",
    height: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: COLORS.background,
  },

  intro: {
    alignItems: "center",
    gap: 15,
  },

  headline: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 600,
  },

  subtext: {
    color: COLORS.textSecondary,
    fontWeight: 500,
  },

  features: {
    gap: 20,
  },

  featureCard: {
    flexDirection: "row",
    alignContent: "center",
    gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 10,
  },
});
