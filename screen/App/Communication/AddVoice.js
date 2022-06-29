import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import Toast from "react-native-simple-toast";
import { Provider } from "react-native-paper";
import FeedbackModal from "../../../components/Modal/Feedback";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { Checkbox } from "../../../components/Checkbox/Checkbox";
import { AddDataLayout } from "../../../components/AddDataLayout/AddDataLayout";
import { Constants, FONT, ICON } from "../../../constants/constants";
import { addVoiceCommunication } from "../../../redux/actions/addVoiceCommunication";
import { VoiceRecord } from "./Components/VoiceRecord";
import { Pill } from "../../../components/Pill/Pill";
import { AddRecipientModal } from "../../../components/AddRecipientModal";
import AudioProgress from "../../../components/AudioProgress/AudioProgress";
import { setBottomSheetData } from "../../../redux/actions/setBottomSheetData";
import ChooseRecipient from "../../../components/Modal/chooseReceipentTypeForHOD";
import StaffCardForSection from "../../../components/Modal/StaffCardForSections";
import AppConfig from "../../../redux/app-config";
import triggerSimpleAjax from "../../../context/Helper/httpHelper";
import Icon from "react-native-vector-icons/MaterialIcons";
import InitialCategory from "../../../components/AddReceipients/InitialCategory";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const AddVoice = ({
  navigation,
  collegeId,
  departmentId,
  memberid,
  priority,
  courseid,
  setBottomSheetData,
  versionInfo,
  isParentEnable,
}) => {
  const audioRecorderPlayerRef = useRef(new AudioRecorderPlayer()).current;
  const [isEnabled, setIsEnabled] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [file, setFile] = useState();
  const [title, setTitle] = useState("");
  const [isEmergencyMessage, setEmergencyMessage] = useState(0);
  const [targets, setTargets] = useState([]);
  const [showUploadScreen, setShowUploadScreen] = useState(false);
  const [uploading, setUploading] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const toggleAddRecipentModal = () =>
    setModalVisible((prevState) => !prevState);
  const [receiverList, setReceiverList] = useState([]);
  const [receiverTypeId, setReceiverTypeId] = useState("");
  const [receiverKind, setReceiverKind] = useState("");
  const [isVoiceMessagePlaying, setIsVoiceMessagePlaying] = useState(false);
  const [saving, isSaving] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackModalVisible, setfeedbackModalVisible] = useState(false);
  const [playerStoped, setPlayerStoped] = useState(false);
  const [playerUploadStoped, setPlayerUploadStoped] = useState(false);

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
  const [nextGone, setNextGone] = useState(false);

  const [subjectType, setSubjectType] = useState('Subject');


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
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

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

  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "YES",
        onPress: () => {
          goBack();
          onStopPlay();
        },
      },
    ]);
    return true;
  };

  useEffect(() => {
   // getSubjectList();
    onStopPlay();
    return async () => {
      await audioRecorderPlayerRef.stopRecorder();
      audioRecorderPlayerRef.removeRecordBackListener();
      setBottomSheetData({ hideSheet: false });
    };
  }, []);

  const [audioRecord, setAudioRecord] = useState({
    currDurationSec: 0,
    currPositionSec: 0,
    playTime: "",
    duration: "",
  });

  const goBack = () => {
    onStopPlay();

    setPlayerStoped(true);
    wait(1).then(() => {
      onStopPlay();
      navigation.goBack();

      setPlayerStoped(true);
      onStopPlay();
    });
  };

  //const toggleEmergency = () =>
  //setEmergencyMessage(prevState => (prevState ? 0 : 1));

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
  };

  const validate = () => {
    const titleLength = title?.trim();
    if (title === "" || title === undefined || titleLength.length === 0) {
      Alert.alert("Title should not be empty");
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

  const onStopPlay = async () => {
    //function to stop playing an audio
    console.log("onStopPl ay");
    //setToggleTouch(false);
    setNextGone(true);
    console.log("Audio stopped");
    audioRecorderPlayerRef.stopPlayer();
    audioRecorderPlayerRef.removePlayBackListener();
    console.log("Audio stopped111");
  };

  const confirmSubmit = () => {
    Alert.alert("Hold on!", "Are you sure you want to submit ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => {
          onConfirm();
          onStopPlay();
        },
      },
    ]);
    return true;
  };

  const onConfirm = () => {
    console.log("***********");
    onStopPlay();
    setPlayerStoped(true);
    const receiverCheckArray = Array.isArray(receiverList)
      ? receiverList[0]
      : receiverList;
    if (!showUploadScreen) {
      setShowUploadScreen(true);
      setPlayerStoped(true);
      console.log("***********........");
      return;
    } else {
      setPlayerUploadStoped(true);
      console.log("***********........showUploadScreen");
    }
    targets.some((target) => target.value === TAREGTS[0].value);
    if (validate()) {
      setUploading(true);
      setfeedbackModalVisible(true);
      isSaving(true);
      console.log(
        "req",
        receiverList,
        receiverList.length,
        typeof receiverList
      );
      const request = {
        description: title,
        collegeid: collegeId,
        staffid: memberid,
        callertype: priority,
        isemergencyvoice: isEnabled ? 1 : 0,
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
      addVoiceCommunication({
        request,
        voiceFile: file,
        fileDuration: recordTime,
        isEntireCollege: receiverTypeId === "1",
        subjectType: subjectType,
      })
        .then((result) => {
          console.log(result, result.Message, "voice");
          setFeedbackMessage(result.Message);
          setUploading(false);
          setPlayerStoped(false);
          setPlayerUploadStoped(false);
          isSaving(false);
          setSubmitState(true);
          wait(500).then(() => {
            setfeedbackModalVisible(false);
            setBottomSheetData({ hideSheet: false });
            goBack();
          });
        })
        .catch((result) => {
          setFeedbackMessage(result.Message);
          setUploading(false);
          setPlayerStoped(false);
          setPlayerUploadStoped(false);
          isSaving(false);
          setSubmitState(false);
          wait(1000).then(() => {
            setfeedbackModalVisible(false);
          });
        });
    }
  };

  const titleMaxLength = 100;
  const submitPress = () => {
    confirmSubmit();
    onStopPlay();
  };
  const nextPress = () => {
    onStopPlay();
    wait(1).then(() => {
      onConfirm();
      onStopPlay();
    });
  };

  return (
    <Provider>
      <FeedbackModal
        visible={feedbackModalVisible}
        loading={saving}
        state={submitState}
        message={feedbackMessage}
      />
      <AddDataLayout
        title="Voice Message"
        goBack={backAction}
        onConfirm={() => {
          showUploadScreen ? submitPress() : nextPress();
        }}
        rightButtonText={showUploadScreen ? "Confirm" : "Next"}
        rightButtonDisabled={
          !file ? true : showUploadScreen ? (title ? uploading : true) : false
        }
        uploading={uploading}
      >
        {!showUploadScreen ? (
          <VoiceRecord
            setFile={setFile}
            setRecordTime={setRecordTime}
            recordTime={recordTime}
            onConfirm={onConfirm}
            navigation={navigation}
            isEnabled={isEnabled}
            setIsEnabled={setIsEnabled}
            playerStoped={playerStoped}
            setPlayerStoped={setPlayerStoped}
            versionInfo={versionInfo}
          />
        ) : (
          <ScrollView>
            <View style={styles.container}>
              <AudioProgress
                isVoiceMessagePlaying={isVoiceMessagePlaying}
                setIsVoiceMessagePlaying={() =>
                  setIsVoiceMessagePlaying((prevState) => !prevState)
                }
                setAudioRecord={setAudioRecord}
                audioRecord={audioRecord}
                onStopVoice={playerUploadStoped === true ? true : false}
              />
              {/* <Checkbox
                options={[{label: 'Send as emergency', value: 'isEmergency'}]}
                selectedOptions={
                  isEmergencyMessage
                    ? [{label: 'Send as emergency', value: 'isEmergency'}]
                    : []
                }
                onPress={toggleEmergency}
              />*/}
              {!isEnabled ? (
                <Text
                  style={{
                    top: 10,
                    fontWeight: "bold",
                    fontSize: FONT.FONT_FULL_LOW,
                  }}
                >
                  Please note that this message will be delivered to App
                </Text>
              ) : null}
              <TextInput
                style={styles.inputStyle}
                onChangeText={setTitle}
                maxLength={titleMaxLength}
                placeholder="Enter Your Voice Title *"
                fontSize={Constants.FONT_THIRTEEN}
                fontFamily={FONT.primaryRegular}
                color={Constants.BLACK000}
                placeholderTextColor={Constants.GREY000}
              />
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
                  } else if (
                    Array.isArray(x.groupid) &&
                    x.selectedCATEGORY === "specificGroup"
                  ) {
                    setReceiverList(x.groupid);
                    setReceiverTypeId("6");
                    setReceiverKind("Specific Group");
                  }
                  setSpecificViewReview(false);
                  toggleAddRecipentModal();
                }}
                collegeId={collegeId}
                memberid={memberid}
                priority={priority}
                Courseid={courseid}
                departmentId={departmentId}
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
                    // setReceiverList(
                    //   isEntire ? [item.sectionid] : selectStudents
                    // );
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
                  setReceiverKind(
                    isEntire ? "Entire Section" : "Specific Students"
                  );
                 // setReceiverList(isEntire ? [item.sectionid] : selectStudents);
                  setReceiverList(selectStudents);

                  setSpecificViewReview(false);

                  setSubjectType(subject_type)

                }}
              />
              <View style={{ padding: 5 }}>
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
            </View>
          </ScrollView>
        )}
      </AddDataLayout>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    paddingHorizontal: "5%",
    backgroundColor: Constants.BRIGHT_COLOR,
  },

  icon: {
    width: 32,
    height: 32,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  fileContainer: {
    height: 55,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Constants.BRIGHT_COLOR,
    shadowColor: Constants.BLACK003,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 12,
    marginVertical: 18,
  },
  fileName: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_BADGE,
    lineHeight: 19,
    color: Constants.BLACK000,
    marginStart: 8,
  },
  inputStyle: {
    height: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.GREY004,
    marginBottom: 24,
    marginTop: "6%",
  },
  title: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_LOW,
    color: Constants.DARK_COLOR,
    marginBottom: 6,
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

const mapStatetoProps = ({ app }) => ({
  collegeId: app?.maindata?.colgid,
  priority: app?.maindata?.priority,
  memberid: app?.maindata?.memberid,
  courseid: app?.maindata?.courseid,
  departmentId: app?.maindata?.deptid,
  versionInfo: app?.versionInfo,

  isParentEnable: app?.maindata?.is_parent_target_enabled,
});

export default connect(mapStatetoProps, { setBottomSheetData })(AddVoice);
