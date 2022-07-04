/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header/Header";
import Button from "../../../components/Button/button";
import Advertisement from "../../../components/Advertisement";
import {
  Constants,
  FONT,
  ICON,
  TOUCHABLE_ACTIVE_OPACITY,
} from "../../../constants/constants";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import { addNoticeApi } from "../../../redux/actions/noticeBoard";
import { connect } from "react-redux";
import { setBottomSheetData } from "../../../redux/actions/setBottomSheetData";
import { TextArea } from "../../../components/TextArea/TextArea";
import { Pill } from "../../../components/Pill/Pill";
import AddRecipients from "../../../components/Modal/AddRecipients";
import { Provider } from "react-native-paper";
import { Checkbox } from "../../../components/Checkbox/Checkbox";
import { AddRecipientModal } from "../../../components/AddRecipientModal";
import FeedbackModal from "../../../components/Modal/Feedback";
import ChooseRecipient from "../../../components/Modal/chooseReceipentTypeForHOD";

import StaffCardForSection from "../../../components/Modal/StaffCardForSections";
import AppConfig from "../../../redux/app-config";
import triggerSimpleAjax from "../../../context/Helper/httpHelper";
import Icon from "react-native-vector-icons/MaterialIcons";
import InitialCategory from "../../../components/AddReceipients/InitialCategory";
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const AddNotice = ({
  navigation,
  collegeId,
  memberid,
  priority,
  courseid,
  isParentEnable,
  setBottomSheetData,
  departmentId,
  division_id,
  route,
}) => {
  const [title, setTitle] = useState(route?.params?.title);
  const [description, setDescription] = useState(route?.params?.describe);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleAddRecipentModal = () =>
    setModalVisible((prevState) => !prevState);
  const [receiverList, setReceiverList] = useState([]);
  const [receiverTypeId, setReceiverTypeId] = useState("");
  const [receiverKind, setReceiverKind] = useState("");
  const [targets, setTargets] = useState([]);
  const [feedbackModalVisible, setfeedbackModalVisible] = useState(false);
  const [saving, isSaving] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const editCheck = route?.params?.edit;

  const [modalVisibleForHOD, setModalVisibleForHOD] = useState(false);
  const toggleRecipentModalForHOD = () =>
    setModalVisibleForHOD((prevState) => !prevState);

  const [studentList, setStudentList] = useState(null);
  const [studentListVisiable, setStudnetListVisiable] = useState(false);
  const [currenItem, setCurrentItem] = useState(null);
  const [subjectYearData, setSubjectYearData] = useState([]);
  const showSubjectsModal = () => setModalVisibleForSpecific(true);
  const hideSubjectsModal = () => setModalVisibleForSpecific(false);
  const [modalVisibleForSpecific, setModalVisibleForSpecific] = useState(false);
  const [specificViewReview, setSpecificViewReview] = useState(false);
  console.log(isParentEnable, targets);
  const [subjectType, setSubjectType] = useState('Subject');
  const [staffTypes, setStaffType] = useState([]);

  useEffect(() => {
    //getSubjectList();
  }, []);

  const getSubjectList = () => {
    const request = {
      staffid: memberid,
      collegeid: collegeId,
    };

    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_SUBJECT_LIST}`,
      "POST",
      false,
      request,
      (result) => {
        const { Status, data } = result;
        if (Status === 1) {
          setSubjectYearData(data);
        }
      },
      (result) => {}
    );
  };
  useEffect(() => {
    return () => setBottomSheetData({ hideSheet: false });
  }, []);
  const goBack = () => {
    navigation.goBack();
  };

  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => goBack() },
    ]);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);
  const [TAREGTS, setTargetsValueInitial] = useState([]);
  const [TAREGTS_VALUE, setTargetsValue] = useState([]);
  const ENTIRETAREGTS = [
    { label: "Students", value: "isStudent" },
    { label: "Parents", value: "isParent" },
    { label: "Staff", value: "isStaff" },
  ];
  useEffect(() => {
    if (Number(isParentEnable) === 0) {
      setTargetsValueInitial([
        { label: "Students", value: "isStudent" },
        { label: "Staff", value: "isStaff" },
      ]);
      setTargetsValue([{ label: "Students", value: "isStudent" }]);
    } else {
      setTargetsValueInitial([
        { label: "Students", value: "isStudent" },
        { label: "Parents", value: "isParent" },
        { label: "Staff", value: "isStaff" },
      ]);
      setTargetsValue([
        { label: "Students", value: "isStudent" },
        { label: "Parents", value: "isParent" },
      ]);
    }
  }, [isParentEnable]);
  useEffect(() => {
    console.log(isParentEnable);
    if (
      (priority === "p1" || priority === "p2") &&
      !(
        receiverKind === "Entire College" ||
        receiverKind === "Division" ||
        // receiverKind === "Group" ||
        // receiverKind === "Specific Section" ||
        // receiverKind === "Entire Course" ||
        receiverKind === "Entire Department" ||
        // receiverKind === "Specific Course" ||
        receiverKind === "Specific Department"
      ) &&
      Number(isParentEnable) === 0
    ) {
      setTargets([{ label: "Students", value: "isStudent" }]);
    } else if (priority === "p3" && Number(isParentEnable) === 0) {
      setTargets([{ label: "Students", value: "isStudent" }]);
    } else {
      console.log(
        (priority === "p1" || priority === "p2") &&
          !(
            receiverKind === "Entire College" ||
            receiverKind === "Division" ||
            // receiverKind === "Group" ||
            // receiverKind === "Specific Section" ||
            // receiverKind === "Entire Course" ||
            receiverKind === "Entire Department" ||
            // receiverKind === "Specific Course" ||
            receiverKind === "Specific Department"
          ) &&
          Number(isParentEnable) === 0
      );
      setTargets([]);
    }
  }, [isParentEnable, receiverKind, priority]);
  const titleMaxLength = 100;

  const onSelectTaget = (option) => {
    let valueIndex = -1;
    targets.some((target, index) => {
      if (target.value === option.value) {
        valueIndex = index;
        return true;
      }
    });
    if (valueIndex > -1) {
      targets.splice(valueIndex, 1);
    } else {
      targets.push(option);
    }
    setTargets([...targets]);
    console.log(targets, "cj");
  };

  const validate = () => {
    const titleLength = title?.trim();
    const describeLength = description?.trim();
    if (title === "" || title === undefined || titleLength.length === 0) {
      Alert.alert("Title should not be empty");
      return false;
    } else if (
      description === "" ||
      description === undefined ||
      describeLength.length === 0
    ) {
      Alert.alert("Description should not be empty");
      return false;
    } else if (receiverTypeId === "" || receiverTypeId === undefined) {
      if (route?.params?.edit === "edit") {
        return true;
      }
      Alert.alert("Select the receiver type");
      return false;
    } else if (targets?.length === 0 || targets?.length === undefined) {
      if (route?.params?.edit === "edit") {
        return true;
      }
      Alert.alert("Please select the target type");
      return false;
    }
    return true;
  };
  const confirmAdd = () => {
    const receiverCheckArray = Array.isArray(receiverList)
      ? receiverList[0]
      : receiverList;

    // console.log(receiverList.length, receiverList);
    if (validate()) {
      setLoading(true);
      setfeedbackModalVisible(true);
      isSaving(true);
      console.log(
        "req",
        receiverList,
        receiverList.length,
        typeof receiverList,
        {
          receiveridlist:
            typeof receiverList !== "string" && typeof receiverList !== "number"
              ? receiverList.join("~")
              : receiverCheckArray,
        }
      );
      addNoticeApi({
        noticeboardid: route?.params?.id ? route?.params?.id : "",
        colgid: collegeId,
        receiveridlist:
          typeof receiverList !== "string" && typeof receiverList !== "number"
            ? receiverList.join("~")
            : receiverCheckArray,
        receivertype: receiverTypeId,
        topic: title,
        description: description,
        staffid: memberid,
        callertype: priority,
        processtype: route?.params?.edit ? route?.params?.edit : "add",
        isstudent: targets.some(
          (target) => target.value === ENTIRETAREGTS[0].value
        ),
        isparent: targets.some(
          (target) => target.value === ENTIRETAREGTS[1].value
        ),
        isstaff: targets.some(
          (target) => target.value === ENTIRETAREGTS[2].value
        ),
        subjectType: subjectType,
      })
        .then((result) => {
          console.log(result, "message");
          setFeedbackMessage(result.Message);
          setLoading(false);
          // navigation.navigate('CollegeNotice');
          isSaving(false);
          setSubmitState(true);
          wait(500).then(() => {
            setfeedbackModalVisible(false);
            setBottomSheetData({ hideSheet: false });
            navigation.goBack();
          });
          //goBack();
        })
        .catch((result) => {
          console.log(result, "message");
          setFeedbackMessage(result.Message);
          setLoading(false);
          isSaving(false);
          setSubmitState(false);
          wait(1000).then(() => {
            setfeedbackModalVisible(false);
          });
        });
    }
  };
  const confirmSubmit = () => {
    Alert.alert("Hold on!", "Are you sure you want to submit ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "Ok", onPress: () => confirmAdd() },
    ]);
    return true;
  };
  const marginDescribe = description?.length >= 100;
  return (
    <Provider>
      <FeedbackModal
        visible={feedbackModalVisible}
        loading={saving}
        state={submitState}
        message={feedbackMessage}
      />
      <SafeAreaView style={styles.container}>
        <Header />
        <Advertisement />

        <TouchableOpacity
          onPress={goBack}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        >
          <View style={styles.pageHeader}>
            <Icons name="arrow-left" size={16} color={Constants.WHITE_COLOR} />
            <Text style={styles.pageHeaderText}>New NoticeBoard</Text>
          </View>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.mainView}>
          <Text style={styles.title}>Title</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setTitle}
            maxLength={titleMaxLength}
            placeholder="Enter the title"
            value={title}
            fontSize={Constants.FONT_BADGE}
            fontFamily={FONT.primaryRegular}
          />

          <Text style={styles.title}>Description</Text>
          {/* <View style={styles.descriptionView}> */}
          <ScrollView style={styles.descriptionScroll}>
            <TextArea
              onChangeText={setDescription}
              value={description}
              numberOfLines={4}
              count={description ? description.length : "0"}
              style={[
                styles.discriptionHeight,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  bottom: marginDescribe ? 0 : 30,
                },
              ]}
            />
          </ScrollView>
          {/* </View> */}
          <InitialCategory
            onSubject={(subjectType) =>{setSubjectType(subjectType)}}

            visible={modalVisible}
            onCancel={toggleAddRecipentModal}
            goBack={goBack}
            onSelect={(x) => {
              if (x === "entire_college" && x === "entire_college") {
                setReceiverList(collegeId);
                setReceiverTypeId("1");
                setReceiverKind("Entire College");
              } else if (x === "EntireDepartment") {
                setReceiverList(departmentId);
                setReceiverTypeId("3");
                setReceiverKind("Entire Department");
              }
              setSpecificViewReview(false);
              toggleAddRecipentModal();
            }}
            onSubmit={(x) => {
              console.log(
                x.selectedCATEGORY === "entireDivision",
                x.selectedCATEGORY
              );
              if (
                Array.isArray(x.division_id) &&
                x.selectedCATEGORY === "entireDivision"
              ) {
                setReceiverList(x.division_id);
                setReceiverTypeId("8");
                setReceiverKind("Entire Division");
              } else if (
                Array.isArray(x.division_id) &&
                x.selectedCATEGORY === "specificDivision"
              ) {
                setReceiverList(x.division_id);
                setReceiverTypeId("8");
                setReceiverKind("Specific Division");
              } else if (
                Array.isArray(x.department_id) &&
                x.selectedCATEGORY === "EntireDeparment"
              ) {
                setReceiverList(x.department_id);
                setReceiverTypeId("3");
                setReceiverKind("Entire Department");
              } else if (
                Array.isArray(x.department_id) &&
                x.selectedCATEGORY === "SpecificDeparment"
              ) {
                setReceiverList(x.department_id);
                setReceiverTypeId("3");
                setReceiverKind("Specific Department");
              } else if (
                Array.isArray(x.course_id) &&
                x.selectedCATEGORY === "EntireCourse"
              ) {
                setReceiverList(x.course_id);
                setReceiverTypeId("2");
                setReceiverKind("Entire Course");
              } else if (
                Array.isArray(x.course_id) &&
                x.selectedCATEGORY === "SpecificCourse"
              ) {
                setReceiverList(x.course_id);
                setReceiverTypeId("2");
                setReceiverKind("Specific Course");
              } else if (
                Array.isArray(x.sectionid) &&
                x.selectedCATEGORY === "EntireSections"
              ) {
                setReceiverList(x.sectionid);
                setReceiverTypeId("5");
                setReceiverKind("Entire Section");
              } else if (
                Array.isArray(x.sectionid) &&
                x.selectedCATEGORY === "SpecificSections"
              ) {
                setReceiverList(x.sectionid);
                setReceiverTypeId("5");
                setReceiverKind("Specific Section");
              } else if (
                Array.isArray(x.studentid) &&
                x.selectedCATEGORY === "EntireStudents"
              ) {
                setReceiverList(x.studentid);
                setReceiverTypeId("7");
                setReceiverKind("Entire Students");
              } else if (
                Array.isArray(x.studentid) &&
                x.selectedCATEGORY === "SpecificStudents"
              ) {
                setReceiverList(x.studentid);
                setReceiverTypeId("7");
                setReceiverKind("Specific Students");
              } else if (
                Array.isArray(x.groupid) &&
                x.selectedCATEGORY === "entireGroup"
              ) {
                setReceiverList(x.groupid);
                setReceiverTypeId("6");
                setReceiverKind("Entire Group");
                setStaffType(x.stafftypes)
              } else if (
                Array.isArray(x.groupid) &&
                x.selectedCATEGORY === "specificGroup"
              ) {
                setReceiverList(x.groupid);
                setReceiverTypeId("6");
                setReceiverKind("Specific Group");
                setStaffType(x.stafftypes)
              }
              setSpecificViewReview(false);
              toggleAddRecipentModal();
            }}
            collegeId={collegeId}
            memberid={memberid}
            priority={priority}
            departmentId={departmentId}
            Divisionid={division_id}
          />

          <ChooseRecipient
            visible={modalVisibleForHOD}
            onCancel={toggleRecipentModalForHOD}
            onSelect={(x) => {
              if (x === "myDepartment") {
                console.log(x);
                toggleAddRecipentModal();
              } else if (x === "otherDepartment") {
                console.log(x);
                showSubjectsModal();
              }
              toggleRecipentModalForHOD();
            }}
          />
          <StaffCardForSection
            visible={modalVisibleForSpecific}
            collegeid={collegeId}
            data={subjectYearData}
            studentList={studentList}
            currentItem={currenItem}
            studentListVisiable={studentListVisiable}
            onClose={
              (hideSubjectsModal,
              (item, isEntire, selectStudents = []) => {
                console.log("testlog", item);
                console.log("testEntire", isEntire);
                console.log("selectstudents", selectStudents);
                hideSubjectsModal();
                // setCurrentItem(item);
                // setStudnetListVisiable(false);
                // setStudentList(isEntire ? null : selectStudents);
                // setReceiverTypeId(isEntire ? 5 : 7);
                // setReceiverKind(
                //   isEntire ? "Entire Section" : "Specific Section"
                // );
                // setReceiverList(isEntire ? [item.sectionid] : selectStudents);
                // setSpecificViewReview(false);
              })
            }
            onSelect={(item, isEntire, selectStudents = [],subject_type) => {
              console.log(item, isEntire, selectStudents);
              hideSubjectsModal();
              setCurrentItem(item);
              setStudnetListVisiable(false);
              setStudentList(isEntire ? null : selectStudents);
              setReceiverTypeId(isEntire ? 5 : 7);
              setReceiverKind(isEntire ? "Entire Section" : "Specific Students");
             // setReceiverList(isEntire ? [item.sectionid] : selectStudents);
              setReceiverList(selectStudents);

              setSpecificViewReview(false);
              setSubjectType(subject_type)

            }}
          />
          {editCheck !== "edit" ? (
            <>
              <View style={{ padding: 5 }}>
                <Text
                  style={{
                    fontFamily: FONT.primaryMedium,
                    fontSize: Constants.FONT_BADGE,
                  }}
                >
                  Recipients
                </Text>
              </View>

              {priority === "p1" ? (
                <Pill
                  text={receiverKind ? receiverKind : "+ Add Recipients"}
                  onPress={() => {
                    toggleAddRecipentModal();
                    setReceiverKind("");
                    setReceiverTypeId("");
                  }}
                  containerStyle={styles.addRecipientPill}
                  textStyle={styles.addRecipientText}
                />
              ) : priority === "p2" ? (
                <Pill
                  text={receiverKind ? receiverKind : "+ Add Recipients"}
                  onPress={() => {
                    toggleRecipentModalForHOD();
                    setReceiverKind("");
                    setReceiverTypeId("");
                  }}
                  containerStyle={styles.addRecipientPill}
                  textStyle={styles.addRecipientText}
                />
              ) : (
                <TouchableOpacity onPress={showSubjectsModal}>
                  <View
                    style={{
                      borderColor: "#C9C9C9",
                      borderWidth: 1,
                      borderRadius: 42,
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                      flexDirection: "row",
                      marginTop: 10,
                      alignItems: "center",
                    }}
                  >
                    <Icon name={"add"} size={18} />
                    <Text
                      style={{
                        marginLeft: 3,
                        fontSize: Constants.FONT_BADGE,
                      }}
                    >
                      Add Recipient
                    </Text>

                    {receiverTypeId !== "" && (
                      <Text
                        style={{
                          marginLeft: 3,
                          fontSize: Constants.FONT_FULL_MED,
                          color: "#18984B",
                        }}
                      >{`- ${
                        receiverTypeId === 5 ? "Entire Section" : "Specific"
                      }`}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              {receiverTypeId === 7 && specificViewReview && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setStudnetListVisiable(true);
                      showSubjectsModal(true);
                    }}
                  >
                    <View
                      style={{
                        marginTop: 15,
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: Constants.FONT_BADGE,
                          borderBottomWidth: 1,
                          borderBottomColor: "#18984B",
                          color: "#18984B",
                          alignSelf: "flex-end",
                        }}
                      >
                        Click here to view Added Recipients
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.targetContainer}>
                    <Text style={[styles.title, { marginBottom: 6 }]}>
                      Target
                    </Text>

                    <Checkbox
                      options={TAREGTS_VALUE}
                      onPress={onSelectTaget}
                      selectedOptions={targets}
                    />
                  </View>
                </>
              )}
              {receiverKind && !specificViewReview ? (
                <>
                  <AddRecipientModal
                    selectedName={
                      receiverKind ? receiverKind : "Add Recipients"
                    }
                    onAddRecepient={toggleAddRecipentModal}
                  />
                  <View style={styles.targetContainer}>
                    <Text style={[styles.title, { marginBottom: 6 }]}>
                      Target
                    </Text>
                    {priority === "p1" || priority === "p2" ? (
                      <Checkbox
                        options={
                          receiverKind === "Entire College" ||
                          receiverKind === "Division" ||
                          receiverKind === "Group" && staffTypes.includes('staff') ||
                          // receiverKind === "Specific Section" ||
                          // receiverKind === "Entire Course" ||
                          receiverKind === "Entire Department" ||
                          // receiverKind === "Specific Course" ||
                          receiverKind === "Specific Department"
                            ? TAREGTS
                            : TAREGTS_VALUE
                        }
                        onPress={onSelectTaget}
                        selectedOptions={targets}
                      />
                    ) : (
                      <Checkbox
                        options={TAREGTS_VALUE}
                        onPress={onSelectTaget}
                        selectedOptions={targets}
                      />
                    )}
                  </View>
                </>
              ) : null}
              {/* <TouchableOpacity activeOpacity={TOUCHABLE_ACTIVE_OPACITY}>
            <Text style={styles.viewReceipent}>
              Click here to view added receipents
            </Text>
          </TouchableOpacity> */}
            </>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            onPress={() => {
              backAction();
            }}
            style={[
              styles.actionButton,
              { backgroundColor: Constants.GREY004 },
            ]}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Button>
          <Button
            style={[
              styles.actionButton,
              { backgroundColor: Constants.GREEN002 },
            ]}
            onPress={confirmSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Uploading.." : "Confirm"}
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </Provider>
  );
};
const mapStatetoProps = ({ app }) => ({
  collegeId: app?.maindata?.colgid,
  priority: app?.maindata?.priority,
  memberid: app?.maindata?.memberid,
  courseid: app?.maindata?.courseid, //courseid
  departmentId: app?.maindata?.deptid,
  isParentEnable: app?.maindata?.is_parent_target_enabled,
});

export default connect(mapStatetoProps, { addNoticeApi, setBottomSheetData })(
  AddNotice
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.BRIGHT_COLOR,
  },
  row: {
    flexDirection: "row",
    marginTop: "10%",
    justifyContent: "space-between",
  },
  pageHeader: {
    backgroundColor: Constants.DARK_COLOR,
    height: 60,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: "5%",
  },
  descriptionView: {
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    height: 130,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  discriptionHeight: {
    justifyContent: "flex-start",
  },
  pageHeaderText: {
    color: Constants.WHITE_COLOR,
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    paddingLeft: 10,
  },
  mainView: {
    paddingHorizontal: "5%",
    paddingTop: "5%",
    // height: 400,
  },
  buttonText: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_THIRTEEN,
    color: Constants.WHITE_COLOR,
  },
  title: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
  },
  textNormal: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_BADGE,
    lineHeight: 17,
    color: Constants.DARK_COLOR,
  },
  descriptionScroll: {
    height: 130,
  },
  inputStyle: {
    height: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.GREY004,
    marginBottom: 12,
  },
  addRecipientPill: {
    borderWidth: 1,
    borderColor: Constants.GREY004,
    height: 36,
    marginTop: 10,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  addRecipientText: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_BADGE,
  },
  viewReceipent: {
    marginTop: 10,
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_BADGE,
    alignSelf: "flex-end",
    textDecorationLine: "underline",
    color: Constants.GREEN002,
  },
  actionButton: {
    height: 40,
    width: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    paddingBottom: 20,
  },
  targetContainer: {
    marginTop: "8%",
  },
});
