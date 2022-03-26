/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../../components/Header/Header';

import Spinner from 'react-native-loading-spinner-overlay';
import {
  Constants,
  FONT,
  ICON,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fileSelect} from '../../DashboardHome/util/fileManager';
import AwsAmplify from '../../../utils/awsAmplify/index';
import Button from '../../../components/Button/button';
import {Image} from 'react-native-elements';
import {eventImages} from '../../../redux/actions/events';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
const {width: screenWidth} = Dimensions.get('window');
import {ProgressBar, Colors} from 'react-native-paper';
import {openFile} from '../../DashboardHome/util/fileManager';
import PickerOptionModal from '../../../components/PickerOptionsModal/PickerOptionModal';
import ImageModalSheet from '../../../components/ModalSheet/ModalSheet';
import Advertisement from '../../../components/Advertisement';

const Events = ({
  route,
  navigation,
  collegeId,
  memberid,
  priority,
  bottomSheetAction,
  versionInfo,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [singleFile, setSingleFile] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [confirmUpload, setConfirmUpload] = useState(false);
  var {Eventdata} = route?.params;
  const [totalFilesToBeUploaded, setTotalFilesToBeUploaded] = useState(0);
  const [noOffilesUploaded, setNoOfFilesUploaded] = useState(0);
  const [isUploadProgressBarVisible, setIsUploadProgressBarVisible] =
    useState(true);
  const [filesUploaded, setFilesUploaded] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isBottomModalVisible, setIsBottomModalVisible] = useState(false);
  console.log(typeof Number(versionInfo), versionInfo, 'kkk');
  const openAttachment = img => {
    setLoading(true);
    openFile(img, () => {
      setLoading(false);
    });
  };
  console.log(
    '.,.,.,.,.,.',
    modalVisible,
    isBottomModalVisible,
    isModalVisible,
    filesUploaded,
    selectedFiles,
    selectedFiles.length,
  );
  useEffect(() => {
    return () => bottomSheetAction({hideSheet: false});
  }, []);
  // useEffect(() => {
  //   if (selectedFiles.length > 0 && !modalVisible) {
  //     setModalVisible(true);
  //   }
  // }, [modalVisible, isBottomModalVisible, selectedFiles.length]);

  console.log(
    'params',
    route.params,
    route?.params?.Eventdata?.createdby,
    memberid,
  );
  const checkLengthOfSelectedFiles = () => {
    const maxCount = Number(versionInfo.eventphotoscount) + 1;
    console.log(maxCount);
    const maxExceedLength =
      selectedFiles?.length - Number(versionInfo.eventphotoscount);
    if (selectedFiles?.length < maxCount) {
      setIsModalVisible(!isModalVisible);
    } else {
      Alert.alert(
        'Limit Exceeded ! Reduce ' + maxExceedLength + ' count',
        'Maximium upload count is ' + Number(versionInfo.eventphotoscount),
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
  };
  const renderImages = item => {
    // console.log('item', item);
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image
          source={{uri: item.item}}
          onPress={() => {
            openAttachment(item.item);
          }}
          style={{
            height: screenWidth / 3,
            width: screenWidth / 3,
            borderWidth: 1,
            borderColor: Constants.WHITE_COLOR,
          }}
          PlaceholderContent={
            <ActivityIndicator color={Constants.GREEN001} size="large" />
          }
        />
      </View>
    );
  };
  const renderPreviewImages = item => {
    console.log('item', item.item);
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image
          source={{uri: item.item}}
          onPress={() => {
            openAttachment(item.item);
          }}
          style={{
            height: screenWidth / 4,
            width: screenWidth / 4,
            borderWidth: 1,
            borderColor: Constants.WHITE_COLOR,
          }}
          PlaceholderContent={
            <ActivityIndicator color={Constants.GREEN001} size="large" />
          }
        />
      </View>
    );
  };
  const selectFile = () => {
    fileSelect({
      multiple: true,
      image: true,
      onSelect: files => {
        setIsUploadProgressBarVisible(true);
        var promisesArray = [];
        const awsAmplify = new AwsAmplify(collegeId, 'circular');
        setTotalFilesToBeUploaded(files.length);
        for (var i = 0; i < files.length; i++) {
          const aPromise = new Promise((resolve, reject) => {
            awsAmplify
              .uploadFileToAwsS3(files[i].name, files[i])
              .then(url => {
                var y = previewFiles;
                y.push(url);
                setPreviewFiles(y);
                var x = filesUploaded;
                x.push({FileName: url});
                setFilesUploaded(x);
                resolve(true);
              })
              .catch(() => reject(false));
          });
          promisesArray.push(aPromise);
        }
        console.log(previewFiles);
        Promise.all(promisesArray).then(promises => {
          setIsUploadProgressBarVisible(false);
          promisesArray = promises;
          var fulfiled = 0;
          promisesArray.forEach(aPromise => {
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

 
  const handleUploadFiles = useCallback(() => {
    return new Promise((resolve, reject) => {
      setFileUploading(true);
      setIsUploadProgressBarVisible(true);
      setTotalFilesToBeUploaded(selectedFiles.length);
      const awsAmplify = new AwsAmplify(collegeId, 'assignment');
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
        .then(() => UploadToServer())
        .catch(() => {
          reject(false);
          Alert.alert('rejected');
        });
    });
  }, [
    collegeId,
    selectedFiles,
    filesUploaded,
    setFilesUploaded,
    setIsUploadProgressBarVisible,
    setTotalFilesToBeUploaded,
    setNoOfFilesUploaded,
  ]);
  const UploadToServer = () => {
    console.log(filesUploaded);
    if (filesUploaded.length !== 0) {
      const request = {
        collegeid: collegeId,
        eventheaderid: Eventdata?.eventid,
        Userid: memberid,
        FileNameArray: filesUploaded,
      };
      eventImages(request)
        .then(() => {
          setFileUploading(false);
          setModalVisible(!modalVisible);
          setFilesUploaded([]);
          setPreviewFiles([]);
          setTotalFilesToBeUploaded(0);
          setNoOfFilesUploaded(0);
          navigation.navigate('UpcomingEvents');
        })
        .catch(() => {
          setFileUploading(false);
          setModalVisible(!modalVisible);
        });
    }
  };
  const onConfirm = () => {
    if (selectedFiles?.length === 0) {
      Alert.alert('Hold on!', 'Need minimum 1 file to upload', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Ok', onPress: () => {}},
      ]);
    } else {
      Alert.alert('Hold on!', 'Are you sure you want to submit ?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'Ok', onPress: () => handleUploadFiles()},
      ]);
    }
    // console.log(filesUploaded);
    // if (filesUploaded.length !== 0) {
    //   setFileUploading(true);
    //   const request = {
    //     collegeid: collegeId,
    //     eventheaderid: Eventdata?.eventid,
    //     Userid: memberid,
    //     FileNameArray: filesUploaded,
    //   };
    //   eventImages(request)
    //     .then(() => {
    //       setFileUploading(false);
    //       setModalVisible(!modalVisible);
    //       navigation.navigate('UpcomingEvents');
    //     })
    //     .catch(() => {
    //       setFileUploading(false);
    //       setModalVisible(!modalVisible);
    //     });
    // }
  };
  const goBack = () => {
    navigation.goBack();
  };

  console.log('///////////////', modalVisible, bottomSheetAction);
  return (
    <View style={styles.container}>
      {/* <StatusBar */}
      <Header />
      <Advertisement />
      <TouchableOpacity
        onPress={goBack}
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      >
        <View style={styles.pageHeader}>
          <Icons name="arrow-left" size={16} color={Constants.WHITE_COLOR} />
          <Text style={styles.pageHeaderText}>Event Details</Text>
        </View>
      </TouchableOpacity>
      <Spinner color="#3b5998" visible={loading} size="large" />
      <ScrollView style={styles.mainContent}>
        <View style={([styles.Row], {justifyContent: 'flex-end'})}>
          {/* <Text style={styles.text}>Auditorium</Text> */}
          {memberid === Number(route?.params?.Eventdata?.createdby) &&
          route?.params?.upcoming === true ? (
            <TouchableOpacity
              style={styles.editButtonView}
              onPress={() => {
                navigation.navigate('AddEvents', {
                  Eventdata: Eventdata,
                });
                bottomSheetAction({hideSheet: true});
              }}
            >
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={{marginTop: 10, paddingRight: '30%'}}>
          <Text style={{...styles.boldText}}>{Eventdata.topic}</Text>
        </View>
        <View
          style={{
            marginTop: 10,
            backgroundColor: Constants.GREY001,
            marginHorizontal: '-5%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              alignItems: 'center',
              paddingTop: 5,
            }}
          >
            <View style={{paddingHorizontal: 15}}>
              <Icon name="location-on" size={15} style={styles.iconPlace} />
            </View>
            <View style={{width: '80%'}}>
              <Text style={([styles.text], styles.normaltext)}>
                {Eventdata.venue}
              </Text>
            </View>
          </View>
          <View style={styles.horizontalLine} />
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              alignItems: 'center',
              paddingBottom: 5,
            }}
          >
            <View style={{paddingHorizontal: 15}}>
              <Icon name="calendar-today" size={15} style={styles.iconPlace} />
            </View>
            <View>
              <Text style={([styles.text], styles.normaltext)}>
                {Eventdata.event_date}
              </Text>
            </View>
            <View style={{paddingRight: 15, paddingLeft: '10%'}}>
              <Icon name="access-time" size={15} />
            </View>
            <View>
              <Text style={([styles.text], styles.normaltext)}>
                {Eventdata.event_time}
              </Text>
            </View>
          </View>
        </View>
        <Text style={[styles.boldText, {marginVertical: 10}]}>About Event</Text>
        <View style={{minHeight: 50, maxHeight: 150}}>
          <Text style={{...styles.normaltext}}>{Eventdata.body}</Text>
        </View>
        <View style={[styles.Row, {marginVertical: 10}]}>
          <Text style={[styles.boldText]}>Gallery</Text>
          {priority !== 'p4' && priority !== 'p5' ? (
            <TouchableOpacity
              style={[
                styles.editButtonView,
                {backgroundColor: Constants.GREEN003},
              ]}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Text style={styles.editButton}>Add</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {console.log(
          ';;;;;;;;',
          modalVisible,
          isModalVisible,
          bottomSheetAction,
        )}
        {modalVisible && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            //backgroundColor={'red'}
            // onRequestClose={() => {
            //   setModalVisible(!modalVisible);
            // }}
          >
            <View style={styles.centeredView}>
              <View
                style={[
                  styles.modalView,
                  {height: previewFiles ? '50%' : '30%'},
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    selectedFiles?.length === 0
                      ? setIsBottomModalVisible(true)
                      : setIsModalVisible(modalVisible);
                    setModalVisible(false);
                  }}
                >
                  <View style={styles.uploadWrapper}>
                    <Icons name={ICON.CLOUD_UPLOAD} size={32} color="#3F6EE8" />
                    {selectedFiles?.length === 0 ? (
                      <>
                        <Text style={styles.uploadHeading}>
                          Upload your files
                        </Text>
                        <Text style={{fontSize: Constants.FONT_TEN}}>
                          Try to upload more files to see them here
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.uploadHeading}>
                          Uploaded your files
                        </Text>
                        <Text style={{fontSize: Constants.FONT_TEN}}>
                          Number of files selected : {selectedFiles?.length}
                        </Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>

                {totalFilesToBeUploaded > 0 && (
                  <>
                    {isUploadProgressBarVisible && (
                      <View style={{height: 10, width: '90%'}}>
                        <ProgressBar indeterminate color={Colors.red800} />
                      </View>
                    )}
                    <View style={styles.fileuploadInfoWrapper}>
                      <ProgressBar indeterminate color={Colors.red800} />
                      <Text>{`${noOffilesUploaded} / ${totalFilesToBeUploaded}`}</Text>
                    </View>
                  </>
                )}
                {/* {previewFiles?.length !== 0 ? (
                <FlatList
                  horizontal={false}
                  numColumns={3}
                  data={previewFiles}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderPreviewImages}
                  style={{height: 100, width: '90%'}}
                />
              ) : null} */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '90%',
                  }}
                >
                  <Button
                    style={[
                      styles.actionButton,
                      {backgroundColor: Constants.RED003},
                    ]}
                    disabled={fileUploading}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setFilesUploaded([]);
                      setPreviewFiles([]);
                      setTotalFilesToBeUploaded(0);
                      setNoOfFilesUploaded(0);
                    }}
                  >
                    <Text style={styles.buttonText}>
                      {fileUploading ? 'Uploading..' : 'Cancel'}
                    </Text>
                  </Button>
                  <Button
                    style={[
                      styles.actionButton,
                      {backgroundColor: Constants.GREEN002},
                    ]}
                    onPress={onConfirm}
                    disabled={fileUploading}
                    // disabled={
                    //   totalFilesToBeUploaded !== noOffilesUploaded ||
                    //   (totalFilesToBeUploaded === 0 && noOffilesUploaded === 0)
                    // }
                  >
                    <Text style={styles.buttonText}>
                      {fileUploading ? 'Uploading..' : 'Confirm'}
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        )}
        {Eventdata.newfilepath?.length === 0 ||
        Eventdata.newfilepath?.length === undefined ? (
          <View style={styles.noData}>
            <Text style={[styles.title, {fontFamily: FONT.primaryRegular}]}>
              No Images Uploaded for this Event
            </Text>
          </View>
        ) : null}
        {Eventdata.newfilepath?.length !== 0 ? (
          <FlatList
            horizontal={false}
            numColumns={3}
            data={Eventdata.newfilepath}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderImages}
            style={{paddingBottom: '30%'}}
          />
        ) : null}

        <PickerOptionModal
          isBottomModalVisible={isBottomModalVisible}
          setIsBottomModalVisible={setIsBottomModalVisible}
          setModalVisible={setModalVisible}
          selectFile={selectFile}
          setIsModalVisible={setIsModalVisible}
          setSelectedFiles={setSelectedFiles}
          isMultipleFile={true}
          isPDFType={false}
          isImageType={true}
        />
        {/* {isModalVisible && (
          <ImageModalSheet
            isVisible={isModalVisible}
            setIsModalVisible={!modalVisible}
            files={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            handleUploadFiles={checkLengthOfSelectedFiles}
            isMultipleFile={true}
            selectedFiles={selectedFiles}
            setIsBottomModalVisible={setIsBottomModalVisible}
          />
        )} */}
      </ScrollView>
    </View>
  );
};
const mapStatetoProps = ({app}) => ({
  collegeId: app?.maindata?.colgid,
  priority: app?.maindata?.priority,
  memberid: app?.maindata?.memberid,
  versionInfo: app?.versionInfo,
});

const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(Events);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageHeader: {
    backgroundColor: Constants.DARK_COLOR,
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '5%',
  },
  noData: {
    alignSelf: 'center',
    marginVertical: 14,
  },
  pageHeaderText: {
    color: Constants.WHITE_COLOR,
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    paddingLeft: 10,
  },
  Row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainContent: {
    padding: '5%',
  },
  Text: {
    fontFamily: FONT.primaryRegular,
  },
  text: {
    fontSize: Constants.FONT_TEN,
    color: Constants.FACULTY_HEAD_COLOR,
  },
  boldText: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_TEN,
  },
  normaltext: {
    fontSize: Constants.FONT_NINE,
    color: Constants.BLACK003,
    marginTop: 2,
  },
  horizontalLine: {
    borderWidth: 0.5,
    borderColor: Constants.WHITE_COLOR,
    width: '90%',
    alignSelf: 'center',
    marginVertical: '4%',
    marginBottom: '2%',
  },
  editButton: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_FULL_LOW,
    color: Constants.WHITE_COLOR,
  },
  editButtonView: {
    backgroundColor: Constants.FACULTY_HEAD_COLOR,
    width: '20%',
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'green',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: '30%',
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  // upload: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderStyle: 'dashed',
  //   borderRadius: 1,
  //   borderWidth: 1,
  //   borderColor: Constants.BLACK006,
  //   backgroundColor: Constants.GREY005,
  //   height: 58,
  //   width: '90%',
  //   marginVertical: 24,
  //   paddingVertical: 10,
  // },
  // uploadTitle: {
  //   fontFamily: FONT.primaryBold,
  //   fontSize: 11,
  //   lineHeight: 15,
  //   color: Constants.BLACK000,
  // },
  // uploadSubText: {
  //   fontFamily: FONT.primaryRegular,
  //   fontSize: 10,
  //   lineHeight: 14,
  //   color: Constants.GREY07B,
  // },
  uploadWrapper: {
    paddingHorizontal: 50,
    // paddingVertical: 20,
    // height: 58,
    width: '100%',
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
    fontSize: Constants.FONT_NINE,
    marginBottom: 5,
    marginTop: 15,
  },
  fileuploadInfoWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },

  textNormal: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_TEN,
    lineHeight: 17,
    color: Constants.DARK_COLOR,
  },
  actionButton: {
    height: 40,
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_ELEVEN,
    color: Constants.WHITE_COLOR,
  },
  iconPlace: {
    paddingLeft: 15,
  },
});
