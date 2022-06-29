import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const addCircular = ({request = {}, isEntireCollege = true,subjectType}) => {
  const url = isEntireCollege
    ? API.ADD_CIRCULAR_ENTIRE_COLLEGE
    : subjectType == 'Subject'? API.ADD_CIRCULAR_PARTICULAR_TYPE : API.ADD_CIRCULAR_PARTICULAR_TYPE_TUTOR;
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${url}`,
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

export const deleteCircular = request => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.DELETE_CIRCULAR}`,
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
