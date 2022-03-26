import React, { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import RenderListItem from "react-native-dropdown-picker/src/components/RenderListItem";
import { useFocusEffect } from "@react-navigation/native";
import YearSection from "./YearSection";
import Spinner from "react-native-loading-spinner-overlay";

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  FlatList,
  SectionList,
  TouchableOpacity,
  Modal,
} from "react-native";

import AppConfig from "../../redux/app-config";
import Icons from "react-native-vector-icons/MaterialIcons";
import Button from "../Button/button";
import { stylesForDropDown } from "./commonStyles";
import { Alert } from "react-native";
import { Constants, ICON } from "../../constants/constants";
import triggerSimpleAjax from "../../context/Helper/httpHelper";
import { isDate } from "moment";

import StudentYearModal from "./StudentYearModal";

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

const getYearAndSections = (request) => {
  console.log("YearRequest", request);

  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.YEAR_SECTION_LIST}`,
      "POST",
      false,
      request,

      (res) => {
        const { Status, Message, data } = res;
        console.log("YEarStatus", Status);

        if (Status === 1) {
          resolve(res);
        } else {
          reject(Message || "Something went wrong... Please try again later");
        }
      },
      () => {
        reject("Something went wrong... Please try again later");
      }
    )
  );
};

const getDepartmentList = (request) => {
  return new Promise((res, rej) => {
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_COURSE_DEPARTMENT}`,
      "POST",
      false,
      request,
      (data) => {
        const { Status, Message } = data;
        console.log("departmenrtlst", data);
        console.log("departmenrtlstStatus", Status);

        if (Status === 1) {
          res(data);
        } else {
          rej(Message || "Something went wrong... Please try again later");
        }
      },
      () => {
        rej("Something went wrong... Please try again later");
      }
    );
  });
};

const renderListItem = (props) => {
  const IconComponent = (
    <View style={styles.iconContainerStyle}>
      <Icons
        name={`radio-button-${!props.isSelected ? "un" : ""}checked`}
        size={20}
        color="#18984B"
      />
    </View>
  );

  return (
    <RenderListItem
      {...props}
      IconComponent={IconComponent}
      listItemLabelStyle={{
        fontSize: Constants.FONT_BADGE,
      }}
      listItemContainerStyle={{
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 20,
      }}
    />
  );
};

