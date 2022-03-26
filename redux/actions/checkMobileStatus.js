import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CHECK_MOBILE_STATUS} from '../../context/types';

export const checkMobileStatus = req => {
  console.log('reqqqqq', req);
  const {API_URL, API} = AppConfig;
  return dispatch =>
    new Promise((res, rej) => {
      triggerSimpleAjax(
        `${API_URL}${API.CHECK_MOBILE_STATUS}`,
        // /api/AppDetailsBal/getmobilenumberstatus
        'POST',
        false,
        req,
        response => {
          const {Status, Message, data} = response;
          console.log(
            'status,,,,,',
            Status,
            Message,
            typeof data[0].isforgotpwd,
          );
          if (data[0].isforgotpwd === '1') {
            console.log('response');
            dispatch({
              type: CHECK_MOBILE_STATUS,
              payload: 'Otp_Requested',
            });
            res(response);
            console.log(response);
          } else {
            rej(Message || 'Something went wrong... Please try again later');
          }
        },
        () => {
          rej('Something went wrong... Please try again later');
        },
      );
    });
};

export default checkMobileStatus;
