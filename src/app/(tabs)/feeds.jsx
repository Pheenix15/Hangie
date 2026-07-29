import { router } from "expo-router";
import { Text, View } from "react-native";
import Button from "../../components/ui/button";

export default function feeds() {
  return (
    <View>
      <Text>Feeds</Text>

      <Button
        title={"Welcome page"}
        variant="fill"
        onPress={() => router.replace("/welcome")}
      />

      <Button
        title={"Profile Setup"}
        variant="fill"
        onPress={() => router.replace("/profileSetup")}
      />
    </View>
  );
}
