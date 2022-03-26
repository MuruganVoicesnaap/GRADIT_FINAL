import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../../../components/Header/Header';
import VimeoVideoUploader from '../../../components/VimeoVideoUploader/VimeoVideoUploader';
import RecepientSelector from '../../../components/RecepientSelector/RecepientSelector';
import {Constants} from '../../../constants/constants';
import Advertisement from '../../../components/Advertisement';

const VideoUploadScreen = ({route}) => {
  const videoDescriptionMaxLength = 460;
  const titleMaxLength = 100;
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [recepientSelectorVisibility, setRecepientSelectorVisibility] =
    useState(false);

  const handleVideoTitleChange = text => {
    setVideoTitle(text);
  };

  const handleVideoDescriptionChange = text => {
    setVideoDescription(text);
  };

  return (
    <SafeAreaView>
      <Header />
      <Advertisement />
      <ScrollView style={styles.scrollview}>
        <View style={styles.textInputWrapper}>
          <Text style={styles.textInputTitle}>Title</Text>
          <TextInput
            placeholder="Enter the title"
            placeholderTextColor={Constants.TEXT_INPUT_COLOR}
            maxLength={titleMaxLength}
            onChangeText={text => handleVideoTitleChange(text)}
            style={{
              borderStyle: 'solid',
              borderBottomWidth: 1,
              borderColor: Constants.GREY004,
            }}
          />
        </View>
        <View style={styles.textInputWrapper}>
          <Text>Description</Text>
          <TextInput
            multiline
            placeholder="Enter the title"
            maxLength={videoDescriptionMaxLength}
            onChangeText={text => handleVideoDescriptionChange(text)}
            placeholderTextColor={Constants.TEXT_INPUT_COLOR}
            style={{
              borderWidth: 0,
              height: 110,
              textAlignVertical: 'top',
            }}
          />
          <View style={{display: 'flex', alignItems: 'flex-end'}}>
            <Text style={{color: Constants.TEXT_INPUT_COLOR}}>
              {videoDescription.length}/{videoDescriptionMaxLength}
            </Text>
          </View>
        </View>
        <VimeoVideoUploader />
        <View style={{display: 'flex', flexDirection: 'row-reverse'}}>
          <TouchableOpacity
            // style={{width: 100, height: 50, backgroundColor: 'red'}}
            onPress={() => {
              setRecepientSelectorVisibility(true);
            }}
          >
            <Text>Click Here To Add Recepients</Text>
          </TouchableOpacity>
        </View>
        <RecepientSelector
          isVisible={recepientSelectorVisibility}
          onHide={() => setRecepientSelectorVisibility(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default VideoUploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },
  scrollview: {
    paddingHorizontal: 25,
  },
  textInputWrapper: {
    marginTop: 10,
  },
  textInputTitle: {
    fontWeight: Constants.FONT_WEI_BOLD,
  },
});
