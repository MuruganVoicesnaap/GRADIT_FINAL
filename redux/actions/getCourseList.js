import triggerSimpleAjax from '../../context/Helper/httpHelper';
import {STORE_COURSE_DATA} from '../../context/types';
import {STORE_DIVISION_DATA} from '../../context/types';
import {STORE_DEPARTMENT_DATA} from '../../context/types';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const getDivisionList = req => {
  console.log('testDIvisionRequest',req);

  return dispatch =>
    new Promise((res, rej) => {
      triggerSimpleAjax(
        `${API_URL}${API.DIVISION_LIST}`,
        'POST',
        false,
        req,
        data => {
          const {Status, Message} = data;
          if (Status === 1) {
            dispatch({
              type: STORE_DIVISION_DATA,
              payload: [...data.data],
            });
            res(data);
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

export const getDepartmentByDivisionList = req => {
  console.log('testDepart',req);

  return dispatch =>
    new Promise((res, rej) => {
      triggerSimpleAjax(
        `${API_URL}${API.DEPARTMENT_DIV_LIST}`,
        'POST',
        false,
        req,
        data => {
          const {Status, Message} = data;
          if (Status === 1) {
            console.log('ReaponseDepert',data);
            dispatch({
              type: STORE_DEPARTMENT_DATA,
              payload: [...data.data],
            });
            res(data);
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
export const getCourseList = req => {
  console.log('testCourseReq',req);

  return dispatch =>
    new Promise((res, rej) => {
      triggerSimpleAjax(
        `${API_URL}${API.GET_COURSE_DEPARTMENT}`,
        'POST',
        false,
        req,
        data => {
          const {Status, Message} = data;
          if (Status === 1) {

            console.log('testCourseResponse',data);
            dispatch({
              type: STORE_COURSE_DATA,
              payload: [...data.data],
            });
            res(data);
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

export const getYearAndSections = ({request}) => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.YEAR_SECTION_LIST}`,
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

export const getYearList = (request) => {

  console.log('getYearList',request);
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_YEAR_LIST}`,
      'POST',
      false,
      request,
      result => {
        console.log('testYear',result);
        resolve(result);
      },
      result => {
        reject(result);
      },
    ),
  );
};

export const getSemAndSubList = ({request}) => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_SEM_AND_SECTIONS}`,
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

