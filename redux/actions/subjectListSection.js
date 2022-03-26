import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const subjectListData = ({request}) => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.SUBJECT_SECTION_WISE}`,
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
