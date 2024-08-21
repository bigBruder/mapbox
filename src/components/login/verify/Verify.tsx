import {
  SafeAreaView,
  View,
  Text,
  Touchable,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import { Platform } from "react-native";

import styles from "./styles";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useState } from "react";
import { Button } from "@/components/UI/Button";

const CELL_COUNT = 4;

export const VerifyScreen = () => {
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
          <View style={styles.topContainer}>
            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.description}>
              Enter the code that was sent to naveen@gmail.com{" "}
            </Text>
            <TouchableOpacity>
              <Text style={styles.actionText}>Resend code</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <CodeField
              ref={ref}
              {...props}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete={Platform.select({
                android: "sms-otp",
                default: "one-time-code",
              })}
              testID="my-code-input"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </View>
          <Button
            title="Continue"
            onPress={() => {}}
            style={{ marginTop: 68 }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};
