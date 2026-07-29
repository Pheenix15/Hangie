import AntDesign from "@react-native-vector-icons/ant-design";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../../components/ui/button";
import { APP_NAME, COLORS, FONT_SIZE } from "../../constants/brand";
import { signUp } from "../../services/auth";

export default function signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false); //Temporary, for Debugging

  // Signup function
  const handleSubmit = async () => {
    // Clear any previous error before trying again
    setErrorMessage("");
    setLoading(true);

    const { user, error } = await signUp(name, email, password);

    setLoading(false);

    if (error) {
      setErrorMessage(error);
      return;
    }

    router.replace("/profileSetup");
  };

  return (
    <View style={signupStyle.screen}>
      {errorMessage && <Text>Testing {errorMessage}</Text>}
      <Text style={signupStyle.introText}>Create your account</Text>
      <Text style={signupStyle.subText}>Takes 2 minutes. No spam. Ever.</Text>

      {/* Login Form */}
      <View style={signupStyle.form}>
        <TextInput
          placeholder="Your full name"
          value={name}
          onChangeText={setName}
          style={signupStyle.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={signupStyle.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          style={signupStyle.input}
          secureTextEntry
        />

        <Button
          title={
            loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              "Create account"
            )
          }
          variant="fill"
          onPress={handleSubmit}
        />

        <Button
          title={
            loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              "Open Profile Setup"
            )
          }
          variant="fill"
          onPress={() => router.replace("/profileSetup")}
        />
      </View>

      <Text style={{ textAlign: "center", marginTop: 20 }}>
        or continue with
      </Text>

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

      <Text style={{ marginTop: 20 }}>
        By continuing you agree to {APP_NAME}'s{" "}
        <Link href="google.com" style={{ color: COLORS.primary }}>
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="google.com" style={{ color: COLORS.primary }}>
          Privacy Policy
        </Link>
      </Text>

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
    height: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: COLORS.background,
  },

  introText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 600,
  },

  subText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 500,
    color: COLORS.textSecondary,
  },

  form: {
    gap: 20,
    marginTop: 20,
  },

  input: {
    borderWidth: 0.4,
    borderColor: COLORS.textSecondary,
    borderRadius: 9,
    backgroundColor: COLORS.surface,
    padding: 10,
  },

  altSignup: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
});
