import React, {useRef} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Modal} from 'react-native-paper';
import PDFView from 'react-native-pdf';
// import Carousel from 'react-native-snap-carousel';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../constants/constants';

const ImageModalSheet = ({
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
    // const res = await DocumentPicker.pickMultiple({
    //   type: [DocumentPicker.types.images],
    // });
    // setSelectedFiles(prevState => [...prevState, res]);
  };

  const handleReplace = async () => {
    setIsBottomModalVisible(true);
    setIsModalVisible(false);
    // let res;
    // if (files[0]?.name?.includes('pdf')) {
    //   res = await DocumentPicker.pickMultiple({
    //     type: [DocumentPicker.types.pdf],
    //   });
    // } else {
    //   res = await DocumentPicker.pickMultiple({
    //     type: [DocumentPicker.types.images],
    //   });
    // }
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
      <View
        style={{
          height: '80%',
          width: '80%',
          alignSelf: 'center',
          bottom: 20,
        }}
      >
        <Swiper key={files.length}>
          {files.length ? (
            files.map((img, index) => (
              <View key={index} style={styles.imageBox}>
                {img?.name?.includes('pdf') ? (
                  <View
                    style={{
                      height: '70%',
                      width: '80%',
                      alignItems: 'center',
                      bottom: 10,
                    }}
                  >
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
                  </View>
                ) : (
                  <View
                    style={{
                      height: '70%',
                      width: '80%',
                      alignItems: 'center',
                      bottom: 10,
                    }}
                  >
                    <Image
                      resizeMethod="resize"
                      resizeMode="contain"
                      source={{uri: img.uri}}
                      style={styles.imageView}
                    />
                  </View>
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
      </View>

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

export default ImageModalSheet;

const styles = StyleSheet.create({
  remoTxt: {
    textAlign: 'center',
    fontFamily: FONT.primaryRegular,
    color: Constants.BLACK000,
    //paddingVertical: 10,
  },
  pdfView: {
    // flex: 1,
    width: Dimensions.get('window').width,
    height: 530,

    // backgroundColor:'red'
  },
  imageView: {
    width: Dimensions.get('window').width,
    height: 450,
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
    position: 'absolute',
    bottom: 30,
  },
  imageBox: {
    // justifyContent: 'center',
    height: Dimensions.get('window').height,
    flex: 1,
    alignItems: 'center',
    bottom: 10,
    // backgroundColor:'red'
  },
});
