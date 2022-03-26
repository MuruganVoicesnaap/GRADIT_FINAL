import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const appReadStatus = req => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.APP_READ_STATUS}`,
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
