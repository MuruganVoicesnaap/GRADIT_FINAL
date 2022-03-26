import AsyncStorage from '@react-native-async-storage/async-storage';
import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';
const {API_URL, API} = AppConfig;

export const getAdvertisement = req => {
  //debugger;
  return new Promise((res, rej) => {
    AsyncStorage.getItem('previous_add_id').then(previous_add_id => {
      // let previevAd = previous_add_id + 1;
      const request = {
        ...req,
        previous_add_id: previous_add_id || 0,
      };
      triggerSimpleAjax(
        `${API_URL}${API.GET_ADS}`,
        'POST',
        false,
        request,
        response => {
          const {Status, data} = response;
          if (Status === 1) {
            res(data[0]);
            console.log(data, data[0].add_id);
            AsyncStorage.setItem('previous_add_id', data[0].add_id);
          }
          rej({});
        },
        e => {
          rej({});
        },
      );
    });
  });
};

export const triggerAddClick = req => {
  console.log(req);
  //debugger;
  return new Promise((res, rej) => {
    triggerSimpleAjax(
      `${API_URL}${API.ADS_CLICK}`,
      'POST',
      false,
      req,
      response => {
        const {Status, Message, data} = response;
        console.log(response);
        res({});
      },
      e => {
        rej({});
      },
    );
  });
};
