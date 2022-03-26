import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Constants, FONT } from "../../constants/constants";
import CheckedIcon from "react-native-vector-icons/AntDesign";
import UncheckedIcon from "react-native-vector-icons/MaterialIcons";

const YearSection = (props) => {
  console.log("Status", props.status);
  return (
    <View style={styles.CheckStyles}>

      <Text style={styles.text}>{props.name}</Text>

      <TouchableOpacity
        style={styles.container}
        onPress={props.onPress}
      >
        {props.status ? (
          <CheckedIcon
            name="checkcircle"
            color={Constants.GREEN001}
            size={24}
          />
        ) : (
          <UncheckedIcon
            name="radio-button-unchecked"
            color={Constants.GREEN001}
            size={24}
          />
        )}
      </TouchableOpacity>

    </View>
  );
};

export default YearSection;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: "flex-end",
    margin: 2,
  },

  CheckStyles: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 1,
  },
  text: {
    marginHorizontal: 5,
    marginVertical: 3,
    justifyContent: 'flex-start',
    alignItems: "flex-start",
    marginBottom: 5,
    fontSize: Constants.FONT_FULL_LOW,
    fontFamily: FONT.primaryRegular,
  },
});
