import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const notificationData = ({request = {}}) => {
  console.log('notifff', request);
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_NOTIFICATION_IN_APP}`,
      'POST',
      false,
      request,
      result => {
          console.log(result);
        resolve(result);
      },
      result => {
          console.log(result);
        reject(result);
      },
    ),
  );
};
