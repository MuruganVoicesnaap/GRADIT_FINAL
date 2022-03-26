import triggerSimpleAjax from '../../context/Helper/httpHelper';
import { STORE_COURSE_DATA } from '../../context/types';
import AppConfig from '../app-config';

const { API_URL, API } = AppConfig;

export const getProfile = req => {

    console.log("ID",req)
    return dispatch =>
      new Promise((res, rej) => {
        console.log(API_URL);
        triggerSimpleAjax(
          `${API_URL}GetProfileDetails?id=${req}`,
          'GET',
          false,
          '',
          response => {
            const {Status, Message, data} = response;
            if (Status === 1) {
              res(data);
              console.log("Profile_data",response);
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





