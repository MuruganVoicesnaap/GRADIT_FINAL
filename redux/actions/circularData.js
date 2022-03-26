import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const circularData = ({request = {}, isCollegeCircular = true}) => {
  request.type = isCollegeCircular ? 'collegecircular' : 'departmentcircular';
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.CIRCULAR_DATA}`,
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