const YearSectionSelect = ({
  memberid,
  collegeId,
  priority,
  Divisionid,
  dataForCourse,
  departmentId,
  setcategoryValue,
  onSubmit,
}) => {
  const [submitValue, setSubmitValue] = useState({});

  const [courseopen, setcourseOpen] = useState(false);
  const [courseloading, setcourseLoading] = useState(true);
  const [coursevalue, setcourseValue] = useState(
    priority === "p2" ? Divisionid : null
  );
  const [courseitems, setcourseItems] = useState(
    dataForCourse.filter((course) => course.course_name !== "All")
  );
  const [yearvalue, setyearValue] = useState(null);
  const [loading, setLoading] = useState(false);

  const [yearitems, setyearItems] = useState([]);
  const [sectionvalue, setsectionValue] = useState(null);
  const [ids, setIds] = useState([]);
  const [Studentshow, setStudentShow] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([])
  const [SelectedYearID, setSelectedYearID] = useState("");
  const [selectedSpecificSectionID, setSelectedSpecSectionID] = useState("");
  const [selectedStudentTextModal, setSelectedStudentTextModal] = useState(false)

  var selectedItems = [];

  useFocusEffect(
    React.useCallback(() => {
      setIds([]);
    }, [])
  );

  useEffect(() => {

    setcourseLoading(true);

    getDepartmentList({
      user_id: memberid,
      college_id: collegeId,
      dept_id: departmentId,
    })
      .then((departResponse) => {
        const { Status, data } = departResponse;
        if (Status === 1) {
          setcourseItems(data);
          console.log("setcourseItems", data);
        }
      })
      .then((departResponse) => setcourseLoading(false))
      .catch(() => {
        setcourseLoading(false);
      });
  }, [coursevalue]);

  useEffect(() => {
    if (coursevalue) {
      console.log("YearApi", coursevalue);
      setLoading(true);

      getYearAndSections({
        idcollege: collegeId,
        idcourse: coursevalue,
        clgprocessby: memberid,
      })
        .then((response) => {
          const { Status, data } = response;
          if (Status === 1) {
            const keyChangedData = data.map(
              ({
                sectiondetails: data,
                yearid: yearid,
                yearname: yearname,
              }) => ({ data, yearid, yearname })
            );

            setyearItems(keyChangedData);
            setLoading(false);
          }
        })
        .then((departResponse) => setLoading(false))
        .catch(() => {
          setLoading(false);
        });
    }
  }, [coursevalue]);

  useEffect(() => {


    console.log('coursevalue', coursevalue)
    if (selectedSection.length > 0) {
      console.log('selectedSection', JSON.stringify(selectedSection))

      setSubmitValue({
        ...defaultValue,
        course_id: coursevalue,
        sectionid: selectedSection,
        selectedCATEGORY: "SpecificSections",
      });

      console.log("sectionvalueSubmitted", submitValue);
    }
    console.log("sectionvalue", selectedSection);
  }, [selectedSection]);

  useEffect(() => {
    if (selectedStudents.length > 0) {

      setSelectedStudentTextModal(true)
      setSubmitValue({
        ...defaultValue,
        course_id: coursevalue,
        studentid: selectedStudents,
        selectedCATEGORY: "SpecificStudents",
      });
    } else {
      setSelectedStudentTextModal(false)

    }
    console.log("studentValue", selectedStudents);
  }, [selectedStudents]);

  const onSumbitValue = () => {
    setcourseOpen(false);
    console.log("submitted", submitValue);

    if (submitValue.sectionid !== null) {
      console.log("HodCourseValue", submitValue.course_id);
      onSubmit(submitValue);
    } else if (submitValue.studentid !== null) {
      onSubmit(submitValue);
    } else {
      Alert.alert("Kindly select minimum One value for each till Sections");
    }
  };

  const modalStyleText = () => {
    setStudentShow(false);
    <View style={styles.addRecipientPill}>
      <Text>Student Has been selected</Text>
    </View>;
  };
  const selectedItem = (item) => {
    const newIds = [...ids];
    const index = newIds.indexOf(item.sectionid);
    console.log("index", JSON.stringify(index));

    if (index > -1) {
      newIds.splice(index, 1);
      console.log("if", JSON.stringify(newIds));

    } else {
      newIds.push(item.sectionid);
      console.log("else", JSON.stringify(newIds));

    }
    setIds(newIds);
    setSelectedSection(newIds);
    selectedItems = newIds;
    console.log("newIds", JSON.stringify(newIds));

    if (selectedItems.length == 1) {
      setSelectedSpecSectionID(selectedItems[0]);
      console.log("selectedIDs", JSON.stringify(selectedItems[0]));

      for (let i = 0; i < yearitems.length; i++) {
        let yearId = yearitems[i].yearid;

        for (let j = 0; j < yearitems[i].data.length; j++) {
          let sectionID = yearitems[i].data[j].sectionid;
          setsectionValue(sectionID);

          if (sectionID == selectedItems[0]) {
            setSelectedYearID(yearId);
            console.log("SelectedYearID", SelectedYearID);
          }
        }
      }
    }

    if (selectedItems.length > 1) {
      setStudentShow(false);
      setSelectedStudentTextModal(false)
    } else {
      setStudentShow(true);
      setSelectedStudentTextModal(false)

    }
  };

  const renderItem = ({ item }) => {
    return (
      <YearSection
        name={item.sectionname}
        status={ids.includes(item.sectionid)}
        onPress={() => selectedItem(item)}
      ></YearSection>
    );
  };

  return (
    <>
      <ScrollView style={[styles.selectWrapper]}>
        {priority === "p2" ? (
          <DropDownPicker
            open={courseopen}
            value={coursevalue}
            items={courseitems.map((item) => ({
              label: item.course_name,
              value: item.course_id,
            }))}
            loading={courseloading}
            //disabled={courseitems.length === 0}
            setOpen={(x) => {
              setcourseOpen(x);
            }}
            setValue={(x) => {
              setcourseValue(x);
            }}
            setItems={(x) => {
              setcourseItems(x);
            }}
            containerProps={{
              height: courseopen ? 200 : undefined,
            }}
            renderListItem={renderListItem}
            // searchPlaceholder="Search..."
            showTickIcon={false}
            itemKey="value"
            placeholder=" -- Select Courses -- "
            placeholderStyle={styles.placeholderStyle}
            dropDownContainerStyle={styles.dropDownContainerStyle}
            style={styles.dropdown}
            searchTextInputStyle={styles.searchTextInputStyle}
            searchContainerStyle={styles.searchContainerStyle}
            listMode="SCROLLVIEW"
            ArrowUpIconComponent={({ style }) => (
              <Icons name="arrow-drop-up" size={25} />
            )}
            ArrowDownIconComponent={({ style }) => (
              <Icons name="arrow-drop-down" size={25} />
            )}
            // searchable
            closeAfterSelecting
            ActivityIndicatorComponent={({ color, size }) => (
              <ActivityIndicator color={color} size={size} />
            )}
            zIndex={6000}
            zIndexInverse={1000}
            ListEmptyComponent={({ }) => (
              <Text style={{ alignSelf: 'center' }}>No Data found</Text>
            )}
          />
        ) : null}

        {coursevalue ? (
          <SafeAreaView style={styles.addRecipientPill}>
            {loading ? (
              <Spinner color="#41acb0" visible={loading} size="large" />
            ) : (
              <SectionList
                sections={yearitems}
                renderItem={renderItem}
                renderSectionHeader={({ section }) => (
                  <Text style={styles.header}>{section.yearname}</Text>
                )}
                keyExtractor={(item, index) => item + index}
              />
            )}
          </SafeAreaView>
        ) : null}
      </ScrollView>
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
      {selectedStudentTextModal ? (
        <Button
          style={styles.specificButton}

        >
          <Text style={[styles.actionButtonText, { color: "#1B82E1" }]}>
            {selectedStudents.length}  Student has been selected</Text>
        </Button>
      ) : null}

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
            onSumbitValue();
          }}
        >
          <Text style={[styles.actionButtonText]}>ADD</Text>
        </Button>
      </View>

      {/* <View style={styles.ModalStyle}> */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { padding: 10 }]}>
            <StudentYearModal
              collegeid={collegeId}
              courseid={coursevalue}
              sectionid={selectedSpecificSectionID}
              yearid={SelectedYearID}
              courseName=''
              onCancel={() => {
                setModalVisible(!modalVisible);
                setStudentShow(false);

              }}
              onSend={(selectStudents) => {
                setModalVisible(!modalVisible);
                setStudentShow(false);
                setSelectedStudents(selectStudents);
                modalStyleText();


                console.log("selectStudents", selectStudents);
              }}
            />
          </View>
        </View>
      </Modal>
      {/* </View> */}
    </>
  );
};

