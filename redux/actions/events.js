import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const eventsdData = ({request, isUpcomingEvents = true}) => {
  request.type = isUpcomingEvents ? 'upcomingevents' : 'pastevents';
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_EVENTS_LIST}`,
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

export const addEvent = req => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.MANAGE_EVENTS}`,
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

export const eventImages = request => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.ADD_EVENT_IMAGES}`,
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
