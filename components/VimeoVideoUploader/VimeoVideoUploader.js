/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Modal} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {launchImageLibrary} from 'react-native-image-picker';
import {connect} from 'react-redux';

import {setBottomSheetData} from '../../redux/actions/setBottomSheetData';
import {bindActionCreators} from 'redux';
import {Constants} from '../../constants/constants';
import Vimeo from './vimeoCustom';
import {useNavigation} from '@react-navigation/native';
import VideoLocalPlay from '../../screen/App/Video/VideoLocalPlay';

const VimeoVideoUploader = ({route, onVideoCompleteUrl, bottomSheetAction}) => {
  const [vimeoClient, setVimeoClient] = useState(null);
  const [currentlyUploadingFilesStatus, setCurrentlyUploadingFilesStatus] =
    useState(null);
  const [localAsset, setLocalAsset] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    startVimeoClient();
  }, []);

  const startVimeoClient = () => {
    const client = new Vimeo();
    client.generateClientCredentials('public', function () {
      setVimeoClient(client);
    });
  };
  const handleUploadButtonPress = () => {
    launchImageLibrary(
      {
        mediaType: 'video',
        selectionLimit: 1,
      },
      res => {
        if (res.didCancel) {
          return;
        }
        const {assets} = res;
        const asset = assets[0];
        console.log(asset, 'error', assets);
        setLocalAsset(asset);
        // bottomSheetAction({hideSheet: true});
        // navigation.navigate('VideoLocalPlay', {video: asset});
        // setCurrentlyUploadingFilesStatus({
        //   fileName: asset.fileName,
        //   fileSize: asset.fileSize,
        //   uploadCompleteInBytes: 0,
        //   status: 'inprogress', //inprogress, error or complete
        //   videoUrl: '',
        // });
        // vimeoClient.upload(
        //   asset,
        //   asset.fileSize,
        //   function (x) {
        //     setCurrentlyUploadingFilesStatus({
        //       ...currentlyUploadingFilesStatus,
        //       videoUrl: x,
        //       status: 'complete',
        //     });
        //     onVideoCompleteUrl(x); // console.log(x);
        //   },
        //   function (bytesUploaded, bytesTotal) {
        //     // console.log(currentlyUploadingFilesStatus);
        //     // console.log(`${bytesUploaded}/${bytesTotal}`);
        //     setCurrentlyUploadingFilesStatus({
        //       ...currentlyUploadingFilesStatus,
        //       uploadCompleteInBytes: bytesUploaded,
        //       fileSize: bytesTotal,
        //     });
        //   },
        //   function (x) {
        //     setCurrentlyUploadingFilesStatus({
        //       ...currentlyUploadingFilesStatus,
        //       videoUrl: '',
        //       status: 'error',
        //       uploadCompleteInBytes: 0,
        //     });

        //     // console.log(x, 'error');
        //   },
        // );
      },
    );
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.uploadButtonWrapper}
        onPress={() => handleUploadButtonPress()}
      >
        <Modal>
          <VideoLocalPlay />
        </Modal>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            style={{width: 24, alignSelf: 'baseline', marginTop: 5}}
            source={require('../../assests/images/upload.png')}
          />
          <View style={{paddingHorizontal: 15}}>
            <Text style={{fontWeight: Constants.FONT_WEI_BOLD}}>
              Upload Video
            </Text>
            <Text>Upload More files to see them here</Text>
          </View>
        </View>
      </TouchableOpacity>
      {currentlyUploadingFilesStatus !== null &&
        currentlyUploadingFilesStatus.status !== 'error' && (
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
            {currentlyUploadingFilesStatus.status !== 'complete' ? (
              <Image
                style={{height: 50, width: 50}}
                source={require('../../assests/images/BeanEater.gif')}
              />
            ) : (
              <View>
                <Text>File Url : {currentlyUploadingFilesStatus.videoUrl}</Text>
              </View>
            )}
          </View>
        )}
    </View>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(VimeoVideoUploader);

const styles = StyleSheet.create({
  uploadButtonWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    height: 60,
    padding: 16,
    margin: 5,
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderColor: Constants.TEXT_INPUT_COLOR,
  },
});
