/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useCallback } from "react";
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
import { addCircularApi } from "../../../redux/actions/numberAction";
import { connect } from "react-redux";
import { setBottomSheetData } from "../../../redux/actions/setBottomSheetData";
import { TextArea } from "../../../components/TextArea/TextArea";
import { fileSelect } from "../../DashboardHome/util/fileManager";
import {
  addCircular,
  deleteCircular,
} from "../../../redux/actions/addCircular";
import { ProgressBar, Colors } from "react-native-paper";
import AwsAmplify from "../../../utils/awsAmplify/index";
import { Checkbox } from "../../../components/Checkbox/Checkbox";
import { Provider } from "react-native-paper";
import AddRecipients from "../../../components/Modal/AddRecipients";
import { Pill } from "../../../components/Pill/Pill";
import { AddRecipientModal } from "../../../components/AddRecipientModal";
import FeedbackModal from "../../../components/Modal/Feedback";
import ImageModalSheet from "../../../components/ModalSheet/ModalSheet";
import PickerOptionModal from "../../../components/PickerOptionsModal/PickerOptionModal";
import ChooseRecipient from "../../../components/Modal/chooseReceipentTypeForHOD";
import StaffCardForSection from "../../../components/Modal/StaffCardForSections";
import AppConfig from "../../../redux/app-config";
import triggerSimpleAjax from "../../../context/Helper/httpHelper";
import Icon from "react-native-vector-icons/MaterialIcons";
import InitialCategory from "../../../components/AddReceipients/InitialCategory";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const AddCircular = ({
  route,
  navigation,
  collegeId,
  isParentEnable,
  memberid,
  priority,
  versionInfo,
  division_id,
  departmentId,
  setBottomSheetData,
}) => {
  const [singleFile, setSingleFile] = useState(null);
  const [title, setTitle] = useState(route?.params?.title);
  const [description, setDescription] = useState(route?.params?.describe);
  const [fileUploading, setFileUploading] = useState(false);
  const [totalFilesToBeUploaded, setTotalFilesToBeUploaded] = useState(0);
  const [noOffilesUploaded, setNoOfFilesUploaded] = useState(0);
  const [isUploadProgressBarVisible, setIsUploadProgressBarVisible] =
    useState(false);
  const [filesUploaded, setFilesUploaded] = useState([]);
  const [targets, setTargets] = useState([]);
  const [saving, isSaving] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const [feedbackModalVisible, setfeedbackModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const toggleAddRecipentModal = () =>
    setModalVisible((prevState) => !prevState);
  const [receiverList, setReceiverList] = useState([]);
  const [receiverTypeId, setReceiverTypeId] = useState("");
  const [receiverKind, setReceiverKind] = useState("");

  const [receiverSelected, setReceiverSelected] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isBottomModalVisible, setIsBottomModalVisible] = useState(false);

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
  const [submitClose, setSubmitClose] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    getSubjectList();
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
  const ENTIRETAREGTS = [
    { label: "Students", value: "isStudent" },
    { label: "Parents", value: "isParent" },
    { label: "Staff", value: "isStaff" },
  ];
  const [TAREGTS, setTargetsValueInitial] = useState([]);
  const [TAREGTS_VALUE, setTargetsValue] = useState([]);

  useEffect(() => {
    console.log(isParentEnable, "jigaiugiubiug");
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
  };

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
      { text: "Ok", onPress: () => goBack() },
    ]);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  const handleUploadFiles = useCallback(
    (receiverTypeId, receiverList, targets) => {
      console.log(receiverTypeId, targets, receiverList, targets);
      console.log(
        "jhhhjjjjjuho",
        receiverKind,
        "hiae",
        receiverTypeId,
        "jjj",
        receiverList,
        "kkkkk",
        targets
      );
      return new Promise((resolve, reject) => {
        // setSubmitClose(true);
        setIsUploadProgressBarVisible(true);
        setTotalFilesToBeUploaded(selectedFiles.length);
        const awsAmplify = new AwsAmplify(collegeId, "circular");
        let promisesArray = [];
        for (let i = 0; i < selectedFiles.length; i++) {
          const aPromise = new Promise((resolve, reject) => {
            awsAmplify
              .uploadFileToAwsS3(
                selectedFiles[i].name || selectedFiles[i].fileName,
                selectedFiles[i]
              )
              .then((url) => {
                setIsUploadProgressBarVisible(false);
                setNoOfFilesUploaded((prevState) => prevState + 1);
                var tempFilesUploaded = filesUploaded;
                tempFilesUploaded.push({
                  FileName: url,
                  type: selectedFiles[i].type,
                });
                setFilesUploaded(tempFilesUploaded);
                resolve(true);
              })
              .catch(() => {
                reject(false);
                Alert.alert("Upload not done");
              });
          });
          promisesArray.push(aPromise);
        }

        Promise.all(promisesArray)
          .then((promises) => {
            resolve(true);

            onConfirm(receiverTypeId, receiverList, targets);
          })
          .catch(() => reject(false));
      });
    },
    [
      selectedFiles,
      filesUploaded,
      setFilesUploaded,
      setIsUploadProgressBarVisible,
      setTotalFilesToBeUploaded,
      setNoOfFilesUploaded,
    ]
  );
  const validateFeilds = () => {
    if (validate()) {
      // console.log(
      //   receiverKind,
      //   'hiae',
      //   receiverTypeId,
      //   'jjj',
      //   receiverList,
      //   'kkkkk',
      //   targets,
      // );
      setFileUploading(true);
      handleUploadFiles(receiverTypeId, receiverList, targets);
    }
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
      describeLength === 0
    ) {
      Alert.alert("Description should not be empty");
      return false;
    } else if (
      // selectedFiles[0]?.name === '' ||
      // selectedFiles[0]?.name === undefined ||
      // selectedFiles[0]?.name === null ||
      // selectedFiles[0]?.fileName === undefined ||
      // selectedFiles[0]?.fileName === '' ||
      // selectedFiles[0]?.fileName === null ||
      selectedFiles[0] === null ||
      selectedFiles[0] === "" ||
      selectedFiles[0] === undefined
    ) {
      Alert.alert("Select a file to upload");
      return false;
    } else if (
      receiverTypeId === "" ||
      receiverTypeId === undefined ||
      receiverTypeId === null
    ) {
      Alert.alert("Select the receiver type");
      return false;
    } else if (targets?.length === 0 || targets?.length === undefined) {
      Alert.alert("Please select the target type");
      return false;
    }
    return true;
  };
  const checkConfirm = () => {
    if (route?.params?.edit === "delete") {
      onDelete();
    } else {
      confirmSubmit();
    }
  };
  const onDelete = () => {
    deleteCircular({
      headerid: route?.params?.id,
      userid: memberid,
      collegeid: collegeId,
    }).then(() => {
      setFileUploading(false);
      goBack();
    });
  };

  const confirmSubmit = () => {
    Alert.alert("Hold on!", "Are you sure you want to submit ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "Ok", onPress: validateFeilds },
    ]);
    return true;
  };
  const validateUrl = () => {
    console.log("files are uploaded", filesUploaded[0]);
    if (
      filesUploaded[0]?.FileName === "" ||
      filesUploaded[0]?.FileName === undefined ||
      filesUploaded[0]?.FileName === null
    ) {
      Alert.alert("Files are not uploaded!, Please try again.");
      return false;
    }
    return true;
  };
  const onConfirm = (receiverTypeId, receiverList, targets) => {
    // console.log(
    //   receiverKind,
    //   'hiae',
    //   receiverTypeId,
    //   'jjj',
    //   receiverList,
    //   'kkkkk',
    //   targets,
    // );
    const receiverCheckArray = Array.isArray(receiverList)
      ? receiverList[0]
      : receiverList;
    const FileUrlAlone = [];
    for (let i = 0; i < filesUploaded.length; i++) {
      FileUrlAlone.push({ FileName: filesUploaded[i].FileName });
    }
    setFileUploading(true);
    setfeedbackModalVisible(true);
    isSaving(true);
    var fileType = "0";
    switch (filesUploaded[0].type) {
      case "application/pdf": {
        fileType = "3";
        break;
      }
      default: {
        fileType = "2";
        break;
      }
    }
    const request = {
      collegeid: collegeId,
      Staffid: memberid,
      callertype: priority,
      filetype: fileType,
      fileduration: "0",
      isstudent: targets.some(
        (target) => target.value === ENTIRETAREGTS[0].value
      ),
      isparent: targets.some(
        (target) => target.value === ENTIRETAREGTS[1].value
      ),
      isstaff: targets.some(
        (target) => target.value === ENTIRETAREGTS[2].value
      ),
      title: title,
      Description: description,
      receivertype: receiverTypeId,
      receiverid:
        typeof receiverList !== "string" && typeof receiverList !== "number"
          ? receiverList.join("~")
          : receiverCheckArray,
      FileNameArray: FileUrlAlone,
    };
    addCircular({
      request,
      isEntireCollege: receiverTypeId === "1",
    })
      .then((result) => {
        console.log(result, "message");
        setFeedbackMessage(result.Message);
        setFileUploading(false);
        isSaving(false);
        setSubmitState(true);
        wait(500).then(() => {
          setfeedbackModalVisible(false);
          setBottomSheetData({ hideSheet: false });
          navigation.goBack();
        });
      })
      .catch((result) => {
        console.log(result, "message");
        setFeedbackMessage(result.Message);
        setFileUploading(false);
        isSaving(false);
        setSubmitState(false);
        wait(1000).then(() => {
          setfeedbackModalVisible(false);
        });
      });
  };
  const checkLengthOfSelectedFiles = () => {
    const maxCountImg = Number(versionInfo.imagecount) + 1;
    const maxExceedLengthImg =
      selectedFiles?.length - Number(versionInfo.imagecount);
    const maxCountPdf = Number(versionInfo.pdfcount) + 1;
    console.log(maxCountPdf);
    const maxExceedLengthPdf =
      selectedFiles?.length - Number(versionInfo.pdfcount);
    if (selectedFiles[0]?.type.includes("image")) {
      if (selectedFiles?.length < maxCountImg) {
        setIsModalVisible(!isModalVisible);
      } else {
        Alert.alert(
          "Limit Exceeded ! Reduce " + maxExceedLengthImg + " count",
          "Maximium upload count is " + Number(versionInfo.imagecount),
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]
        );
      }
    } else if (selectedFiles[0]?.type.includes("pdf")) {
      if (selectedFiles?.length < maxCountPdf) {
        setIsModalVisible(!isModalVisible);
      } else {
        Alert.alert(
          "Limit Exceeded ! Reduce " + maxExceedLengthPdf + " count",
          "Maximium upload count is " + Number(versionInfo.pdfcount),
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]
        );
      }
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
      <SafeAreaView style={styles.container}>
        <Header />
        <Advertisement />

        <TouchableOpacity
          onPress={goBack}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        >
          <View style={styles.pageHeader}>
            <Icons name="arrow-left" size={16} color={Constants.WHITE_COLOR} />
            <Text style={styles.pageHeaderText}>New Circular</Text>
          </View>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.mainView}>
          <Text style={styles.title}>Title</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setTitle}
            maxLength={titleMaxLength}
            value={title}
            placeholder="Enter the title"
            fontSize={Constants.FONT_BADGE}
            fontFamily={FONT.primaryRegular}
          />

          <Text style={styles.title}>Description</Text>
          <ScrollView style={styles.discriptionScroll}>
            <TextArea
              onChangeText={setDescription}
              numberOfLines={4}
              count={description?.length}
              value={description}
              style={[
                styles.discriptionHeight,
                {
                  bottom: marginDescribe ? 0 : 30,
                },
              ]}
            />
          </ScrollView>
          <TouchableOpacity
            style={styles.upload}
            onPress={() => {
              !fileUploading &&
                (setIsBottomModalVisible(true), setSelectedFiles([]));
            }}
            activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
          >
            <View style={styles.center}>
              <Icons
                name={ICON.CLOUD_UPLOAD}
                size={24}
                color={Constants.BUTTON_SELECTED_COLOR}
              />
            </View>
            <View style={{ flex: 4 }}>
              {selectedFiles?.length ? (
                <>
                  <Text style={styles.uploadTitle}>Uploaded your files</Text>
                  <Text style={styles.uploadSubText} numberOfLines={1}>
                    Number of files selected : {selectedFiles?.length}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.uploadTitle}>Upload your files</Text>
                  {/* <Text style={styles.uploadSubText}>
                    Try to upload files to see them here
                  </Text> */}
                </>
              )}
            </View>
          </TouchableOpacity>
          {totalFilesToBeUploaded > 0 && (
            <>
              {isUploadProgressBarVisible && (
                <ProgressBar indeterminate color={Colors.red800} />
              )}
              <View style={styles.fileuploadInfoWrapper}>
                <Text>Uploaded Files </Text>
                <Text>{`${noOffilesUploaded} / ${totalFilesToBeUploaded}`}</Text>
              </View>
            </>
          )}
          <InitialCategory
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
            onSelect={(item, isEntire, selectStudents = []) => {
              console.log(item, isEntire, selectStudents);
              hideSubjectsModal();
              setCurrentItem(item);
              setStudnetListVisiable(false);
              setStudentList(isEntire ? null : selectStudents);
              setReceiverTypeId(isEntire ? 5 : 7);
              setReceiverKind(isEntire ? "Entire Section" : "Specific Section");
              setReceiverList(isEntire ? [item.sectionid] : selectStudents);
              setSpecificViewReview(false);
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
        {!submitClose && (
          <View style={styles.footer}>
            <Button
              style={[
                styles.actionButton,
                { backgroundColor: Constants.GREY004 },
              ]}
              onPress={() => {
                backAction();
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Button>
            <Button
              style={[
                styles.actionButton,
                { backgroundColor: Constants.GREEN002 },
              ]}
              onPress={checkConfirm}
              disabled={fileUploading}
            >
              <Text style={styles.buttonText}>
                {fileUploading ? "Uploading.." : "Confirm"}
              </Text>
            </Button>
          </View>
        )}

        <PickerOptionModal
          isPDFType={
            selectedFiles.length
              ? selectedFiles[0]?.type.includes("pdf")
                ? true
                : false
              : true
          }
          isImageType={
            selectedFiles.length
              ? selectedFiles[0]?.type.includes("image")
                ? true
                : false
              : true
          }
          isBottomModalVisible={isBottomModalVisible}
          setIsBottomModalVisible={setIsBottomModalVisible}
          setIsModalVisible={setIsModalVisible}
          setSelectedFiles={setSelectedFiles}
          isMultipleFile={true}
        />

        {isModalVisible && (
          <ImageModalSheet
            isVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            files={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            handleUploadFiles={checkLengthOfSelectedFiles}
            isMultipleFile={true}
            selectedFiles={selectedFiles}
            setIsBottomModalVisible={setIsBottomModalVisible}
          />
        )}
      </SafeAreaView>
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
  versionInfo: app?.versionInfo,
});

export default connect(mapStatetoProps, { addCircularApi, setBottomSheetData })(
  AddCircular
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
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
  textNormal: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_BADGE,
    lineHeight: 17,
    color: Constants.DARK_COLOR,
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
  upload: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderRadius: 1,
    borderWidth: 1,
    borderColor: Constants.BLACK006,
    backgroundColor: Constants.GREY005,
    height: 58,
    marginVertical: 24,
    paddingVertical: 10,
  },
  uploadTitle: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    lineHeight: 15,
    color: Constants.BLACK000,
    alignSelf: "auto",
    justifyContent: "center",
  },
  uploadSubText: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_TEN,
    lineHeight: 14,
    color: Constants.GREY07B,
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
  discriptionHeight: {
    justifyContent: "flex-start",
    // height: 130,
  },
  discriptionScroll: {
    height: 130,
  },
  fileuploadInfoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: "5%",
    width: 100,
    justifyContent: "space-between",
  },
  targetContainer: {
    marginTop: "8%",
  },
  title: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_LOW,
    color: Constants.DARK_COLOR,
  },
});
