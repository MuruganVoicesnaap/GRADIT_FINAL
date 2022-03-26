import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export const openCamera = setSourcePath => {
  const options = {
    storageOptions: {
      path: 'images',
      mediaType: 'photo',
      cameraType: 'front',
      saveToPhotos: true,
    },
    includeBase64: true,
  };
  launchCamera(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      return () => setSourcePath(response);
    }
  });
};
