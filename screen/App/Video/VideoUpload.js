/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  Image,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header/Header";
import Button from "../../../components/Button/button";
import Advertisement from "../../../components/Advertisement";
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from "../../../constants/constants";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
// import VimeoVideoUploader from '../../../components/VimeoVideoUploader/VimeoVideoUploader';
import { addVideo, restrictions } from "../../../redux/actions/video";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Spinner from "react-native-loading-spinner-overlay";
import { Checkbox } from "../../../components/Checkbox/Checkbox";
import { Provider } from "react-native-paper";
import AddRecipients from "../../../components/Modal/AddRecipients";
import { Pill } from "../../../components/Pill/Pill";
import { AddRecipientModal } from "../../../components/AddRecipientModal";
import FeedbackModal from "../../../components/Modal/Feedback";
import ChooseRecipient from "../../../components/Modal/chooseReceipentTypeForHOD";
import StaffCardForSection from "../../../components/Modal/StaffCardForSections";
import AppConfig from "../../../redux/app-config";
import triggerSimpleAjax from "../../../context/Helper/httpHelper";
import Icon from "react-native-vector-icons/MaterialIcons";
import DeleteSubmission from "../../../components/Modal/DeleteSubmission";
import { useDispatch } from "react-redux";
import InitialCategory from "../../../components/AddReceipients/InitialCategory";
import VideoLocalPlay from "./VideoLocalPlay";
import { TextArea } from "../../../components/TextArea/TextArea";
// import {TouchableOpacity} from 'react-native-gesture-handler';
import { launchImageLibrary } from "react-native-image-picker";

