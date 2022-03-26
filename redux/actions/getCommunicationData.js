import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const getCommunicationData = ({request = {}, isUnReadData = false}) => {
  const req = {
    readtype: isUnReadData ? 0 : 1,
    ...request,
  };
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.COMMUNICATION_DATA}`,
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
