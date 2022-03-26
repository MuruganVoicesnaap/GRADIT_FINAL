import React, {useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {launchCamera} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import {launchImageLibrary} from 'react-native-image-picker';

const PickerOptionModal = ({
  isBottomModalVisible,
  setIsBottomModalVisible,
  setModalVisible = () => {},
  selectFile,
  setIsModalVisible,
  setLocalPlayVideo,
  setSelectedFiles,
  setLocalAsset,
  isVideoType = false,
  isMultipleFile = false,
  isPDFType = false,
  isImageType = false,
}) => {
  const chooseGallery = async () => {
    let res;
    if (Platform.OS === 'android') {
      res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      setSelectedFiles(prevState => [...prevState, ...res]);

      setIsBottomModalVisible(false);
      setModalVisible(false);
      setIsModalVisible(false);
    } else {
      await launchImageLibrary({mediaType: 'photo'}, e => {
        console.log(e);
        setSelectedFiles(prevState => [...prevState, ...e.assets]);
        if (e?.assets) {
          setIsBottomModalVisible(false);
          setModalVisible(false);
          setIsModalVisible(false);
        }
      });
    }
  };
  const chooseDocuments = async () => {
    if (Platform.OS === 'android') {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf],
      });
      console.log('ddddddddddd', res);
      setSelectedFiles(prevState => [...prevState, ...res]);
      setIsBottomModalVisible(false);
      setModalVisible(true);

      setIsModalVisible(true);
    } else {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf],
        copyTo: 'documentDirectory',
      });
      res[0].fileName = res[0].name;
      res[0].fileSize = res[0].size;
      console.log('ddddddddddd', res);
      setSelectedFiles(prevState => [...prevState, ...res]);
      setIsBottomModalVisible(false);
      setModalVisible(true);

      setIsModalVisible(true);
    }
  };
  const chooseVideos = async () => {
    console.log('VIDEOOOOOOOOOO');
    if (Platform.OS === 'android') {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.video],
      });
      console.log(res);
      setSelectedFiles(prevState => [...prevState, ...res]);
      setIsBottomModalVisible(false);
      setModalVisible(true);
      setLocalPlayVideo(true);
    } else {
      console.log(',.,.,.,.,.,.,.,');
      await launchImageLibrary({mediaType: 'video'}, e => {
        console.log('eeeeeeeeee', e);
        setSelectedFiles(prevState => [...prevState, ...e.assets]);
        if (e?.assets) {
          setIsBottomModalVisible(false);
          setModalVisible(true);
          setLocalPlayVideo(true);
        }
      });
    }
  };

  const chooseTakePhoto = async () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
        cameraType: 'front',
        saveToPhotos: true,
      },
      includeBase64: true,
    };
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
          launchCamera(options, response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else {
              setSelectedFiles(prevState => [...prevState, ...response.assets]);
            }
          });
          setIsBottomModalVisible(false);
          setModalVisible(true);

          setIsModalVisible(true);
        } else {
          // console.log('Camera permission denied');
          Alert.alert(
            'You need to give permission to access camera otherwise app may close',
          );
        }
      } else {
        await launchCamera(options, response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else {
            console.log({response});
            console.log(',.,.,.,,.,.,.', response.assets[0].fileName);
            setSelectedFiles(prevState => [...prevState, ...response.assets]);
            if (response.assets[0].fileName) {
              setIsBottomModalVisible(!isBottomModalVisible);
              setModalVisible(true);
              setIsModalVisible(true);
            }
            setIsBottomModalVisible(!isBottomModalVisible);
            setModalVisible(true);
            setIsModalVisible(true);
          }
          console.log({response});
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };
  return (
    <View>
      <Modal
        useNativeDriver={true}
        backdropTransitionOutTiming={6}
        animationInTiming={100}
        isVisible={isBottomModalVisible}
        style={styles.modalContainer}
        animationType="slide"
        onBackdropPress={() => {
          setIsBottomModalVisible(false);
          setModalVisible(true);
        }}
      >
        {isPDFType && (
          <TouchableOpacity style={styles.listStyle} onPress={chooseDocuments}>
            <Text>Documents</Text>
          </TouchableOpacity>
        )}
        {isVideoType && (
          <TouchableOpacity style={styles.listStyle} onPress={chooseVideos}>
            <Text>Videos</Text>
          </TouchableOpacity>
        )}
        {isImageType && (
          <>
            <TouchableOpacity style={styles.listStyle} onPress={chooseGallery}>
              <Text>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listStyle}
              onPress={chooseTakePhoto}
            >
              <Text>Take a Photo</Text>
            </TouchableOpacity>
          </>
        )}
      </Modal>
    </View>
  );
};

export default PickerOptionModal;

const styles = StyleSheet.create({
  listStyle: {
    paddingVertical: 20,
    paddingLeft: 30,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    margin: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
});
