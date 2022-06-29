/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Provider } from "react-native-paper";
import FeedbackModal from "../../../components/Modal/Feedback";
import { Constants, FONT } from "../../../constants/constants";
import { connect } from "react-redux";
import { setBottomSheetData } from "../../../redux/actions/setBottomSheetData";
import { TextArea } from "../../../components/TextArea/TextArea";
import { AddDataLayout } from "../../../components/AddDataLayout/AddDataLayout";
import { Checkbox } from "../../../components/Checkbox/Checkbox";
import { addTextCommunication } from "../../../redux/actions/addTextCommunication";
import { Pill } from "../../../components/Pill/Pill";
import { AddRecipientModal } from "../../../components/AddRecipientModal";
import ChooseRecipient from "../../../components/Modal/chooseReceipentTypeForHOD";

import StaffCardForSection from "../../../components/Modal/StaffCardForSections";

import AppConfig from "../../../redux/app-config";
import triggerSimpleAjax from "../../../context/Helper/httpHelper";
import Icon from "react-native-vector-icons/MaterialIcons";
import InitialCategory from "../../../components/AddReceipients/InitialCategory";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const AddMessage = ({
  navigation,
  collegeId,
  memberid,
  priority,
  deptid,
  division_id,
  departmentId,
  setBottomSheetData,
  isParentEnable,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targets, setTargets] = useState([]);
  const [uploading, setUploading] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const toggleAddRecipentModal = () =>
    setModalVisible((prevState) => !prevState);
  const [receiverList, setReceiverList] = useState([]);
  const [receiverTypeId, setReceiverTypeId] = useState("");
  const [receiverKind, setReceiverKind] = useState("");
  const [saving, isSaving] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const [feedbackModalVisible, setfeedbackModalVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [modalVisibleForHOD, setModalVisibleForHOD] = useState(false);
  const toggleRecipentModalForHOD = () =>
    setModalVisibleForHOD((prevState) => !prevState);

  const goBack = () => {
    navigation.goBack();
  };

  const [studentList, setStudentList] = useState(null);
  const [studentListVisiable, setStudnetListVisiable] = useState(false);
  const [currenItem, setCurrentItem] = useState(null);
  const [subjectYearData, setSubjectYearData] = useState([]);
  const showSubjectsModal = () => setModalVisibleForSpecific(true);
  const hideSubjectsModal = () => setModalVisibleForSpecific(false);
  const [modalVisibleForSpecific, setModalVisibleForSpecific] = useState(false);
  const [specificViewReview, setSpecificViewReview] = useState(false);

  const [subjectType, setSubjectType] = useState('Subject');


  useEffect(() => {
    //console.log("Subkect_type_add",subjectType)
    //getSubjectList();
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
  console.log("DEPARTMENTIDI", departmentId);
  console.log("isParentEnable", isParentEnable);


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
        // receiverKind === "Entire Department" ||
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
  const getSubjectList = () => {
    const request = {
      staffid: memberid,
      collegeid: collegeId,
    };
    console.log("com_request",request)

    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_SUBJECT_LIST}`,
      "POST",
      false,
      request,
      (result) => {
        const { Status,Message, data } = result;
        console.log("com_response",result)
        if (Status === 1) {
          setSubjectYearData(data);
        }
        else{
          Alert.alert(Message)
        }
      },
      (result) => {}
    );
  };

  const onSelectTaget = (option) => {
    let valueIndex = -1;
    targets.some((target, index) => {
      if (target.value === option.value) {
        valueIndex = index;
        return true;
      }
    });
    const titleMaxLength = 100;

    if (valueIndex > -1) {
      targets.splice(valueIndex, 1);
    } else {
      targets.push(option);
    }
    setTargets([...targets]);
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
      Alert.alert("Select the receiver type");
      return false;
    } else if (targets?.length === 0 || targets?.length === undefined) {
      Alert.alert("Please select the target type");
      return false;
    }
    return true;
  };

  const confirmSubmit = () => {
    Alert.alert("Hold on!", "Are you sure you want to submit ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
       { text: "Ok", onPress: () => onConfirm() },

    ]);
    return true;
  };

  const onConfirm = () => {
    const receiverCheckArray = Array.isArray(receiverList)
      ? receiverList[0]
      : receiverList;
    if (validate()) {
      setUploading(true);
      setfeedbackModalVisible(true);
      isSaving(true);
      const request = {
        description: title,
        messagecontent: description,
        collegeid: collegeId,
        staffid: memberid,
        callertype: priority,
        isstudent: targets.some(
          (target) => target.value === ENTIRETAREGTS[0].value
        ),
        isparent: targets.some(
          (target) => target.value === ENTIRETAREGTS[1].value
        ),
        isstaff: targets.some(
          (target) => target.value === ENTIRETAREGTS[2].value
        ),
        receivertype: receiverTypeId,
        receiverid:
          typeof receiverList !== "string" && typeof receiverList !== "number"
            ? receiverList.join("~")
            : receiverCheckArray,
      };

      console.log('TextRequest',request)
      addTextCommunication({
        request,
        isEntireCollege: receiverTypeId === "1",
        subjectType: subjectType,
        
      })
        .then((result) => {
          console.log(result, "message");
          setFeedbackMessage(result.Message);
          setUploading(false);
          isSaving(false);
          setSubmitState(true);
          wait(500).then(() => {
            setfeedbackModalVisible(false);
            setBottomSheetData({ hideSheet: false });
            navigation.goBack();
          });
        })
        .catch((result) => {
          setFeedbackMessage(result.Message);
          setUploading(false);
          isSaving(false);
          setSubmitState(false);
          wait(1000).then(() => {
            setfeedbackModalVisible(false);
          });
        });
    }
  };

  useEffect(() => {
    return () => setBottomSheetData({ hideSheet: false });
  }, []);
  const marginDescribe = description?.length >= 100;
  return (
    <Provider>
      <FeedbackModal
        visible={feedbackModalVisible}
        loading={saving}
        state={submitState}
        message={feedbackMessage}
      />
      <AddDataLayout
        title="New message"
        goBack={goBack}
        onConfirm={confirmSubmit}
        uploading={uploading}
        rightButtonDisabled={!title && !description}
      >
        <ScrollView contentContainerStyle={styles.mainView}>
          <Text style={styles.title}>Title *</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setTitle}
            maxLength={100}
            placeholder="Enter the title"
            fontSize={Constants.FONT_BADGE}
            fontFamily={FONT.primaryRegular}
            color={Constants.BLACK000}
          />

          <Text style={styles.textNormal}>Description *</Text>
          <ScrollView style={styles.descriptionScroll}>
            <TextArea
              style={[
                styles.discriptionHeight,
               
                {
                  bottom: marginDescribe ? 0 : 30,
                },
              ]}
              onChangeText={setDescription}
              numberOfLines={1}
              count={description?.length}
              color={Constants.BLACK000}
              // containerStyle={{marginBottom: '5%'}}
            />
          </ScrollView>
          <InitialCategory
            onSubject={(x) =>{setSubjectType(x)}}

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
                setReceiverKind("Division");
              } else if (
                Array.isArray(x.division_id) &&
                x.selectedCATEGORY === "specificDivision"
              ) {
                setReceiverList(x.division_id);
                setReceiverTypeId("8");
                setReceiverKind("Division");
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
                setReceiverKind("Group");
              } else if (
                Array.isArray(x.groupid) &&
                x.selectedCATEGORY === "specificGroup"
              ) {
                setReceiverList(x.groupid);
                setReceiverTypeId("6");
                setReceiverKind("Group");
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
                console.log('testlog',item);
                console.log('testEntire', isEntire);
                console.log('selectstudents', selectStudents);
                hideSubjectsModal();
               
              })
            }

            onSelect={(item, isEntire, selectStudents = [],subject_type) => {
              console.log('OnSelectItem', isEntire, selectStudents);
              hideSubjectsModal();
              setCurrentItem(item);
              setStudnetListVisiable(false);
              setStudentList(isEntire ? null : selectStudents);
              setReceiverTypeId(isEntire ? 5 : 7);
              setReceiverKind(
                isEntire ? 'Entire Section' : 'Specific Students',
              );
             // setReceiverList(isEntire ? [item.sectionid] : selectStudents);
              setReceiverList(selectStudents);

              setSpecificViewReview(isEntire ? false : true);

              setSubjectType(subject_type)
            }}
           
          />


          <View style={{ padding: 5}}>
            <Text
              style={{
                fontFamily: FONT.primaryMedium,
                fontSize: Constants.FONT_FULL_LOW,
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
                <Text style={[styles.title, { marginBottom: 6 }]}>Target</Text>

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
                selectedName={receiverKind ? receiverKind : "Add Recipients"}
                onAddRecepient={toggleAddRecipentModal}
              />
              <View style={styles.targetContainer}>
                <Text style={[styles.title, { marginBottom: 6 }]}>Target</Text>
                {priority === "p1" || priority === "p2" ? (
                  <Checkbox
                    options={
                      receiverKind === "Entire College" ||
                      receiverKind === "Division" ||
                      // receiverKind === "Group" ||
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
        </ScrollView>
      </AddDataLayout>
    </Provider>
  );
};

const mapStatetoProps = ({ app }) => ({
  collegeId: app?.maindata?.colgid,
  priority: app?.maindata?.priority,
  memberid: app?.maindata?.memberid,
  courseid: app?.maindata?.courseid,
  departmentId: app?.maindata?.deptid,
  isParentEnable: app?.maindata?.is_parent_target_enabled,
});

export default connect(mapStatetoProps, { setBottomSheetData })(AddMessage);

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

  descriptionScroll: {
    height: 130,
  
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  mainView: {
    paddingHorizontal: "5%",
    paddingTop: "5%",
    // height: 400,
  },
  title: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_LOW,
    color: Constants.DARK_COLOR,
  },
  textNormal: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_BADGE,
    lineHeight: 17,
    color: Constants.DARK_COLOR,
  },
  discriptionHeight: {
    justifyContent: "flex-start",
  },
  inputContainer: {
    borderWidth: 0.5,
    borderColor: Constants.GREY004,
  },
  inputStyle: {
    height: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.GREY004,
    marginBottom: 12,
  },
  targetContainer: {
    marginTop: "8%",
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
});
