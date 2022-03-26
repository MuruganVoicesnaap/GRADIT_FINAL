import React from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Keyboard,
} from "react-native";
import { Modal, Portal } from "react-native-paper";

import { Constants, FONT } from "../../constants/constants";

export const TextArea = ({ containerStyle = {}, count, ...restProps }) => (
  
  <View style={[styles.inputContainer, containerStyle]}>
    <TextInput
      editable
      multiline
      disabled
      maxLength={500}
      minHeight={100}
      fontSize={12}
      fontFamily={FONT.primaryRegular}
      onSubmitEditing={() => {
        Keyboard.dismiss();
      }}
      {...restProps}
    />
    <Text style={styles.countText}>{count}/500</Text>
  </View>
);

const styles = StyleSheet.create({
  countText: {
    fontFamily: FONT.primaryRegular,
    color: Constants.TEXT_INPUT_COLOR,
    fontSize: 12,
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  inputContainer: {
    paddingVertical: Platform.OS == 'ios' ?30:0,
    borderWidth: 0.5,
    borderColor: Constants.GREY004,
  },
});
