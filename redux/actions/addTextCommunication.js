import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const addTextCommunication = ({
  request = {},
  isEntireCollege = true,
}) => {
  const req = {
    filetype: 1,
    ...request,
  };
  const url = isEntireCollege
    ? API.ADD_TEXT_COMMUNICATION_ENTIRE_COLLEGE
    : API.ADD_TEXT_COMMUNICATION_PARTICULAR;
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${url}`,
      'POST',
      false,
      req,
      result => {
        resolve(result);
      },
      result => {
        reject(result);
      },
    ),
  );
};

export const deleteText = request => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.DELETE_TEXT}`,
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
