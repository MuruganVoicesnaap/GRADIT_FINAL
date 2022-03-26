import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Constants, FONT, ICON } from "../../constants/constants";
import Card from "./card";
import Button from "../Button/button";
import Spinner from "react-native-loading-spinner-overlay";
import Icons from "react-native-vector-icons/MaterialIcons";

const RecipientViewCard = ({ item, onSpecificSelect, onSelect }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Card style={styles.card}>
      <Spinner
        color="#3b5998"
        visible={loading}
        size="large"
        textStyle={styles.spinnerTextStyle}
      />

      <View style={styles.row}>
        <Icons
          style={styles.fileIcon}
          name={"import-contacts"}
          size={30}
          color="#45a9bf"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.coursename}</Text>
          <Text
            style={styles.subTitle}
          >{`${item.yearname} | ${item.semestername} | ${item.sectionname}`}</Text>
          <Text style={styles.topicStyle}>{item.subjectname}</Text>
        </View>
      </View>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <Button
          style={styles.specificButton}
          onPress={() => {
            onSpecificSelect(item);
          }}
        >
          <Text style={[styles.actionButtonText, {color: '#1B82E1'}]}>
            Specific Students
          </Text>
        </Button> 

      <Text style={{fontSize: 13, color: '#777777', marginVertical: 5}}>
          -OR-
        </Text> 

        <Button
          style={styles.entireButton}
          onPress={() => {
            onSelect(item, true);
          }}
        >
          <Text style={[styles.actionButtonText]}>Entire Section</Text>
        </Button>
      </View>
    </Card>
  );
};

export default RecipientViewCard;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    backgroundColor: Constants.BRIGHT_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 16,
    height: undefined,
    marginVertical: 10,
    marginHorizontal: 1,
    borderRadius: 2,
    flex: 1,
  },
  fileIcon: {
    marginRight: 10,
  },
  titleContainer: {
    flex: 2,
    alignSelf: "flex-start",
  },
  topicStyle: {
    fontFamily: FONT.primaryRegular,
    fontSize: 14,
    color: "#1B82E1",
    marginTop: 3,
    paddingBottom: 2,
  },
  submitted: {
    fontFamily: FONT.primaryRegular,
    fontSize: 12,
    color: "#229557",
    marginBottom: 5,
    alignSelf: "flex-end",
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: 14,
    color: Constants.DARK_COLOR,
  },
  subTitle: {
    marginTop: 5,
    fontSize: 15,
    color: "#8A8A8A",
  },
  specificButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#1B82E1",
    color: "#1B82E1",
    width: "90%",
  },
  entireButton: {
    backgroundColor: "#229557",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    width: "90%",
  },
  actionButtonText: {
    fontSize: 10,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.WHITE_COLOR,
  },
  horizontalLine: {
    borderTopWidth: 0.5,
    borderColor: Constants.GREY091,
    marginTop: 12,
  },
  description: {
    fontFamily: FONT.primaryRegular,
    fontSize: 10,
    color: Constants.DARK_COLOR,
  },
});
