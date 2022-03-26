import React, {useRef} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PDFView from 'react-native-pdf';
// import Carousel from 'react-native-snap-carousel';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../constants/constants';

const VideoModalSheet = ({
  isVisible = false,
  files = [],
  setIsModalVisible,
  setSelectedFiles,
  handleUploadFiles = () => {},
  isMultipleFile,
  setIsBottomModalVisible,
}) => {
  const pdfRef = useRef();

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedFiles([]);
  };

  const handleRemoveImage = uri => {
    const filteredImages = files.filter(img => img.uri !== uri);
    setSelectedFiles(filteredImages);
  };

  const handleAddFile = async () => {
    setIsBottomModalVisible(true);
    setIsModalVisible(false);
  };

  const handleReplace = async () => {
    setIsBottomModalVisible(true);
    setIsModalVisible(false);

    setSelectedFiles([]);
  };

  return (
    <Modal
      visible={isVisible}
      style={{flex: 1, backgroundColor: '#FFFFFF'}}
      onRequestClose={() => {
        setIsModalVisible(false);
        setSelectedFiles([]);
      }}
    >
      <TouchableOpacity onPress={handleClose}>
        <Icon
          name="close"
          size={30}
          color={'#ccc'}
          style={{alignSelf: 'flex-end', margin: 10}}
        />
      </TouchableOpacity>
      <Swiper key={files.length} style={{height: '80%'}}>
        {files.length ? (
          files.map((img, index) => (
            <View key={index} style={styles.imageBox}>
              {img?.name?.includes('pdf') ? (
                <PDFView
                  ref={pdfRef}
                  source={{uri: img.uri}}
                  onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`number of pages: ${numberOfPages}`);
                  }}
                  onPageChanged={(page, numberOfPages) => {
                    console.log(`current page: ${page}`);
                  }}
                  onError={error => {
                    console.log(error);
                  }}
                  onPressLink={uri => {
                    console.log(`Link presse: ${uri}`);
                  }}
                  style={styles.pdfView}
                />
              ) : (
                <Image
                  resizeMethod="resize"
                  resizeMode="contain"
                  source={{uri: img.uri}}
                  style={{width: '100%', height: 300}}
                />
              )}
              <TouchableOpacity
                activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
                style={styles.removeBtn}
                onPress={() => handleRemoveImage(img?.uri)}
              >
                <Text style={styles.remoTxt}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View
            style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}
          >
            <Text
              style={{
                fontFamily: FONT.primaryRegular,
                color: Constants.BLACK000,
              }}
            >
              No files selected
            </Text>
          </View>
        )}
      </Swiper>
      {files.length ? (
        <TouchableOpacity
          onPress={isMultipleFile ? handleAddFile : handleReplace}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
          style={[
            styles.uploadBtn,
            {backgroundColor: Constants.SKY_BLUE_COLOR},
          ]}
        >
          <Text
            style={{
              color: Constants.WHITE_COLOR,
              fontFamily: FONT.primaryRegular,
            }}
          >
            {isMultipleFile ? 'Add' : 'Replace'}
          </Text>
        </TouchableOpacity>
      ) : null}

      {files.length ? (
        <TouchableOpacity
          onPress={handleUploadFiles}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
          style={styles.uploadBtn}
        >
          <Text
            style={{
              color: Constants.WHITE_COLOR,
              fontFamily: FONT.primaryRegular,
            }}
          >
            Upload Files
          </Text>
        </TouchableOpacity>
      ) : null}
    </Modal>
  );
};

export default VideoModalSheet;

const styles = StyleSheet.create({
  remoTxt: {
    textAlign: 'center',
    fontFamily: FONT.primaryRegular,
    color: Constants.BLACK000,
  },
  pdfView: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  uploadBtn: {
    backgroundColor: 'green',
    paddingVertical: 12,
    width: '90%',
    borderRadius: 4,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 5,
  },
  removeBtn: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    width: '90%',
    borderRadius: 4,
    marginTop: 5,
    marginBottom: 5,
  },
  imageBox: {
    justifyContent: 'center',
    height: 500,
    flex: 1,
    alignItems: 'center',
  },
});
