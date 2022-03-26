/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  BackHandler,
  Alert,
  Modal,
} from "react-native";
import Icons from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
//import Constants from '../../../../constants/constants';
import { Controller, useForm } from "react-hook-form";
import { TextInput, Provider } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import DocumentPicker from "react-native-document-picker";
import { DatePickerModal } from "react-native-paper-dates";
import moment from "moment";
import { CalendarView } from "../../../../components/Calendar";
import Advertisement from "../../../../components/Advertisement";
import {
  Constants,
  FONT,
  ICON,
  TOUCHABLE_ACTIVE_OPACITY,
} from "../../../../constants/constants";
import Header from "../../../../components/Header/Header";
import { TextArea } from "../../../../components/TextArea/TextArea";
import { setBottomSheetData } from "../../../../redux/actions/setBottomSheetData";
import Button from "../../../../components/Button/button";
import AppConfig from "../../../../redux/app-config";
import triggerSimpleAjax from "../../../../context/Helper/httpHelper";
import RecipientsList from "../../../../components/Modal/RecipientsList";
import FeedbackModal from "../../../../components/Modal/Feedback";
import { fileSelect } from "../../../DashboardHome/util/fileManager";
import AwsAmplify from "../../../../utils/awsAmplify";
import { ProgressBar, Colors } from "react-native-paper";
import PickerOptionModal from "../../../../components/PickerOptionsModal/PickerOptionModal";
import ImageModalSheet from "../../../../components/ModalSheet/ModalSheet";
import VideoLocalPlay from "../../Video/VideoLocalPlay";
import Vimeo from "../../../../components/VimeoVideoUploader/vimeoCustom";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const NewAssignment = ({
  navigation,
  route,
  bottomSheetAction,
  maindata,
  versionInfo,
}) => {
  const { priority, memberid, colgid, deptid, sectionid, courseid } = maindata;
  const [dateOpen, setDateOpen] = useState(false);
  const [showFileTypeDropDown, setShowFileTypeDropDown] = useState(false);
  const [subjectYearData, setSubjectYearData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [studentList, setStudentList] = useState(null);
  const [studentListVisiable, setStudnetListVisiable] = useState(false);
  const [errorReceiverType, setErrorReceiverType] = useState(false);
  const [feedbackModalVisible, setfeedbackModalVisible] = useState(false);
  const [currenItem, setCurrentItem] = useState(null);
  const [saving, isSaving] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const showAssignmentModal = () => setModalVisible(true);
  const hideAssignmentModal = () => setModalVisible(false);
  const [singleFile, setSingleFile] = useState(null);
  const [fileUploading, setFileUploading] = useState("");
  const [totalFilesToBeUploaded, setTotalFilesToBeUploaded] = useState(0);
  const [noOffilesUploaded, setNoOfFilesUploaded] = useState(0);
  const [isUploadProgressBarVisible, setIsUploadProgressBarVisible] = useState(
    false
  );
  const [filesUploaded, setFilesUploaded] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isBottomModalVisible, setIsBottomModalVisible] = useState(false);
  const [fileType, setFileType] = useState("");
  const [submitClose, setSubmitClose] = useState(false);
  const [isForward, setIsForward] = useState(false);
  const [localPlayVideo, setLocalPlayVideo] = useState(false);
  const toggleLocalPlayVideo = () =>
    setLocalPlayVideo((prevState) => !prevState);

  const [vimeoClient, setVimeoClient] = useState(null);
  const [
    currentlyUploadingFilesStatus,
    setCurrentlyUploadingFilesStatus,
  ] = useState(null);

  const toggleModal = () => setDateVisible((prevState) => !prevState);
  const [dateVisible, setDateVisible] = useState(false);
  const [startDate, setStartDate] = useState("");

  const [finalUrl, setFinalUrl] = useState("");
  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      submissionOn: "",
      assignmentType: "",
      subjectid: "",
      yearid: "",
      receivertype: "",
      receiverid: "",
      title: "",
      description: "",
      file: "",
    },
  });

  useEffect(() => {
    startVimeoClient();
  }, []);

  const startVimeoClient = () => {
    const client = new Vimeo();
    client.generateClientCredentials("public", function () {
      setVimeoClient(client);
    });
  };
  const videoCancel = () => {
    setSelectedFiles([]);
    setLocalPlayVideo(false);
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

  const watchAssignmentType = watch("assignmentType", "");
  const titleMaxLength = 100;
  const goBack = () => {
    navigation.goBack();
  };
  const onDismissSingle = useCallback(() => {
    setDateOpen(false);
  }, [setDateOpen]);

  const onConfirmSingle = useCallback(
    (params) => {
      setDateOpen(false);
      setValue("submissionOn", moment(params.date).format("DD/MM/yyyy"), {
        shouldValidate: true,
      });
    },
    [setDateOpen, setValue]
  );

  const setDateFormat = (date) => {
    const dateStart = moment(date).format("DD/MM/YYYY");
    setValue("submissionOn", moment(date).format("DD/MM/yyyy"), {
      shouldValidate: true,
    });

    setStartDate(dateStart);
  };

  useEffect(() => {
    bottomSheetAction({ hideSheet: true });
    getSubjectList();

    if (route.params?.item) {
      const item = route.params.item;
      console.log(item);
      setValue("submissionOn", item.submissiondate);
      setValue("assignmentType", item.assignmenttype);
      setValue("title", item.topic);
      setValue("description", item.description);
      setSelectedFiles(item.newfilepath);
      setFilesUploaded(item.newfilepath);
      setIsForward(true);
      showAssignmentModal();
    }
  }, []);

  const getSubjectList = () => {
    const request = {
      staffid: memberid,
      collegeid: colgid,
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

  const VimeoUrlCallBack = useCallback(() => {
    return new Promise((resolve, reject) => {
      setIsUploadProgressBarVisible(true);
      // console.log(selectedFiles, 'res');
      if (watchAssignmentType === "video") {
        // console.log(selectedFiles, 'lll');

        let localAsset = selectedFiles[0];
        // console.log(localAsset, 'locallll');
        setCurrentlyUploadingFilesStatus({
          fileName: localAsset.name,
          fileSize: localAsset.size,
          uploadCompleteInBytes: 0,
          status: "inprogress", //inprogress, error or complete
          videoUrl: "",
        });
        // console.log(currentlyUploadingFilesStatus, 'checkkkkkkllllk');
        vimeoClient.upload(
          localAsset,
          localAsset.size,
          function (x) {
            setCurrentlyUploadingFilesStatus({
              ...currentlyUploadingFilesStatus,
              videoUrl: x,
              status: "complete",
            });

            console.log(x, "checkkkk");
            let y = x.slice(x.lastIndexOf("/") + 1);

            console.log(x, y, "checkkkk");
            setFinalUrl(x.slice(x.lastIndexOf("/") + 1));
            var z = filesUploaded;
            z.push({ FileName: `https://vimeo.com/${y}` });
            setFilesUploaded(z);
            resolve(true);

            setIsUploadProgressBarVisible(false);
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
            });
            reject(false);

            setIsUploadProgressBarVisible(false);
            // console.log(x, 'error');
          }
        );
      } else {
        resolve(true);
      }
    });
  }, [
    selectedFiles,
    currentlyUploadingFilesStatus,
    setFinalUrl,
    setCurrentlyUploadingFilesStatus,
  ]);

  console.log({ selectedFiles });
  const handleUploadFiles = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (watchAssignmentType === "image" || watchAssignmentType === "pdf") {
        setIsUploadProgressBarVisible(true);
        setTotalFilesToBeUploaded(selectedFiles.length);
        const awsAmplify = new AwsAmplify(colgid, "assignment");
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
                  // type: selectedFiles[i].type,
                });
                setFilesUploaded(tempFilesUploaded);
                resolve(true);
              })
              .catch(() => reject(false));
          });
          promisesArray.push(aPromise);
        }

        Promise.all(promisesArray)
          .then((promises) => {
            resolve(true);
          })
          .catch(() => reject(false));
      } else {
        resolve(true);
      }
    });
  }, [
    selectedFiles,
    filesUploaded,
    setFilesUploaded,
    setIsUploadProgressBarVisible,
    setTotalFilesToBeUploaded,
    setNoOfFilesUploaded,
  ]);

  const postAssignement = useCallback(
    async (data) => {
      // setSubmitClose(true);
      setErrorReceiverType(false);
      if (data.receivertype === "") {
        setErrorReceiverType(true);
        return;
      }
      if (data.receiverid === "") {
        setErrorReceiverType(true);
        return;
      }

      if (data.assignmentType !== "text" && selectedFiles.length === 0) {
        Alert.alert("Upload minimum 1 attachment");
        return false;
      }

      setfeedbackModalVisible(true);
      isSaving(true);
      const isUploadDone = isForward ? true : await handleUploadFiles();
      const isUploadVideoDone = isForward ? true : await VimeoUrlCallBack();
      let request = {
        staffid: `${memberid}`,
        collegeid: `${colgid}`,
        deptid: deptid,
        courseid: "0",
        callertype: priority,
        sectionid: data.sectionid,
        yearid: data.yearid,
        subjectid: data.subjectid,
        assignmenttopic: data.title,
        assignmentdescription: data.description,
        submissiondate: data.submissionOn,
        processtype: "add",
        assignmenttype: data.assignmentType,
        assignmentid: "0",
        receivertype: `${data.receivertype}`,
        receiverid: data.receiverid,
      };

      if (data.assignmentType !== "text") {
        request = {
          ...request,
          FileNameArray: filesUploaded,
        };
      }

      let formdata = new FormData();
      formdata.append(
        "",
        JSON.stringify({
          ...request,
        })
      );
      //debugger;
      console.log("ManageAssignemnt", request);
      //debugger;
      triggerSimpleAjax(
        `${AppConfig.API_URL}${
          data.assignmentType !== "text"
            ? AppConfig.API.POST_ASSIGNMENT_WITH_ATTACHMENT
            : AppConfig.API.POST_ASSIGNMENT
        }`,
        "POST",
        false,
        request,
        (result) => {
          console.log(result, "message");
          setFeedbackMessage(result.Message);
          const { Status, Message } = result;
          if (Status === 1) {
            console.log("AssingmentResponse", Message);
            setIsForward(false);
            isSaving(false);
            setSubmitState(true);
            wait(500).then(() => {
              setfeedbackModalVisible(false);
              bottomSheetAction({ hideSheet: false });
              navigation.goBack();
            });
          }
        },
        (result) => {
          console.log(result, "message");
          setFeedbackMessage(result.Message);
          // console.error(result);
          isSaving(false);
          setSubmitState(false);
          wait(1000).then(() => {
            setfeedbackModalVisible(false);
          });
        }
      );
    },
    [
      filesUploaded,
      bottomSheetAction,
      navigation,
      isSaving,
      setSubmitState,
      handleUploadFiles,
      setErrorReceiverType,
      setfeedbackModalVisible,
    ]
  );

  var today = new Date().toISOString().slice(0, -14);

  const typeList = [
    { label: "Text", value: "text" },
    { label: "PDF", value: "pdf" },
    { label: "Image", value: "image" },
    { label: "Video", value: "video" },
  ];
  const selectFile = () => {
    fileSelect({
      multiple: true,
      image: watchAssignmentType === "image",
      pdf: watchAssignmentType === "pdf",
      onSelect: (files) => {
        setIsUploadProgressBarVisible(true);
        var promisesArray = [];
        const awsAmplify = new AwsAmplify(colgid, "assignment");
        setTotalFilesToBeUploaded(files.length);
        for (var i = 0; i < files.length; i++) {
          const aPromise = new Promise((resolve, reject) => {
            awsAmplify
              .uploadFileToAwsS3(files[i].name, files[i])
              .then((url) => {
                var x = filesUploaded;
                x.push({ FileName: url });
                setFilesUploaded(x);
                resolve(true);
              })
              .catch(() => reject(false));
          });
          promisesArray.push(aPromise);
        }
        Promise.all(promisesArray).then((promises) => {
          setIsUploadProgressBarVisible(false);
          promisesArray = promises;
          var fulfiled = 0;
          promisesArray.forEach((aPromise) => {
            if (aPromise) {
              fulfiled++;
            }
          });
          setNoOfFilesUploaded(fulfiled);
        });
      },
      onCancel: setSingleFile,
    });
  };

  const checkLengthOfSelectedFiles = () => {
    console.log(".,.,.,.,.,.,.", selectedFiles);
    const maxCountImg = Number(versionInfo.imagecount) + 1;
    const maxExceedLengthImg =
      selectedFiles?.length - Number(versionInfo.imagecount);
    const maxCountPdf = Number(versionInfo.pdfcount) + 1;

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
  const confirmSubmit = () => {
    Alert.alert("Hold on!", "Are you sure you want to submit ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "YES",
        onPress: handleSubmit(postAssignement),
      },
    ]);
    return true;
  };
  const checkValidateSize = () => {
    const maxFileSize = Number(versionInfo.videosizelimit) * 1048576;
    console.log(
      "maximum sixe.......",
      maxFileSize,
      ".,,,.,.,.,.,",
      versionInfo.videosizelimit,
      selectedFiles[0].size
    );
    if (selectedFiles[0].size < maxFileSize) {
      toggleLocalPlayVideo();
    } else {
      Alert.alert(
        "Limit Exceeded ! ",
        "Maximium upload FileSize mustbe lessthan " +
          Number(versionInfo.videosizelimit) +
          "mb",
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
  };
  return (
    <Provider>
      <FeedbackModal
        visible={feedbackModalVisible}
        loading={saving}
        state={submitState}
        message={feedbackMessage}
      />
      <RecipientsList
        visible={modalVisible}
        collegeid={colgid}
        data={subjectYearData}
        studentList={studentList}
        currentItem={currenItem}
        studentListVisiable={studentListVisiable}
        onClose={hideAssignmentModal}
        onSelect={(item, isEntire, selectStudents = []) => {
          hideAssignmentModal();
          setCurrentItem(item);
          setStudnetListVisiable(false);
          setStudentList(isEntire ? null : selectStudents);
          setValue("subjectid", item.subjectid);
          setValue("yearid", item.yearid);
          setValue("sectionid", item.sectionid);
          setValue("receivertype", isEntire ? 1 : 2);
          setValue(
            "receiverid",
            isEntire ? item.sectionid : selectStudents.join("~")
          );
        }}
      />
      <SafeAreaView style={styles.container}>
        <Header />
        {/* <Advertisement /> */}

        <View style={styles.stackHeader}>
          <View style={styles.stackHeaderRow}>
            <TouchableOpacity
              onPress={() => {
                bottomSheetAction({ hideSheet: false });
                navigation.goBack();
              }}
            >
              <Icons
                name={"arrow-back"}
                size={25}
                color={Constants.WHITE_COLOR}
              />
            </TouchableOpacity>
            <View style={[styles.stackHeaderRow, { marginLeft: 10 }]}>
              <View style={{ marginLeft: 5 }}>
                <View style={{ alignSelf: "flex-start" }}>
                  <Text style={styles.title}>
                    {isForward ? "Forward Assignment" : "New Assignment"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <ScrollView>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
              paddingVertical: 30,
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, padding: 5 }}>
                <Text
                  style={{
                    fontFamily: FONT.primaryBold,
                    fontSize: Constants.FONT_FULL_LOW,
                  }}
                >
                  Submission On
                </Text>

                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      disabled={isForward ? true : false}
                      onChangeText={onChange}
                      value={startDate}
                      underlineColor={"black"}
                      theme={{ colors: { text: "black" } }}
                      onFocus={() => {
                        // Keyboard.dismiss();
                        // setDateOpen(true);
                        toggleModal();
                      }}
                      placeholder="dd/mm/yyyy"
                      placeholderTextColor={Constants.BLACK007}
                      //minDate={today}
                      right={
                        <TextInput.Icon
                          name={"calendar-blank"}
                          color={"black"}
                          style={{
                            //backgroundColor: Constants.WHITE_COLOR,
                            // backgroundColor: 'rgba(255, 255, 255)',
                            backgroundColor: Constants.BRIGHT_COLOR,
                          }}
                        />
                      }
                      style={{
                        //backgroundColor: Constants.WHITE_COLOR,
                        // backgroundColor: 'rgba(255, 255, 255)',
                        backgroundColor: Constants.BRIGHT_COLOR,
                      }}
                    />
                  )}
                  name="submissionOn"
                />
                {/* <DatePickerModal
                  mode="single"
                  visible={dateOpen}
                  onDismiss={onDismissSingle}
                  onConfirm={onConfirmSingle}
                  validRange={{
                    startDate: new Date(), // optional
                    endDate: new Date(2026, 12, 31), // optional
                  }}
                  style={{
                    //backgroundColor: Constants.WHITE_COLOR,
                    // backgroundColor: 'rgba(255, 255, 255)',
                    backgroundColor: Constants.BRIGHT_COLOR,
                  }}
                /> */}

                <CalendarView
                  visible={dateVisible}
                  toggleModal={toggleModal}
                  setStartDate={(x) => setDateFormat(x.dateString)}
                  startDate={true}
                  minDate={today}
                  maxDate={'2026-12-01'}
                  //modelOpen={}
                />

                {errors.submissionOn && (
                  <Text style={styles.errorText}>This is required.</Text>
                )}
              </View>

              <View style={{ flex: 1, padding: 5 }}>
                <Text
                  style={{
                    fontFamily: FONT.primaryBold,
                    fontSize: Constants.FONT_FULL_LOW,
                  }}
                >
                  Assignment Type
                </Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <DropDown
                      label="Select type"
                      dropDownItemTextStyle={{ color: "black" }}
                      dropDownItemStyle={{
                        backgroundColor: Constants.BLACK004,
                      }}
                      activeColor={"black"}
                      dropDownStyle={{ backgroundColor: "white" }}
                      mode={"flat"}
                      value={value}
                      setValue={(value) => {
                        setValue(name, value, { shouldValidate: true });
                        setFileType(value);
                      }}
                      onBlur={onBlur}
                      theme={{
                        colors: {
                          text: Constants.BLACK000,
                          placeholder: Constants.BLACK007,
                          background: "transparent",
                        },
                      }}
                      // underlineColor="#f5f5f5"
                      // underlineColorAndroid="#f5f5f5"
                      onChange={onChange}
                      list={typeList}
                      visible={showFileTypeDropDown}
                      showDropDown={() => {
                        isForward
                          ? setShowFileTypeDropDown(false)
                          : setShowFileTypeDropDown(true);
                      }}
                      onDismiss={() => setShowFileTypeDropDown(false)}
                      inputProps={{
                        right: (
                          <TextInput.Icon name={"menu-down"} color={"black"} />
                        ),
                        style: {
                          //backgroundColor: Constants.WHITE_COLOR,
                          // backgroundColor: 'rgba(255, 255, 255)',
                          backgroundColor: "white",
                          //borderBottomColor: Constants.BLACK007,
                          borderWidth: 1,
                          color: "black",
                        },
                      }}
                    />
                  )}
                  name="assignmentType"
                />
                {errors.assignmentType && (
                  <Text style={styles.errorText}>This is required.</Text>
                )}
              </View>
            </View>

            <View style={{ padding: 5 }}>
              <Text
                style={{
                  fontFamily: FONT.primaryBold,
                  fontSize: Constants.FONT_FULL_LOW,
                }}
              >
                Title
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter the title"
                    onBlur={onBlur}
                    maxLength={titleMaxLength}
                    placeholderTextColor={Constants.BLACK007}
                    disabled={isForward ? true : false}
                    onChangeText={onChange}
                    onFocus={() => {
                      Constants.HEADER_COLOR;
                    }}
                    underlineColor={"black"}
                    theme={{ colors: { text: "black" } }}
                    value={value}
                    style={{
                      //backgroundColor: Constants.WHITE_COLOR,
                      // backgroundColor: 'rgba(255, 255, 255)',
                      backgroundColor: Constants.BRIGHT_COLOR,
                    }}
                  />
                )}
                name="title"
                defaultValue=""
              />
              {errors.title && (
                <Text style={styles.errorText}>This is required.</Text>
              )}
            </View>

            {!isForward ? (
              <View style={{ padding: 5 }}>
                <Text
                  style={{
                    fontFamily: FONT.primaryBold,
                    fontSize: Constants.FONT_FULL_LOW,
                  }}
                >
                  Description
                </Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => {
                    const placeCheck = value?.length >= 100;
                    return (
                      <View>
                        <ScrollView style={styles.discriptionScroll}>
                          <TextArea
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            count={value?.length}
                            containerStyle={{
                              borderBottomWidth: 1,
                            }}
                            style={{
                              //backgroundColor: Constants.WHITE_COLOR,
                              backgroundColor: Constants.BRIGHT_COLOR,
                              // top: placeCheck ? 0 : -30,
                              //bottom: 155,
                              //height: 100,
                            }}
                          />
                        </ScrollView>
                      </View>
                    );
                  }}
                  name="description"
                  defaultValue=""
                />
                {errors.description && (
                  <Text style={styles.errorText}>This is required.</Text>
                )}
              </View>
            ) : null}
            {watchAssignmentType !== "" &&
              watchAssignmentType !== "text" &&
              !isForward && (
                <TouchableOpacity
                  style={styles.upload}
                  onPress={() => {
                    setIsBottomModalVisible(true);
                    setSelectedFiles([]);
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
                        <Text style={styles.textNormal}>Change Your Files</Text>
                        <Text style={styles.textNormal}>
                          number of files selected:
                          {selectedFiles ? selectedFiles.length : "null"}
                        </Text>
                        {watchAssignmentType === "Video" &&
                        isUploadProgressBarVisible &&
                        currentlyUploadingFilesStatus?.status !== "complete" ? (
                          <ProgressBar indeterminate color={Colors.red800} />
                        ) : null}

                        {watchAssignmentType === "Video" &&
                        isUploadProgressBarVisible &&
                        currentlyUploadingFilesStatus?.status === "complete" ? (
                          <View>
                            <Text>
                              File Url :{" "}
                              {currentlyUploadingFilesStatus?.videoUrl}
                            </Text>
                          </View>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <Text style={styles.uploadTitle}>
                          Upload your files
                        </Text>
                        <Text style={styles.uploadSubText}>
                          You can Try to upload more files
                        </Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            {totalFilesToBeUploaded > 0 && (
              <>
                {isUploadProgressBarVisible && (
                  <ProgressBar indeterminate color={Colors.red800} />
                )}
                <View style={styles.fileuploadInfoWrapper}>
                  <Text>{`${noOffilesUploaded} / ${totalFilesToBeUploaded}`}</Text>
                </View>
              </>
            )}

            {/* <TouchableOpacity
                onPress={async () => {
                  try {
                    let type = DocumentPicker.types.pdf;
                    if (getValues('assignmentType') == 'image') {
                      type = DocumentPicker.types.images;
                    }

                    const res = await DocumentPicker.pick({
                      type: [type],
                    });
                    console.log(
                      res.uri,
                      res.type, // mime type
                      res.name,
                      res.size,
                    );
                  } catch (err) {
                    if (DocumentPicker.isCancel(err)) {
                      // User cancelled the picker, exit any dialogs or menus and move on
                    } else {
                      throw err;
                    }
                  }
                }}
              >
                <View style={styles.uploadWrapper}>
                  <Icons name={ICON.CLOUD_UPLOAD} size={32} color="#3F6EE8" />
                  <View style={{marginLeft: 20}}>
                    <Text style={styles.uploadHeading}>Upload you files</Text>
                    <Text style={{fontSize: 10}}>
                      Try to upload more files to see them here
                    </Text>
                  </View>
                </View>
              </TouchableOpacity> */}

            <View style={{ padding: 5 }}>
              <Text
                style={{
                  fontFamily: FONT.primaryBold,
                  fontSize: Constants.FONT_FULL_LOW,
                }}
              >
                Recipients
              </Text>

              <TouchableOpacity onPress={showAssignmentModal}>
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
                  <Icons name={"add"} size={18} />
                  <Text
                    style={{
                      marginLeft: 3,
                      fontSize: Constants.FONT_BADGE,
                    }}
                  >
                    Add Recipients
                  </Text>

                  {getValues("receivertype") !== "" && (
                    <Text
                      style={{
                        marginLeft: 3,
                        fontSize: Constants.FONT_FULL_MED,
                        color: "#18984B",
                      }}
                    >{`- ${
                      getValues("receivertype") === 1 ? "Entire" : "Specific"
                    }`}</Text>
                  )}
                </View>
              </TouchableOpacity>

              {errorReceiverType && (
                <Text style={styles.errorText}>This is required.</Text>
              )}

              {getValues("receivertype") === 2 && (
                <TouchableOpacity
                  onPress={() => {
                    setStudnetListVisiable(true);
                    showAssignmentModal(true);
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
              )}
            </View>
            {!submitClose && (
              <View style={styles.buttonWrapper}>
                <Button onPress={backAction} style={styles.cancelButton}>
                  <Text style={[styles.actionButtonText]}>Cancel</Text>
                </Button>
                <Button style={styles.submitButton} onPress={confirmSubmit}>
                  <Text style={[styles.actionButtonText]}>Submit</Text>
                </Button>
              </View>
            )}
          </View>
        </ScrollView>

        <PickerOptionModal
          isBottomModalVisible={isBottomModalVisible}
          setIsBottomModalVisible={setIsBottomModalVisible}
          // selectFile={selectFile}
          setIsModalVisible={setIsModalVisible}
          setLocalPlayVideo={setLocalPlayVideo}
          setSelectedFiles={setSelectedFiles}
          isMultipleFile={true}
          isPDFType={fileType === "pdf" ? true : false}
          isImageType={fileType === "image" ? true : false}
          isVideoType={fileType === "video" ? true : false}
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
        <Modal visible={localPlayVideo}>
          <VideoLocalPlay
            video={selectedFiles ? selectedFiles[0] : null}
            visible={localPlayVideo}
            // onSubmit={toggleLocalPlayVideo}
            onSubmit={checkValidateSize}
            onClose={videoCancel}
          />
        </Modal>
      </SafeAreaView>
    </Provider>
  );
};

const mapStatetoProps = ({ app }) => ({
  maindata: app.maindata,
  versionInfo: app?.versionInfo,
});

const mapDispatchToProps = (dispatch) => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(NewAssignment);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.WHITE_COLOR,
    marginBottom: 2,
  },
  discriptionScroll: {
    height: 130,
  },
  stackHeader: {
    backgroundColor: Constants.BLACK000,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  stackHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  discriptionHeight: {
    justifyContent: "flex-start",
    bottom: 30,
    backgroundColor: Constants.BRIGHT_COLOR,
  },
  containerStyle: {
    flex: 1,
  },
  scrollViewStyle: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  uploadWrapper: {
    paddingVertical: 20,
    marginVertical: 20,
    borderStyle: "dashed",
    borderRadius: 1,
    borderWidth: 1,
    borderColor: Constants.GREY001,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constants.GREY005,
    flexDirection: "row",
  },
  uploadHeading: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_ELEVEN,
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    paddingTop: "20%",
    paddingBottom: 20,
  },
  cancelButton: {
    marginHorizontal: 3,
    flexDirection: "row",
    backgroundColor: Constants.GREY001,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 35,
    paddingVertical: 10,
    marginRight: 20,
  },
  submitButton: {
    marginHorizontal: 3,
    flexDirection: "row",
    backgroundColor: "#18984B",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 35,
    paddingVertical: 10,
  },
  actionButtonText: {
    fontSize: Constants.FONT_THIRTEEN,
    fontFamily: FONT.primaryRegular,
    color: Constants.WHITE_COLOR,
  },
  errorText: {
    fontSize: Constants.FONT_BADGE,
    marginTop: 3,
    color: Constants.RED002,
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
    width: "100%",
    marginVertical: 24,
    paddingVertical: 10,
  },
  uploadTitle: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_ELEVEN,
    lineHeight: 15,
    color: Constants.BLACK000,
  },
  uploadSubText: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_TEN,
    lineHeight: 14,
    color: Constants.GREY07B,
  },
  fileuploadInfoWrapper: {
    display: "flex",
    flexDirection: "row-reverse",
  },

  textNormal: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_BADGE,
    lineHeight: 17,
    color: Constants.DARK_COLOR,
  },
});