import Vimeo from "../../../components/VimeoVideoUploader/vimeoCustom";
import { setBottomSheetData } from "../../../redux/actions/setBottomSheetData";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const UselessTextInput = (props) => {
  return (
    <TextInput
      {...props} // multiline, numberOfLines below
      editable
      maxLength={500}
    />
  );
};
const VideoUploadScreen = ({
  navigation,
  collegeId,
  memberid,
  priority,
  departmentId,
  division_id,
  isParentEnable,
  rules,
  bottomSheetAction,
  visible,
  hideModal,
  onDelete,
  onCancel,
  onClose,
  versionInfo,
  //goBack = () => null,
}) => {
  const [value, onChangeText] = useState("");
  const [description, setDescription] = useState("");
  const [restrictionModal, setRestrictionModal] = useState();
  const [finalUrl, setFinalUrl] = useState("");
  const [loading, setLoading] = useState("");
  const [saving, isSaving] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackModalVisible, setfeedbackModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const toggleAddRecipentModal = () =>
    setModalVisible((prevState) => !prevState);
  const [receiverList, setReceiverList] = useState([]);
  const [receiverTypeId, setReceiverTypeId] = useState("");
  const [receiverKind, setReceiverKind] = useState("");
  const [targets, setTargets] = useState([]);
  const [submitClose, setSubmitClose] = useState(false);
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
  const [subjectType, setSubjectType] = useState('Subject');


  const [localAsset, setLocalAsset] = useState("");
  const [localPlayVideo, setLocalPlayVideo] = useState(false);
  const toggleLocalPlayVideo = () =>
    setLocalPlayVideo((prevState) => !prevState);
  const [vimeoClient, setVimeoClient] = useState(null);
  const [currentlyUploadingFilesStatus, setCurrentlyUploadingFilesStatus] =
    useState(null);
  useEffect(() => {
    //getSubjectList();
  }, []);
  const dispatch = useDispatch();
  const [showCancelModal, setShowCancelModal] = useState(false);
  // useEffect(() => {
  //   return () => dispatch(setBottomSheetData({hideSheet: false}));
  // }, []);
  const toggleModal = () => setShowCancelModal((prevState) => !prevState);

  useEffect(() => {
    startVimeoClient();
  }, []);

  const startVimeoClient = () => {
    const client = new Vimeo();
    client.generateClientCredentials("public", function () {
      setVimeoClient(client);
    });
  };

  const handleUploadButtonPress = () => {
    launchImageLibrary(
      {
        mediaType: "video",
        selectionLimit: 1,
      },
      (res) => {
        if (res.didCancel) {
          return;
        }
        const { assets } = res;
        const asset = assets[0];
        console.log(asset, "error", assets);
        setLocalAsset(asset);

        setLocalPlayVideo(true);
        // navigation.navigate('VideoLocalPlay', {video: asset});
      }
    );
  };
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

  useEffect( ()=>{
    console.log("SUB",subjectType)

  },[subjectType])

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
    bottomSheetAction({ hideSheet: false });
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

  useEffect(() => {
    setRestrictionModal(true);
  }, [memberid]);

  const confirmSubmit = () => {
    Alert.alert("Hold on!", "Are you sure you want to submit ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "OK", onPress: () => checkFileSize(localAsset) }, //confirmAdd(value, description, collegeId)
    ]);
    return true;
  };

  const checkFileSize = (localAsset) => {
    let maxSize = versionInfo.videosizelimit * 1000000;
    if (localAsset.fileSize < maxSize) {
      VimeoUrlCallBack(localAsset);
    } else {
      Alert.alert(
        "Filesize is exceeds max limit " + versionInfo.videosizelimit + " MB"
      );
    }
  };

  const validate = () => {
    const titleLength = value?.trim();
    const describeLength = description?.trim();
    if (value === "" || value === undefined || titleLength.length === 0) {
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
    } else if (
      localAsset === "" ||
      localAsset === undefined ||
      localAsset === null
    ) {
      Alert.alert("Select the file to upload");
      return false;
    } else if (targets?.length === 0 || targets?.length === undefined) {
      Alert.alert("Please select the target type");
      return false;
    }
    return true;
  };
  const VimeoUrlCallBack = () => {
    if (validate()) {
      isSaving(true);
      setSubmitClose(true);
      setfeedbackModalVisible(true);
      setCurrentlyUploadingFilesStatus({
        fileName: localAsset.fileName,
        fileSize: localAsset.fileSize,
        uploadCompleteInBytes: 0,
        status: "inprogress", //inprogress, error or complete
        videoUrl: "",
      });
      vimeoClient.upload(
        localAsset,
        localAsset.fileSize,
        function (x) {
          setCurrentlyUploadingFilesStatus({
            ...currentlyUploadingFilesStatus,
            videoUrl: x,
            status: "complete",
          });
          console.log(x);
          urlSplit(x);

          // onVideoCompleteUrl(x);
        },
        function (bytesUploaded, bytesTotal) {
          // console.log(currentlyUploadingFilesStatus);
          // console.log(`${bytesUploaded}/${bytesTotal}`);
          setCurrentlyUploadingFilesStatus({
            ...currentlyUploadingFilesStatus,
            uploadCompleteInBytes: bytesUploaded,
            fileSize: bytesTotal,
          });
        },
        function (x) {
          setCurrentlyUploadingFilesStatus({
            ...currentlyUploadingFilesStatus,
            videoUrl: "",
            status: "error",
            uploadCompleteInBytes: 0,
          }),
            setSubmitClose(false);

          // console.log(x, 'error');
        }
      );
    }
  };
  const validateUrl = (UrlFi) => {
    console.log(finalUrl);
    if (UrlFi === "") {
      Alert.alert("URL is not obtained properly, kindly try again!");
      console.log(finalUrl, "empty");
      return false;
    }
    return true;
  };
  const confirmAdd = (value, description, collegeId, UrlFi) => {
    const receiverCheckArray = Array.isArray(receiverList)
      ? receiverList[0]
      : receiverList;
    // console.log(
    //   'req',
    //   receiverList,
    //   receiverCheckArray,
    //   receiverList.length,
    //   typeof receiverList,
    // );
    if (validateUrl(UrlFi)) {
      const request = {
        collegeid: collegeId,
        staffid: memberid,
        callertype: priority,
        title: value,
        description: description,
        iframe: `<iframe src="https://player.vimeo.com/video/${UrlFi}?title=0&amp;byline=0&amp;portrait=0&amp;speed=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=177030" width="400" height="300"frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="new videotesting"></iframe>`,
        url: `https://vimeo.com/${UrlFi}`,
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
      console.log(request);
      addVideo({ request, isEntireCollege: receiverTypeId === "1",subjectType: subjectType })
        .then((result) => {
          console.log(result, "message");
          setFeedbackMessage(result);
          setLoading(false);
          isSaving(false);
          setSubmitState(true);
          wait(500).then(() => {
            setfeedbackModalVisible(false);
            bottomSheetAction({ hideSheet: false });
            navigation.goBack();
          });
        })
        .catch((result) => {
          console.log(result);
          setFeedbackMessage(result.Message);
          setLoading(false);
          isSaving(false);
          setSubmitState(false);
          setSubmitClose(false);
          wait(1000).then(() => {
            setfeedbackModalVisible(false);
          });
        });
    } else {
      setLoading(false);
      isSaving(false);
      setSubmitState(false);
      wait(1000).then(() => {
        setfeedbackModalVisible(false);
      });
    }
  };

  const titleMaxLength = 100;
  const marginDescribe = description?.length >= 100;

  const urlSplit = (x) => {
    console.log(x);
    let y = x.slice(x.lastIndexOf("/") + 1);
    setFinalUrl(x.slice(x.lastIndexOf("/") + 1));
    setLocalAsset("");
    submitFUnction(y);
  };
  const submitFUnction = (UrlFi) => {
    confirmAdd(value, description, collegeId, UrlFi);
  };
  const check = () => {
    let y = "/videos/593091886";
    console.log(y.slice(y.lastIndexOf("/") + 1));
  };

  const renderItem = (item) => {
    const count = item.index + 1;
    return (
      <View style={styles.rowOnly}>
        <Text>{count}. </Text>
        <Text style={styles.textWrap}>{item.item.content}</Text>
      </View>
    );
  };
  return (
    <Provider>
      <SafeAreaView style={styles.containerNew}>
        <FeedbackModal
          visible={feedbackModalVisible}
          loading={saving}
          state={submitState}
          message={feedbackMessage}
        />
        <Modal visible={localPlayVideo}>
          <VideoLocalPlay
            video={localAsset}
            visible={localPlayVideo}
            onSubmit={toggleLocalPlayVideo}
            onClose={toggleLocalPlayVideo}
          />
        </Modal>
        <Modal
          transparent={true}
          visible={restrictionModal}
          onRequestClose={() => {
            setRestrictionModal(!restrictionModal);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.restrictionsView}>
              <FlatList
                data={rules}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
              <TouchableOpacity
                onPress={() => setRestrictionModal(false)}
                style={styles.button}
              >
                <Text style={styles.textCenter}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Header />

        <Advertisement />
        <TouchableOpacity
          onPress={goBack}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        >
          <View style={styles.pageHeader}>
            <Icons name="arrow-left" size={16} color={Constants.WHITE_COLOR} />
            <Text style={styles.pageHeaderText}>New Video</Text>
          </View>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.mainView}>
          <Spinner color="#3b5998" visible={loading} size="large" />
          <Text style={styles.textBold}>Title</Text>
          <TextInput
            style={styles.input}
            maxLength={titleMaxLength}
            onChangeText={(value) => onChangeText(value)}
            placeholder="Enter the title"
          />
          <Text style={[styles.textBold]}>Description</Text>
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

          <TouchableOpacity
            style={styles.uploadButtonWrapper}
            onPress={() => handleUploadButtonPress()}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                style={{ width: 24, alignSelf: "baseline", marginTop: 0 }}
                source={require("../../../assests/images/upload.png")}
              />
              <View style={{ paddingHorizontal: 15 }}>
                {localAsset ? (
                  <>
                    <Text style={{ fontWeight: Constants.FONT_WEI_BOLD }}>
                      Uploaded Video
                    </Text>
                    <Text numberOfLines={1}>
                      FileName : {localAsset.fileName}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={{ fontWeight: Constants.FONT_WEI_BOLD }}>
                      Upload Video
                    </Text>
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>
          {currentlyUploadingFilesStatus !== null &&
            currentlyUploadingFilesStatus.status !== "error" && (
              <View>
                <View>
                  <Text>{currentlyUploadingFilesStatus.fileName}</Text>
                </View>
                {/* <View
              style={{
                width: `${
                  (currentlyUploadingFilesStatus.uploadCompleteInBytes /
                    currentlyUploadingFilesStatus.fileSize) *
                  100
                }%`,
                height: 15,
                borderRadius: 5,
                backgroundColor: Constants.MILD_COLOR,
              }}
            /> */}
                {currentlyUploadingFilesStatus.status !== "complete" ? (
                  <Image
                    style={{ height: 35, width: 50, bottom: 3 }}
                    source={require("../../../assests/images/BeanEater.gif")}
                  />
                ) : (
                  <View>
                    <Text>
                      File Url : {currentlyUploadingFilesStatus.videoUrl}
                    </Text>
                  </View>
                )}
              </View>
            )}
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
              //setReceiverList(isEntire ? [item.sectionid] : selectStudents);
              setReceiverList(selectStudents);

              setSpecificViewReview(false);
              setSubjectType(subject_type)

            }}
          />
          <View style={{ padding: 3 }}>
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
              onPress={() => backAction()}
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
              onPress={() => confirmSubmit()}
              // disabled={fileUploading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Uploading.." : "Confirm"}
              </Text>
            </Button>
          </View>
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
  rules: app?.videoRestrictions,
  versionInfo: app?.versionInfo,
});
const mapDispatchToProps = (dispatch) => {
  return {
    addVideo: bindActionCreators(addVideo, dispatch),
    restrictions: bindActionCreators(restrictions, dispatch),
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(VideoUploadScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerNew: {
    flex: 1,
    backgroundColor: Constants.BRIGHT_COLOR,
  },
  row: {
    flexDirection: "row",
    marginTop: "10%",
    justifyContent: "space-between",
  },
  rowOnly: {
    flexDirection: "row",
  },
  discriptionHeight: {
    justifyContent: "flex-start",
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
  },
  Text: {
    fontFamily: FONT.primaryBold,
  },
  pageHeaderText: {
    color: Constants.WHITE_COLOR,
    fontFamily: FONT.primaryMedium,
    paddingLeft: 10,
  },
  mainView: {
    paddingHorizontal: "5%",
    paddingTop: "5%",
    paddingBottom: "5%",
    //height: 550,
  },
  descriptionView: {
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    height: 130,
  },
  descriptionScroll: {
    height: 130,
  },
  textBoldWhite: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_LOW,
    color: Constants.WHITE_COLOR,
  },
  textBold: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_FULL_LOW,
    color: Constants.DARK_COLOR,
  },
  textNormal: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_LOW,
    paddingTop: 10,
  },
  textlow: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_FULL_LOW,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    color: Constants.BLACK000,
  },
  inputRound: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: "center",
    paddingLeft: "5%",
    marginTop: 10,
  },
  upload: {
    paddingVertical: "5%",
    flexDirection: "row",
    borderStyle: "dashed",
    borderRadius: 1,
    borderWidth: 1,
    borderColor: Constants.BLACK006,
    backgroundColor: Constants.GREY001,
    marginTop: 10,
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
    alignSelf: "flex-end",
    textDecorationLine: "underline",
    color: Constants.GREEN002,
  },
  buttonBelow: {
    height: 40,
    width: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(52, 52, 52, 0.4)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    height: "20%",
    width: "60%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 15,
  },
  modalButton: {
    backgroundColor: Constants.FACULTY_HEAD_COLOR,
    alignSelf: "center",
    marginTop: 30,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: Constants.GREEN002,
  },
  restrictionsView: {
    margin: 20,
    flex: 1,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 15,
  },
  textWrap: { flexShrink: 1 },
  textCenter: {
    alignSelf: "center",
  },
  textFlexEnd: { alignSelf: "flex-end" },
  smallHeight: { marginTop: 10 },
  footer: {
    // marginTop: 3,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // paddingHorizontal: '5%',
    // marginBottom: '55%',
    // position: 'relative',
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    paddingBottom: 20,
  },
  footerTop: {
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    marginBottom: "55%",
    position: "relative",
  },

  actionButton: {
    height: 40,
    width: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_THIRTEEN,
    color: Constants.WHITE_COLOR,
  },
  uploadButtonWrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    height: 60,
    padding: 16,
    margin: 5,
    borderWidth: 0.5,
    borderStyle: "dashed",
    borderRadius: 1,
    borderColor: Constants.TEXT_INPUT_COLOR,
  },
});
