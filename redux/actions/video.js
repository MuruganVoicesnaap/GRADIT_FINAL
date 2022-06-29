import triggerSimpleAjax from '../../context/Helper/httpHelper';
import {VIDEO_RESTRICTIONS} from '../../context/types';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const addVideo = ({request = {}, isEntireCollege = true,subjectType}) => {

  console.log('v sub',subjectType)
  const url = isEntireCollege
    ? API.SENT_VIDEO_ENTIRE_COLLEGE
    : subjectType =='Subject'? API.SENT_VIDEO_PARTICULAR : API.SENT_VIDEO_PARTICULAR_TUTOR;
  return new Promise((res, rej) => {
    triggerSimpleAjax(
      `${API_URL}${url}`,
      'POST',
      false,
      request,
      response => {
        const {Status, Message} = response;
        if (Status === 1) {
          res(Message);
        } else {
          rej(Message || 'Something went wrong... Please try again later');
        }
      },
      e => {
        rej('Something went wrong... Please try again later');
      },
    );
  });
};

export const restrictions = req => {
  return dispatch => {
    return new Promise((res, rej) => {
      triggerSimpleAjax(
        `${API_URL}${API.VIDEO_CONTENT_RESTRICTION}`,
        'POST',
        false,
        req,
        response => {
          const {Status, Message, data} = response;
          if (Status === 1) {
            dispatch({
              type: VIDEO_RESTRICTIONS,
              payload: data,
            });
            res(Message);
          } else {
            rej(Message || 'Something went wrong... Please try again later');
            dispatch({
              type: VIDEO_RESTRICTIONS,
              payload: data,
            });
          }
        },
        () => {
          rej('Something went wrong... Please try again later');
        },
      );
    });
  };
};

export const videoListApi = ({request}) => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_VIDEO_LIST}`,
      'POST',
      false,
      request,
      result => {
        resolve(result);
      },
      result => {
        reject(result);
      },
    ),
  );
};
