import DeviceInfo from 'react-native-device-info';
import {SET_DEVICE_INFO} from '../../context/types';
import {Platform} from 'react-native';

const getDeviceInfo = req => {
  if (Platform.OS === 'ios') {
    return dispatch =>
      new Promise(async (res, rej) => {
        await DeviceInfo.getDeviceToken().then(deviceToken => {
          console.log(deviceToken, 'deviceToken');
          dispatch({
            type: SET_DEVICE_INFO,
            payload: {
              deviceToken,
            },
          });
        });
      });
  } else if (Platform.OS === 'android') {
    return dispatch =>
      new Promise(async (res, rej) => {
        await DeviceInfo.getAndroidId().then(deviceToken => {
          console.log(deviceToken, 'deviceToken');
          dispatch({
            type: SET_DEVICE_INFO,
            payload: {
              deviceToken,
            },
          });
        });
      });
  }
};

export default getDeviceInfo;
