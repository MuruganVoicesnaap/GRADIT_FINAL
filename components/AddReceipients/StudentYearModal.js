import React, { useEffect, useState } from "react";
import { Modal, Portal } from "react-native-paper";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  VirtualizedList,
  TouchableOpacity,
} from "react-native";
import Button from "../Button/button";
import { Constants, FONT } from "../../constants/constants";
import { TextInput, List, Checkbox } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import AppConfig from "../../redux/app-config";
import triggerSimpleAjax from "../../context/Helper/httpHelper";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { connect } from "react-redux";

const StudentYearModal = ({
  subjecttype,
  memberid,
  collegeid,
  courseid,
  yearid,
  sectionid,
  onCancel,
  courseName,
  onSend,
}) => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [orgStudents, setOrgStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, selectStudents] = useState([]);
  const [visibleSend, setVisibleSend] = useState(false);

  console.log("sectionid", sectionid);
  console.log("satffId", memberid);

  useEffect(() => {
    if (search !== "") {
      const filteredList = orgStudents.filter(function (student) {
        return student.name.toLowerCase().includes(search.toLowerCase());
      });
      setStudents(filteredList);
      // console.log(filteredList);
    } else {
      setStudents(orgStudents);
    }
  }, [search]);

  useEffect(() => {
    if (subjecttype == "Tutor") {
      GetMentorstudentListforapp(collegeid);
    } else {
      getStudents(collegeid);
    }
  }, [collegeid]);

  useEffect(() => {
    if (selectedStudents.length > 0) {
      setVisibleSend(true);
    } else {
      setVisibleSend(false);
    }
  }, [selectedStudents]);

  const getStudents = (collegeid) => {
    setLoading(true);
    const request = {
      courseid: courseid,
      // deptid: item.departmentid,
      yearid: yearid,
      sectionid: sectionid,
      collegeid: collegeid,
    };

    console.log("stu_Request", request);

    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_STUDENT_LIST}`,
      "POST",
      false,
      request,

      (result) => {
        const { Status, data } = result;
        console.log("Status", Status);
        if (Status === 1) {
          console.log("Students", JSON.stringify(data));
          setOrgStudents(data);
          setStudents(data);
          setLoading(false);
        }
      },
      (result) => {
        setOrgStudents([]);
        setStudents([]);
        setLoading(false);
      }
    );
  };

  const GetMentorstudentListforapp = (collegeid) => {
    setLoading(true);
    const request = {
      staffid: memberid,
      // deptid: item.departmentid,
      yearid: yearid,
      sectionid: sectionid,
      collegeid: collegeid,
    };

    console.log("stu_Request", request);

    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_MENTOR_STUDENT_LIST}`,
      "POST",
      false,
      request,

      (result) => {
        const { Status, data } = result;
        console.log("Status", Status);
        if (Status === 1) {
          console.log("Students", JSON.stringify(data));
          setOrgStudents(data);
          setStudents(data);
          setLoading(false);
        }
      },
      (result) => {
        setOrgStudents([]);
        setStudents([]);
        setLoading(false);
      }
    );
  };

  const renderItem = ({ item }) => {
    return selectedStudents.includes(item.memberid) ? (
      <List.Item
        title={item.name}
        onPress={() => {
          selectStudents(selectedStudents.filter((e) => e !== item.memberid));
          console.log("testStudentid", selectedStudents);
        }}
        right={(props) => (
          <List.Icon
            {...props}
            icon="check-box-outline"
            color="#fff"
            style={{
              backgroundColor: "#3F6EE8",
            }}
          />
        )}
        style={{
          backgroundColor: "#3F6EE8",
          paddingVertical: 0,
        }}
        titleStyle={{
          color: Constants.WHITE_COLOR,
        }}
      />
    ) : (
      <List.Item
        title={item.name}
        onPress={() => {
          selectStudents([...selectedStudents, item.memberid]);
          console.log("checktest", selectedStudents);
        }}
        right={(props) => (
          <List.Icon
            {...props}
            icon="checkbox-marked"
            color="#D9D9D9"
            style={{
              paddingRight: 3,
            }}
          />
        )}
        style={{
          paddingVertical: 0,
        }}
      />
    );
  };

  return (
    <View
      style={{
        flexDirection: "column",
        // height: "100%",
        flex: 1,
        justifyContent: "flex-start",
      }}
    >
      <View>
        <View
          style={{
            padding: 20,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            flexDirection: "row",
            backgroundColor: "#056986",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.topicStyle}></Text>
            <Text style={styles.title}>{courseName}</Text>
            <Text style={styles.subTitle}> </Text>
          </View>

          <View style={{ justifyContent: "center" }}>
            {visibleSend ? (
              <Button
                style={styles.sendButton}
                onPress={() => {
                  onSend(selectedStudents);
                }}
              >
                <Text style={{ ...styles.actionButtonText }}>Submit</Text>
              </Button>
            ) : null}

            <Button
              style={styles.cancelButton}
              onPress={() => {
                onCancel(selectedStudents);
              }}
            >
              <Text style={{ ...styles.actionButtonText }}>Cancel</Text>
            </Button>
          </View>
        </View>
        <TextInput
          mode="flat"
          value={search}
          onChangeText={setSearch}
          placeholder="Search for a student"
          right={<TextInput.Icon name={"magnify"} />}
          style={{
            backgroundColor: "#F9F9F9",
            borderBottomColor: "#9F9F9F",
            borderBottomWidth: 0.8,
            height: 50,
          }}
        />
      </View>

      <View
        style={{
          padding: 10,
          flex: 1,
        }}
      >
        {loading ? (
          <Spinner color="#3b5998" visible={loading} size="large" />
        ) : students.length !== 0 ? (
          <VirtualizedList
            data={students}
            initialNumToRender={5}
            getItem={(data, index) => data[index]}
            getItemCount={(data) => data.length}
            renderItem={renderItem}
            contentContainerStyle={[styles.viewLastCard]}
            keyExtractor={(item) => item.detailsid}
          />
        ) : students.length === 0 ? (
          <View style={styles.noData}>
            <Text
              style={[
                styles.title,
                {
                  fontFamily: FONT.primaryRegular,
                  color: Constants.DARK_COLOR,
                },
              ]}
            >
              No data found
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const mapStatetoProps = ({ app }) => ({
  memberid: app?.maindata?.memberid,
});

export default connect(mapStatetoProps, null)(StudentYearModal);

//export default StudentYearModal;

const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 8,
    maxHeight: "90%",
    flex: 1,
  },
  heading: {
    fontFamily: FONT.primaryBold,
    fontSize: 12,
  },

  noData: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  viewLastCard: {
    paddingVertical: "5%",
  },
  titleContainer: {
    flex: 1,
  },
  topicStyle: {
    fontFamily: FONT.primaryRegular,
    fontSize: 11,
    color: "#FFD128",
    marginTop: 3,
    paddingBottom: 2,
  },
  title: {
    fontFamily: FONT.primaryRegular,
    fontSize: 14,
    color: Constants.WHITE_COLOR,
  },
  subTitle: {
    fontFamily: FONT.primaryRegular,
    marginTop: 5,
    fontSize: 11,
    color: "#A9F5FF",
  },
  sendButton: {
    flexDirection: "row",
    backgroundColor: Constants.RED003,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  cancelButton: {
    flexDirection: "row",
    backgroundColor: Constants.RED003,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginTop: 5,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    color: "#A9F5FF",
  },
});
