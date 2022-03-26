import AsyncStorage from '@react-native-async-storage/async-storage';
import triggerSimpleAjax from '../../context/Helper/httpHelper';
import {USER_LOGIN, USER_LOGOUT} from '../../context/types';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const checkAuthentication = () => {
  return dispatch => {
    AsyncStorage.getItem('Mobilenumber').then(res => {
      if (res) {
        console.log(res);
        dispatch({
          type: USER_LOGIN,
          payload: {
            mobileNumber: res,
          },
        });
      } else {
        dispatch({
          type: USER_LOGOUT,
        });
      }
    });
  };
};

export const triggerLogin = req => {
  console.log('LoginApi',API_URL);
  console.log('LoginRequest',req);

  return dispatch =>
    new Promise((res, rej) => {
      console.log(API_URL);
      triggerSimpleAjax(
        `${API_URL}${API.LOGIN_AUTH}`,
        'POST',
        false,
        req,
        data => {
          const {Status, Message} = data;
          if (Status === 1) {
            AsyncStorage.setItem('Password', req.Password);
            AsyncStorage.setItem('Mobilenumber', req.mobilenumber);

            dispatch({
              type: USER_LOGIN,
              payload: {
                ...data,
                mobileNumber: req.mobileNumber,
              },
            });
            res(data);
            console.log('LoginResponse',data);
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

export const triggerForgotPassword = req => {
  return new Promise((res, rej) => {
    triggerSimpleAjax(
      `${API_URL}${API.SEND_OTP}`,
      'POST',
      false,
      req,
      response => {
        const {Status, Message, data} = response;
        console.log(data,'nhvj')
        if (Status === 1) {
          res({
            data,
            msg: Message,
            //otp: data[0].otp,

          });
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

export const verifyOtp = req => {
  return new Promise((res, rej) => {
    triggerSimpleAjax(
      `${API_URL}${API.VERIFY_OTP}`,
      'POST',
      false,
      req,
      response => {
        const {Status, Message} = response;
        if (Status === 1) {
          res(true);
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

export const resetPassword = req => {
  return new Promise((res, rej) => {
    triggerSimpleAjax(
      `${API_URL}${API.PASSWORD_RESET}`,
      'POST',
      false,
      req,
      response => {
        const {Status, Message} = response;
        if (Status === 1) {
          res(Message);
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

export const changePassword = req => {
  return new Promise((res, rej) => {
    console.log(req);
    triggerSimpleAjax(
      `${API_URL}${API.CHANGE_PASSWORD}`,
      'POST',
      false,
      req,
      response => {
        console.log(API_URL, API.CHANGE_PASSWORD);
        const {Status, Message} = response;
        if (Status === 1) {
          res(Message);
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

export const logOut = () => {
  // let key = ('Password', 'Mobilenumber', 'previous_add_id');
  return async dispatch => {
    // await AsyncStorage.removeItem('BaseUrl');
    await AsyncStorage.removeItem('Password');
    await AsyncStorage.removeItem('Mobilenumber').then(res => {
      dispatch({
        type: USER_LOGOUT,
      });
    });
    await AsyncStorage.getAllKeys().then(res => {
      console.log('resKey', res);
    });
  };
};
