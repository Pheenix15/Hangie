import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Button from "../../components/ui/button";
import Input from "../../components/ui/textInput";
import { COLORS, FONT_SIZE } from "../../constants/brand";
import { signIn } from "../../services/auth";
import { globalStyles } from "../../styles/global";

// Icon
import AntDesign from "@react-native-vector-icons/ant-design";

export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); //Error Message
  const [loading, setLoading] = useState(""); //Loading State
  const [loggedin, setLoggedin] = useState(false); //Temporary, for Debugging

  const handleSubmit = async () => {
    // Clear any previous error before trying again
    setErrorMessage("");
    setLoading(true);

    const { user, error } = await signIn(email, password);

    setLoading(false);

    if (error) {
      setErrorMessage(error);
      return;
    }

    router.replace("(tabs)/feeds");
  };

  return (
    <View style={[globalStyles.screen, signupStyle.screen]}>
      {errorMessage && <Text color={COLORS.error}>{errorMessage}</Text>}
      <Text style={signupStyle.introText}>Login into your account</Text>

      {/* Login Form */}
      <View style={signupStyle.form}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
        />

        <Button
          title={loading ? <ActivityIndicator color={COLORS.white} /> : "Login"}
          variant="fill"
          onPress={handleSubmit}
        />
      </View>

      <Text style={{ textAlign: "center", marginTop: 20 }}>or login with</Text>

      {/* GOOGLE/APPLE BUTTON */}
      <View style={signupStyle.altSignup}>
        <Button
          icon={<AntDesign name="google" size={20} color="black" />}
          title="Google"
          variant="outline"
          style={{ flex: 1 }}
        />
        <Button
          icon={<AntDesign name="apple" size={20} color="black" />}
          title="Apple"
          variant="outline"
          style={{ flex: 1 }}
        />
      </View>

      {/* DEBUGGING _ Checks if form values are being recieved */}
      {/* <View>
        {accountCreated && (
          <View>
            <Text>{name}</Text>
            <Text>{email}</Text>
            <Text>{password}</Text>
          </View>
        )}
      </View> */}
    </View>
  );
}

const signupStyle = StyleSheet.create({
  screen: {
    paddingTop: 100,
  },

  introText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 600,
  },

  form: {
    gap: 20,
    marginTop: 20,
  },

  altSignup: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
});