export default YearSectionSelect;

const styles = StyleSheet.create({
  ...stylesForDropDown,

  FlatlistContainer: {
    borderRadius: 15,
    borderColor: Constants.GREY007,
    flexDirection: "row",
    marginVertical: 15,
    position: "relative",
  },
  addRecipientPill: {
    borderWidth: 1,
    marginTop: 2,
    borderRadius: 8,
    padding: 10,
    borderColor: Constants.GREY004,
  },
  YearNameTitleStyle: {
    color: "white",
    fontSize: 12,
    textAlign: "left",
    alignContent: "center",
    fontWeight: "bold",
    padding: 10,
  },
  SectionNamestyle: {
    color: "black",
    fontSize: 17,
    textAlign: "left",

    marginTop: 2,
    alignContent: "center",
  },

  item: {
    backgroundColor: "#daf4f7",
    marginVertical: 5,
  },
  header: {
    fontSize: 19,
    color: Constants.FACULTY_HEAD_COLOR,
    fontFamily: "bold",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 11,
  },
  specificButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 20,
    borderWidth: 1,
    marginBottom: 20,
    borderColor: "#1B82E1",
    color: "#1B82E1",
    width: "90%",
  },

  modalView: {
    alignItems: "center",
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
    backgroundColor: "white",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
