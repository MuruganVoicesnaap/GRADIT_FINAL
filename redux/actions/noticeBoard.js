import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const addNoticeApi = req => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.NOTICEBOARD_ENTIRE_COLLEGE_ADD}`,
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

export const noticeBoardData = ({request, isCollegeCircular = true}) => {
  request.type = isCollegeCircular ? 'collegenotice' : 'departmentnotice';
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.NOTICEBOARD_DATA}`,
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
