/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Modal, Portal } from "react-native-paper";
import Button from "../Button/button";
import RecipientViewCardNew from "../Card/RecipientViewCardNew";
import { Pill } from "../Pill/Pill";
import { Alert } from "react-native";
import CheckedIcon from "react-native-vector-icons/AntDesign";
import UncheckedIcon from "react-native-vector-icons/MaterialIcons";
import StudentYearModal from "./StudentYearModal";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Checkbox } from "react-native-paper";
import AppConfig from "../../redux/app-config";

// import Button from "../Button/button";
import { stylesForDropDown } from "./commonStyles";
// import { Alert } from "react-native";
import { Constants, ICON, FONT } from "../../constants/constants";
import triggerSimpleAjax from "../../context/Helper/httpHelper";
import SectionSelect from "./SectionSelect";
import { connect } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";

const itemsData = [];

const defaultValue = {
  course_id: null,
  department_id: null,
  departmentId: null,
  yearid: null,
  semesterid: null,
  sectionid: null,
  studentid: null,
  selectedCATEGORY: null,
};

const YourClassesSelection = ({
  onSubject,
  memberid,
  collegeId,
  priority,
  Divisionid,
  dataForCourse,
  departmentId,
  setcategoryValue,
  onSubmit,
  visible,
}) => {
  const [subjectYearData, setSubjectYearData] = useState([]);

  const [semOpen, setSemOpen] = useState(false);
  const [type, setType] = useState("Subject");
  const [semesterloading, setsemesterLoading] = useState(false);
  const category = [
    { name: "Subject", id: "1" },
    { name: "Tutor", id: "2" },
  ];

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
      collegeid: collegeId,
    };
    console.log("get_sub_class_request", request);

    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_SUBJECT_LIST}`,
      "POST",
      false,
      request,
      (result) => {
        const { Status, Message, data } = result;
        console.log("get_sub_class_response", result);
        if (Status === 1) {
          setSubjectYearData(data);
          setStudentShow(true)

        } else {
          Alert.alert(Message);
          setSubjectYearData([]);
          setStudentShow(false)
        }
      },
      (result) => {}
    );
  };

  const GetClassListForTutor = () => {
    const request = {
      staffid: memberid,
      collegeid: collegeId,
    };
    console.log("request_class_card", request);

    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_TUTOR_SUBJECT_LIST}`,
      "POST",
      false,
      request,
      (result) => {
        const { Status, Message, data } = result;
        console.log("class_response", result);
        if (Status === 1) {
          setSubjectYearData(data);
          setStudentShow(true)

        } else {
          Alert.alert(Message);
          setSubjectYearData([]);
          setStudentShow(false)

        }
      },
      (result) => {}
    );
  };

  const [ids, setIds] = useState([]);

  const [Studentshow, setStudentShow] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpecificSectionID, setSelectedSpecSectionID] = useState("");
  console.log("testVisible", visible);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sectionvalue, setsectionValue] = useState(null);
  const [selectedStudentTextModal, setSelectedStudentTextModal] = useState(
    false
  );
  const [submitValue, setSubmitValue] = useState({});
  const [SelectedSectionId, setSelectedSectionID] = useState("");
  const [SelectedYearID, setSelectedYearID] = useState("");
  const [SelectedCourseId, setSelectedCourseID] = useState("");

  var selectedItems = [];
  var courseId = "";

  var sectionId = "";
  var yearId = "";
  useFocusEffect(
    React.useCallback(() => {
      setIds([]);
    }, [])
  );

  const modalStyleText = () => {
    setStudentShow(false);
    <View style={styles.addRecipientPill}>
      <Text>Student Has been selected</Text>
    </View>;
  };

  const selectedItem = (item) => {
    const newIds = [...ids];
    const index = newIds.indexOf(item);
    console.log("index", JSON.stringify(index));

    if (index > -1) {
      newIds.splice(index, 1);
      console.log("if", JSON.stringify(newIds));
    } else {
      newIds.push(item);
      console.log("else", JSON.stringify(newIds));
    }
    setIds(newIds);

    var temp = [];

    for (let i = 0; i < newIds.length; i++) {
      temp.push(newIds[i].sectionid);
    }

    setSelectedSection(temp);

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
  };

  useEffect(() => {
    if (selectedStudents.length > 0) {
      setSelectedStudentTextModal(true);
      setSubmitValue({
        ...defaultValue,
        studentid: selectedStudents,
        selectedCATEGORY: "SpecificStudents",
      });
    } else {
      setSelectedStudentTextModal(false);
    }
    console.log("studentValue", selectedStudents);
  }, [selectedStudents]);

  useEffect(() => {
    if (selectedSection.length > 0) {
      setSubmitValue({
        ...defaultValue,
        sectionid: selectedSection,
        selectedCATEGORY: "SpecificSections",
      });
    }
    console.log("sectionvalue", selectedSection);
  }, [selectedSection]);

  const onSumbitValue = () => {
    onSubject(type);

    if (selectedSection.length > 0) {
      if (submitValue.sectionid !== null) {
        onSubmit(submitValue);
      } else if (submitValue.studentid !== null) {
        onSubmit(submitValue);
      } else {
        Alert.alert("Kindly select minimum One value for each till Sections");
      }
    } else {
      Alert.alert("Kindly select minimum One value for each till Sections");
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
            // onSelect={onSelect}
            onSpecificSelect={(item) => {
              setIShowSpecific(null);
              setShowSpecific(item);
            }}
          />
        </View>
      </>
    );
  };

  return (
    <>
      <ScrollView style={[styles.selectWrapper]}>
        {selectedStudentTextModal ? (
          <Button style={styles.specificButton}>
            <Text style={[styles.actionButtonText, { color: "#1B82E1" }]}>
              {selectedStudents.length} Student has been selected
            </Text>
          </Button>
        ) : null}

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

        <SafeAreaView>
          <FlatList
            data={subjectYearData}
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

        <Portal>
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={[styles.modalView, { padding: 1 }]}>
                <StudentYearModal
                  collegeid={collegeId}
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
                    // onSelect(data, false, selectStudents);
                    modalStyleText();
                    console.log("selectStudents", selectStudents);
                  }}
                />
              </View>
            </View>
          </Modal>
        </Portal>
      </ScrollView>
      <View style={[styles.buttonWrapper]}>
        <Button
          style={styles.cancelButton}
          onPress={() => {
            // setcourseOpen(false);
            setcategoryValue(null);
          }}
        >
          <Text style={[styles.actionButtonText]}>Change Category</Text>
        </Button>
        <Button
          style={styles.submitButton}
          onPress={() => {
            // onSubmit(submitValue);
            onSumbitValue();
          }}
        >
          <Text style={[styles.actionButtonText]}>ADD</Text>
        </Button>
      </View>
    </>
  );
};

const mapStatetoProps = ({ app }) => ({
  memberid: app?.maindata?.memberid,
});

export default connect(mapStatetoProps, null)(YourClassesSelection);

//export default YourClassesSelection;

const styles = StyleSheet.create({
  ...stylesForDropDown,
  addRecipientPill: {
    borderWidth: 1,
    borderColor: Constants.GREY004,
    height: 36,
    marginTop: 10,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
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
  selectWrapper: {
    marginVertical: 15,
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
    width: "90%",
    height: "90%",
    alignItems: "stretch",
  },

  centeredView: {
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 30,
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

  actionButtonText: {
    fontSize: 10,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.WHITE_COLOR,
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
