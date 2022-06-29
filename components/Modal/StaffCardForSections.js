/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import { Modal, Portal } from "react-native-paper";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  VirtualizedList,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Button from "../Button/button";
import RecipientViewCardNew from "../Card/RecipientViewCardNew";
import { TextInput, List, Checkbox } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import triggerSimpleAjax from "../../context/Helper/httpHelper";
import { Constants, FONT, ICON } from "../../constants/constants";
import Icons from "react-native-vector-icons/MaterialIcons";
import { Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import StudentYearModal from "../AddReceipients/StudentYearModal";
import YearSection from "../AddReceipients/YearSection";
import CheckedIcon from "react-native-vector-icons/AntDesign";
import UncheckedIcon from "react-native-vector-icons/MaterialIcons";
import { ExternalStorageDirectoryPath } from "react-native-fs";
import { getSubjectDetails } from "../../redux/actions/getSubjectDetailsForSem";
import AppConfig from "../../redux/app-config";
import { connect } from "react-redux";

const StaffCardForSections = ({
  memberid,
  visible,
  collegeid,
  data,
  onSelect,
  currentItem,
  studentList,
  studentListVisiable,
  onClose,
  setcategoryValue,
}) => {
  const [showSpecific, setShowSpecific] = useState(null);
  const [IstudentList, setIShowSpecific] = useState(null);
  const [ids, setIds] = useState([]);

  const [Studentshow, setStudentShow] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpecificSectionID, setSelectedSpecSectionID] = useState("");
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sectionvalue, setsectionValue] = useState(null);
  const [SelectedSectionId, setSelectedSectionID] = useState("");
  const [SelectedYearID, setSelectedYearID] = useState("");
  const [SelectedCourseId, setSelectedCourseID] = useState("");
  const [selectedStudentTextModal, setSelectedStudentTextModal] = useState(
    false
  );

  const [SelecetedSubjectType, setSelectedSubjectType] = useState("");

  const [semOpen, setSemOpen] = useState(false);
  const [type, setType] = useState("Subject");
  const [semesterloading, setsemesterLoading] = useState(false);
  //const [selectedSectionss, setSelectedSectionss] = useState([]);

  const [subjectData, setSubjectData] = useState([]);
  const category = [
    { name: "Subject", id: "1" },
    { name: "Tutor", id: "2" },
  ];
  const [visibleSend, setSendVisible] = useState(false);

  var selectedItems = [];
  var courseId = "";
  var sectionId = "";
  var yearId = "";

  useFocusEffect(
    React.useCallback(() => {
      setIds([]);
    }, [])
  );
  useEffect(() => {
    if (studentListVisiable) {
      setIShowSpecific(studentList);
      setShowSpecific(currentItem);
    }
  }, [studentListVisiable, currentItem]);

  useEffect(() => {
    console.log("subject type", type);
    if (type == "Tutor") {
      GetClassListForTutor();
    } else {
      getSubjectList();
    }
  }, [type]);

  const getSubjectList = () => {
    const request = {
      staffid: memberid,
      collegeid: collegeid,
    };
    console.log("request_staff_card", request);

    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_SUBJECT_LIST}`,
      "POST",
      false,
      request,
      (result) => {
        const { Status, Message, data } = result;
        console.log("staff_response", result);
        if (Status === 1) {
          setStudentShow(true);
          setSubjectData(data);
        } else {
          setSubjectData([]);
          setStudentShow(false);
          Alert.alert(Message);
        }
      },
      (result) => {}
    );
  };

  const GetClassListForTutor = () => {
    const request = {
      staffid: memberid,
      collegeid: collegeid,
    };
    console.log("request_staff_card", request);

    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_TUTOR_SUBJECT_LIST}`,
      "POST",
      false,
      request,
      (result) => {
        const { Status, Message, data } = result;
        console.log("staff_response", result);
        if (Status === 1) {
          setSubjectData(data);
          setStudentShow(true);

        } else {
          setSubjectData([]);
          setStudentShow(false);
          Alert.alert(Message);
        }
      },
      (result) => {}
    );
  };

  const selectedItem = (item) => {
    const newIds = [...ids];
    //const index = newIds.indexOf(item.sectionid);
    const index = newIds.indexOf(item);

    console.log("index", JSON.stringify(index));

    if (index > -1) {
      newIds.splice(index, 1);
      console.log("if", JSON.stringify(newIds));
    } else {
      //newIds.push(item.sectionid);
      newIds.push(item);

      console.log("else", JSON.stringify(newIds));
    }
    setIds(newIds);

    var temp = [];
    for (let i = 0; i < newIds.length; i++) {
      temp.push(newIds[i].sectionid);
    }
    setSelectedSection(temp);
    console.log("selectedSectionss", temp.length);
    selectedItems = temp;
    console.log("newIds", JSON.stringify(newIds));

    if (selectedItems.length == 1) {
      setSelectedSpecSectionID(selectedItems[0]);
      console.log("TeacherselectedIDs", JSON.stringify(selectedItems[0]));

      yearId = item.yearid;
      courseId = item.courseid;
      sectionId = item.sectionid;
      setSelectedYearID(yearId);
      setSelectedCourseID(courseId);
      setSelectedSectionID(sectionId);

      console.log("sectionID", SelectedSectionId);
      console.log("courseId", SelectedCourseId);
    }

    if (selectedItems.length > 1) {
      setStudentShow(false);
      setSelectedStudentTextModal(false);
    } else {
      setStudentShow(true);
      setSelectedStudentTextModal(false);
    }

    if (selectedItems.length > 0) {
      setSendVisible(true);
    } else {
      setSendVisible(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <>
        <View style={styles.CheckStyles}>
          <TouchableOpacity
            style={styles.container}
            onPress={() => selectedItem(item)}
          >
            {ids.includes(item) ? (
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
          <RecipientViewCardNew
            key={item.detailsid}
            item={item}
            onSelect={onSelect}
            onSpecificSelect={(item) => {
              setIShowSpecific(null);
              setShowSpecific(item);
            }}
          />
        </View>
      </>
    );
  };

  const closeStudentModel = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <SafeAreaView>
      <Portal>
        <Modal
          visible={visible}
          onRequestClose={onClose}
          contentContainerStyle={[
            styles.modalContainerStyle,
            { padding: showSpecific !== null ? 0 : 12 },
          ]}
        >
          <View style={{ flexDirection: "column" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontFamily: FONT.primaryBold, fontSize: 10, flex: 1 }}
              >
                Add Recipients
              </Text>

              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={styles.editButtonView}
                  onPress={onClose}
                >
                  <Text style={{ fontSize: 15, color: Constants.WHITE_COLOR }}>
                    CANCEL
                  </Text>
                </TouchableOpacity>

                {visibleSend ? (
                  <TouchableOpacity
                    style={styles.editButtonView}
                    onPress={() => onSelect(data, true, selectedSection, type)}
                  >
                    <Text
                      style={{ fontSize: 15, color: Constants.WHITE_COLOR }}
                    >
                      SEND
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {!modalVisible ? (
              <View style={{ flexDirection: "column" }}>
                <Text style={{ marginLeft: 15 }}>Select Subject/Tutor</Text>
                <DropDownPicker
                  placeholder={"Subject"}
                  open={semOpen}
                  value={type}
                  items={category?.map((item) => ({
                    label: item.name,
                    value: item.name,
                  }))}
                  setOpen={setSemOpen}
                  setValue={(x) => {
                    setType(x);
                    setIds([]);
                  }}
                  loading={semesterloading}
                  containerProps={{
                    height: semOpen ? 150 : undefined,
                  }}
                  containerStyle={styles.containerStyle}
                  dropDownContainerStyle={{ margin: 15 }}
                  listMessageContainerStyle={{ margin: 15, marginBottom: 0 }}
                  listMode="SCROLLVIEW"
                  ListEmptyComponent={({ message }) => (
                    <Text style={{ alignSelf: "center", textAlign: "center" }}>
                      No Data found
                    </Text>
                  )}
                />
              </View>
            ) : null}
          </View>

          {selectedStudentTextModal ? (
            <Button style={styles.specificButton}>
              <Text style={[styles.actionButtonText, { color: "#1B82E1" }]}>
                {selectedStudents.length} Student has been selected
              </Text>
            </Button>
          ) : null}

          <SafeAreaView>
            <FlatList
              data={subjectData}
              renderItem={renderItem}
              // keyExtractor={item => item.id}
              keyExtractor={(item, index) => item + index}
            />
          </SafeAreaView>

          {Studentshow ? (
            <Button
              style={styles.specificButton}
              onPress={() => {
                if (selectedSection.length < 1) {
                  Alert.alert("Kindly Select One Section");
                } else {
                  setModalVisible(true);
                }
              }}
            >
              <Text style={[styles.actionButtonText, { color: "#1B82E1" }]}>
                Specific Students
              </Text>
            </Button>
          ) : null}

          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              closeStudentModel();
            }}
          >
            <View style={styles.centeredView}>
              <View style={[styles.modalView, { padding: 10 }]}>
                <StudentYearModal
                  collegeid={collegeid}
                  courseid={SelectedCourseId}
                  sectionid={SelectedSectionId}
                  yearid={SelectedYearID}
                  subjecttype={type}
                  courseName=""
                  onCancel={() => {
                    setModalVisible(!modalVisible);
                    setStudentShow(true);
                  }}
                  onSend={(selectStudents) => {
                    setModalVisible(!modalVisible);
                    setStudentShow(true);
                    setSelectedStudents(selectStudents);
                    onSelect(data, false, selectStudents);

                    // modalStyleText();

                    // <Text style={[styles.actionButtonText]}>ADD</Text>

                    console.log("selectStudents", selectStudents);
                  }}
                />
              </View>
            </View>
          </Modal>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const mapStatetoProps = ({ app }) => ({
  memberid: app?.maindata?.memberid,
});

export default connect(mapStatetoProps, null)(StaffCardForSections);

//export default StaffCardForSections;

const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    justifyContent: "flex-start",
    marginBottom: 100,
    // maxHeight: "120%",
  },
  noData: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontFamily: FONT.primaryBold,
    fontSize: 10,
  },
  specificButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: "#1B82E1",
    color: "#1B82E1",
    width: "90%",
  },
  editButton: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_ELEVEN,
    color: Constants.WHITE_COLOR,
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

  editButtonView: {
    backgroundColor: Constants.RED003,
    width: 90,
    height: 30,
    marginTop: 5,
    padding: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    flexDirection: "row",
    backgroundColor: Constants.WHITE_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 10,
    fontFamily: FONT.primaryRegular,
    color: "#222222",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalView: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: "100%",
    alignItems: "stretch",
    backgroundColor: Constants.BRIGHT_COLOR,
  },

  centeredView: {
    backgroundColor: Constants.BRIGHT_COLOR,
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  ModalStyle: {
    flex: 1,
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
    marginHorizontal: 15,
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
  container: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },

  CheckStyles: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 1,
  },
  text: {
    marginHorizontal: 5,
    marginVertical: 3,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 5,
    fontSize: Constants.FONT_FULL_LOW,
    fontFamily: FONT.primaryRegular,
  },
  containerStyle: {
    padding: 15,
  },
});
