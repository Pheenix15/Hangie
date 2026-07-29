import { StyleSheet, TextInput } from "react-native";
import { COLORS } from "../../constants/brand";

export default function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  style,
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      style={[inputStyle.input, style]}
    />
  );
}

const inputStyle = StyleSheet.create({
  input: {
    borderWidth: 0.4,
    borderColor: COLORS.textSecondary,
    borderRadius: 9,
    backgroundColor: COLORS.surface,
    padding: 10,
  },
});
