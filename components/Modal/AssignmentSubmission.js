/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {Modal, Portal} from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Controller, useForm} from 'react-hook-form';
import {TextInput} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Button from '../Button/button';
import FileUpload from '../ProgressBar/FileUpload';
import {setBottomSheetData} from '../../redux/actions/setBottomSheetData';
import {Constants, FONT, ICON} from '../../constants/constants';
import FeedbackComp from '../../components/Feedback';
import AppConfig from '../../redux/app-config';
import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AwsAmplify from '../../utils/awsAmplify';
import {fileSelect} from '../../screen/DashboardHome/util/fileManager';

import {ProgressBar, Colors} from 'react-native-paper';
import PickerOptionModal from '../PickerOptionsModal/PickerOptionModal';
import ImageModalSheet from '../ModalSheet/ModalSheet';
import Vimeo from '../VimeoVideoUploader/vimeoCustom';
import VideoLocalPlay from '../../screen/App/Video/VideoLocalPlay';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const AssignmentSubmission = ({
  visible,
  hideModal,
  assignment,
  maindata,
  bottomSheetAction,
  versionInfo,
}) => {
  const {memberid, colgid} = maindata;

  const [submitting, setSubmitting] = useState(false);
  const [feedbackModalVisible, setfeedbackModalVisible] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const [singleFile, setSingleFile] = useState(null);
  const [totalFilesToBeUploaded, setTotalFilesToBeUploaded] = useState(0);
  const [noOffilesUploaded, setNoOfFilesUploaded] = useState(0);
  const [isUploadProgressBarVisible, setIsUploadProgressBarVisible] =
    useState(false);
  const [filesUploaded, setFilesUploaded] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isBottomModalVisible, setIsBottomModalVisible] = useState(false);
  const [submitClose, setSubmitClose] = useState(false);

  const [localPlayVideo, setLocalPlayVideo] = useState(false);
  const toggleLocalPlayVideo = () => setLocalPlayVideo(prevState => !prevState);

  const [vimeoClient, setVimeoClient] = useState(null);
  const [currentlyUploadingFilesStatus, setCurrentlyUploadingFilesStatus] =
    useState(null);

  const [finalUrl, setFinalUrl] = useState('');

  const defaultValues = {
    assignmentType: assignment.assignmenttype,
    description: '',
    file: '',
  };

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    startVimeoClient();
  }, []);

  const startVimeoClient = () => {
    const client = new Vimeo();
    client.generateClientCredentials('public', function () {
      setVimeoClient(client);
    });
  };
  const videoCancel = () => {
    setLocalPlayVideo(false);
    setSelectedFiles([]);
  };
  useEffect(() => {
    reset(defaultValues);
    setIsUploadProgressBarVisible(false);
  }, [visible]);

  const submitAssignment = useCallback(
    async data => {
      setSubmitClose(true);
      console.log('filee', selectedFiles?.length, data, selectedFiles[0]?.type);
      if (selectedFiles?.length === 0) {
        Alert.alert('Upload minimum 1 attachment');
        return false;
      }

      console.log('filee', selectedFiles?.length, data);

      const isUploadDone = await handleUploadFiles();
      const isUploadVideoDone = await VimeoUrlCallBack();
      const FileUrlAlone = [];
      for (let i = 0; i < filesUploaded.length; i++) {
        FileUrlAlone.push({FileName: filesUploaded[i].FileName});
      }
      setfeedbackModalVisible(true);
      setSubmitting(true);
      const request = {
        assignmentid: assignment.assignmentid,
        processby: memberid,
        colgid: colgid,
        description: data.description,
        filetype: selectedFiles[0]?.type.includes('pdf')
          ? 'pdf'
          : selectedFiles[0]?.type.includes('image')
          ? 'image'
          : 'video',
        FileNameArray: FileUrlAlone,
      };
      triggerSimpleAjax(
        `${AppConfig.API_URL}${AppConfig.API.SUBMIT_ASSIGNMENT}`,
        'POST',
        false,
        request,
        result => {
          const {Status, data} = result;
          if (Status === 1) {
            console.log(result);
            setSubmitting(false);
            setSubmitState(true);
            setNoOfFilesUploaded(0);
            setFilesUploaded([]);
            setTotalFilesToBeUploaded(0);
            setSelectedFiles([]);
            wait(500).then(() => {
              hideModal();
              setfeedbackModalVisible(false);
              bottomSheetAction({hideSheet: false});
            });
          }
        },
        result => {
          console.error(result);
          setSubmitting(false);
          setSubmitState(false);
          wait(1000).then(() => {
            setfeedbackModalVisible(false);
            hideModal();
          });
        },
      );
    },
    [
      selectedFiles,
      filesUploaded,
      bottomSheetAction,
      setSubmitting,
      setSubmitState,
      handleUploadFiles,
      setfeedbackModalVisible,
    ],
  );

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          hideModal();
        },
      },
    ]);
    return true;
  };

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', backAction);

  //   return () =>
  //     BackHandler.removeEventListener('hardwareBackPress', backAction);
  // }, []);

  // const selectFile = () => {
  //   fileSelect({
  //     multiple: true,
  //     onSelect: files => {
  //       setIsUploadProgressBarVisible(true);
  //       var promisesArray = [];
  //       const awsAmplify = new AwsAmplify(colgid, 'assignment');
  //       setTotalFilesToBeUploaded(files.length);
  //       for (var i = 0; i < files.length; i++) {
  //         const aPromise = new Promise((resolve, reject) => {
  //           awsAmplify
  //             .uploadFileToAwsS3(files[i].name, files[i])
  //             .then(url => {
  //               var x = filesUploaded;
  //               x.push({FileName: url});
  //               setFilesUploaded(x);
  //               resolve(true);
  //             })
  //             .catch(() => reject(false));
  //         });
  //         promisesArray.push(aPromise);
  //       }
  //       Promise.all(promisesArray).then(promises => {
  //         setIsUploadProgressBarVisible(false);
  //         promisesArray = promises;
  //         var fulfiled = 0;
  //         promisesArray.forEach(aPromise => {
  //           if (aPromise) {
  //             fulfiled++;
  //           }
  //         });
  //         setNoOfFilesUploaded(fulfiled);
  //       });
  //     },
  //     onCancel: setSingleFile,
  //   });
  // };

  // const handleUploadFiles = () => {
  //   setIsModalVisible(false);
  //   setIsUploadProgressBarVisible(true);

  //   setTotalFilesToBeUploaded(selectedFiles.length);
  //   const awsAmplify = new AwsAmplify(colgid, 'assignment');
  //   for (let i = 0; i < selectedFiles.length; i++) {
  //     awsAmplify
  //       .uploadFileToAwsS3(
  //         selectedFiles[i].name || selectedFiles[i].fileName,
  //         selectedFiles[i],
  //       )
  //       .then(url => {
  //         setIsUploadProgressBarVisible(false);
  //         setNoOfFilesUploaded(prevState => prevState + 1);
  //         var tempFilesUploaded = filesUploaded;
  //         tempFilesUploaded.push({FileName: url}); //, type: selectedFiles[i].type
  //         setFilesUploaded(tempFilesUploaded);
  //       })
  //       .catch(() => {});
  //   }
  // };
  const handleUploadFiles = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (
        selectedFiles[0]?.type.includes('image') ||
        selectedFiles[0]?.type.includes('pdf')
      ) {
        setIsUploadProgressBarVisible(true);
        setTotalFilesToBeUploaded(selectedFiles.length);
        const awsAmplify = new AwsAmplify(colgid, 'assignment');
        let promisesArray = [];
        for (let i = 0; i < selectedFiles.length; i++) {
          const aPromise = new Promise((resolve, reject) => {
            awsAmplify
              .uploadFileToAwsS3(
                selectedFiles[i].name || selectedFiles[i].fileName,
                selectedFiles[i],
              )
              .then(url => {
                setIsUploadProgressBarVisible(false);
                setNoOfFilesUploaded(prevState => prevState + 1);
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
          .then(promises => {
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
  const VimeoUrlCallBack = useCallback(() => {
    console.log(selectedFiles[0]?.type.includes('video'), selectedFiles);

    return new Promise((resolve, reject) => {
      setIsUploadProgressBarVisible(true);
      console.log(selectedFiles, 'res');
      if (selectedFiles[0]?.type.includes('video')) {
        console.log(selectedFiles, 'lll');
        let localAsset = selectedFiles[0];
        console.log(localAsset, 'locallll');
        setCurrentlyUploadingFilesStatus({
          fileName: localAsset.name,
          fileSize: localAsset.size,
          uploadCompleteInBytes: 0,
          status: 'inprogress', //inprogress, error or complete
          videoUrl: '',
        });
        console.log(currentlyUploadingFilesStatus, 'checkkkkkkllllk');
        vimeoClient.upload(
          localAsset,
          localAsset.size,
          function (x) {
            setCurrentlyUploadingFilesStatus({
              ...currentlyUploadingFilesStatus,
              videoUrl: x,
              status: 'complete',
            });
            console.log(x, 'checkkkk');
            let y = x.slice(x.lastIndexOf('/') + 1);
            console.log(x, y, 'checkkkk');
            setFinalUrl(x.slice(x.lastIndexOf('/') + 1));
            var z = filesUploaded;
            z.push({FileName: `https://vimeo.com/${y}`});
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
              videoUrl: '',
              status: 'error',
              uploadCompleteInBytes: 0,
            });
            reject(false);
            setIsUploadProgressBarVisible(false);
            // console.log(x, 'error');
          },
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

  const confirmSubmit = () => {
    Alert.alert('Hold on!', 'Are you sure you want to submit ?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: handleSubmit(submitAssignment),
      },
    ]);
    return true;
  };

  const checkLengthOfSelectedFiles = () => {
    const maxCountImg = Number(versionInfo.imagecount) + 1;
    const maxExceedLengthImg =
      selectedFiles?.length - Number(versionInfo.imagecount);
    const maxCountPdf = Number(versionInfo.pdfcount) + 1;

    const maxExceedLengthPdf =
      selectedFiles?.length - Number(versionInfo.pdfcount);
    if (selectedFiles[0]?.type.includes('image')) {
      if (selectedFiles?.length < maxCountImg) {
        setIsModalVisible(!isModalVisible);
      } else {
        Alert.alert(
          'Limit Exceeded ! Reduce ' + maxExceedLengthImg + ' count',
          'Maximium upload count is ' + Number(versionInfo.imagecount),
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
        );
      }
    } else if (selectedFiles[0]?.type.includes('pdf')) {
      if (selectedFiles?.length < maxCountPdf) {
        setIsModalVisible(!isModalVisible);
      } else {
        Alert.alert(
          'Limit Exceeded ! Reduce ' + maxExceedLengthPdf + ' count',
          'Maximium upload count is ' + Number(versionInfo.pdfcount),
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
        );
      }
    }
  };
  // console.warn(selectedFiles[0]?.type, 'selesctedds');
  // handleSubmit(submitAssignment)
  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={styles.modalContainerStyle}
      >
        <SafeAreaView>
          {feedbackModalVisible ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 50,
              }}
            >
              <FeedbackComp
                visible={feedbackModalVisible}
                loading={submitting}
                state={submitState}
              />
            </View>
          ) : (
            <>
              <Text style={styles.heading}>Assignment Submission</Text>

              <ScrollView>
                <View
                  style={{
                    flex: 1,
                    paddingVertical: 20,
                    marginBottom: 20,
                  }}
                >
                  <View style={{flex: 1, padding: 5}}>
                    {!isUploadProgressBarVisible ? (
                      <TouchableOpacity
                        onPress={() => {
                          setIsBottomModalVisible(true);
                          setSelectedFiles([]);
                        }}
                      >
                        <View style={styles.uploadWrapper}>
                          <Icons
                            name={ICON.CLOUD_UPLOAD}
                            size={32}
                            color="#3F6EE8"
                          />
                          {!selectedFiles?.length ? (
                            <>
                              <Text style={styles.uploadHeading}>
                                Upload you files
                              </Text>
                              <Text style={{fontSize: 10}}>
                                Try to upload more files to see them here
                              </Text>
                            </>
                          ) : (
                            <>
                              <Text style={styles.uploadHeading}>
                                Uploaded your files
                              </Text>
                              <Text style={{fontSize: 10}}>
                                Total selected files : {selectedFiles?.length}
                              </Text>
                            </>
                          )}
                        </View>
                      </TouchableOpacity>
                    ) : null}
                    {/* {totalFilesToBeUploaded > 0 && ( */}
                    <>
                      {isUploadProgressBarVisible && (
                        <ProgressBar indeterminate color={Colors.red800} />
                      )}
                      <View style={styles.fileuploadInfoWrapper}>
                        <Text>{`${noOffilesUploaded} / ${selectedFiles.length}`}</Text>
                      </View>
                    </>

                    {/* <View style={styles.fileProgressWrapper}>
                                            <FileUpload
                                                progress={0.5}
                                                color={'#1B82E1'}
                                                fileName="aws_particular.pdf"
                                                progressText="2.3MB of 4.2MB"
                                                onCancel={() => { }}
                                            />
                                        </View> */}
                  </View>

                  <View style={{flex: 1, padding: 5}}>
                    <Text style={styles.heading}>Description</Text>

                    <View style={styles.descriptionWrapper}>
                      <Controller
                        control={control}
                        rules={{
                          required: true,
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                          <ScrollView style={styles.descriptionScroll}>
                            <TextInput
                              onBlur={onBlur}
                              onChangeText={onChange}
                              value={value}
                              editable={true}
                              multiline={true}
                              disabled={isUploadProgressBarVisible}
                              //minHeight={150}
                              fontSize={12}
                              fontFamily={FONT.primaryRegular}
                              style={{
                                backgroundColor: Constants.WHITE_COLOR,
                              }}
                            />
                          </ScrollView>
                        )}
                        name="description"
                        defaultValue=""
                      />
                      {errors.description && (
                        <Text style={styles.errorText}>This is required.</Text>
                      )}
                    </View>
                  </View>
                  {!isUploadProgressBarVisible && (
                    <View style={styles.bottomButtom}>
                      <Button
                        style={styles.cancelButton}
                        onPress={() => {
                          backAction();
                          setSelectedFiles([]);
                        }}
                      >
                        <Text
                          style={[
                            styles.actionButtonText,
                            {color: Constants.BRIGHT_COLOR},
                          ]}
                        >
                          Cancel
                        </Text>
                      </Button>

                      <Button
                        style={styles.submitButton}
                        onPress={confirmSubmit}
                      >
                        <Text
                          style={[
                            styles.actionButtonText,
                            {color: Constants.BRIGHT_COLOR},
                          ]}
                        >
                          Submit
                        </Text>
                      </Button>
                    </View>
                  )}
                </View>
              </ScrollView>
            </>
          )}

          <PickerOptionModal
            isPDFType={
              selectedFiles.length
                ? selectedFiles[0]?.type.includes('pdf')
                  ? true
                  : false
                : true
            }
            isImageType={
              selectedFiles.length
                ? selectedFiles[0]?.type.includes('image')
                  ? true
                  : false
                : true
            }
            isVideoType={
              selectedFiles.length
                ? selectedFiles[0]?.type.includes('video')
                  ? true
                  : false
                : true
            }
            isBottomModalVisible={isBottomModalVisible}
            setIsBottomModalVisible={setIsBottomModalVisible}
            setLocalPlayVideo={setLocalPlayVideo}
            // selectFile={selectFile}
            setIsModalVisible={setIsModalVisible}
            setSelectedFiles={setSelectedFiles}
          />
          {/* {console.warn(isBottomModalVisible)} */}
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
      </Modal>
      <Modal
        visible={localPlayVideo}
        contentContainerStyle={styles.modalContainerStyleVideo}
      >
        <VideoLocalPlay
          video={selectedFiles ? selectedFiles[0] : null}
          visible={localPlayVideo}
          onSubmit={toggleLocalPlayVideo}
          onClose={videoCancel}
        />
      </Modal>
    </Portal>
  );
};

const mapStatetoProps = ({app}) => ({
  maindata: app.maindata,

  versionInfo: app?.versionInfo,
});

const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(AssignmentSubmission);

const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    maxHeight: '95%',
  },
  modalContainerStyleVideo: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    // padding: 20,
    // marginHorizontal: 20,
  },

  discriptionScroll: {
    height: 130,
  },
  bottomButtom: {
    flexDirection: 'row',
    height: 50,
  },
  heading: {
    fontFamily: FONT.primaryBold,
    fontSize: 12,
  },
  uploadWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginVertical: 20,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderWidth: 1,
    borderColor: Constants.GREY001,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.GREY005,
  },
  uploadHeading: {
    fontFamily: FONT.primaryBold,
    fontSize: 11,
    marginBottom: 5,
    marginTop: 15,
  },
  descriptionWrapper: {
    marginVertical: 20,
    height: 130,
    flex: 1,
  },
  cancelButton: {
    marginHorizontal: 3,
    // flexDirection: 'row',
    backgroundColor: Constants.RED003,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: '50%',
  },
  submitButton: {
    marginHorizontal: 3,
    // flexDirection: 'row',
    backgroundColor: '#229557',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: '50%',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    color: Constants.BUTTON_SELECTED_COLOR,
  },
  fileProgressWrapper: {
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    shadowColor: Constants.GREY001,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 6,
  },
  errorText: {
    fontSize: 12,
    marginTop: 3,
    color: Constants.RED002,
  },
  fileuploadInfoWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
});
