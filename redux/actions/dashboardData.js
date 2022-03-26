import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';
import {DASHBOARD_DATA} from '../types';

const {API_URL, API} = AppConfig;

export const dashboardData = data => dispatch => {

  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.DASHBOARD_DATA}`,
      'POST',
      false,
      data,
      result => {
       
        console.log("DashboardData",result.data)
        dispatch({
          type: DASHBOARD_DATA,
          payload: {data: result.data, error: false || [], loading: false},
        });
        resolve(result);
      },
      result => {
        console.log("DashboardData",'Error')

        dispatch({
          type: DASHBOARD_DATA,
          payload: {
            error: true,
            loading: false,
          },
        });
        reject(result);
      },
    ),
  );
};

export const updateFCMToken = data => dispatch => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.UPDATE_FCM_TOKEN}`,
      'POST',
      false,
      data,
      result => {
        resolve(result);
      },
      result => {
        reject(result);
      },
    ),
  );
};
