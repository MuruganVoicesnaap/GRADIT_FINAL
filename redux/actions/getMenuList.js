import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';
import {SET_MENU_LIST} from '../types';

const {API_URL, API} = AppConfig;

const getMenuList = req => {
  return dispatch =>
    new Promise((res, rej) => {
      triggerSimpleAjax(
        `${API_URL}${API.GET_USER_MENU}`,
        'POST',
        false,
        req,
        result => {
          const {Status, Message} = result;
          if (Status === 1) {
            console.log('MenuData',result.data)
            dispatch({
              type: SET_MENU_LIST,
              payload: [...result.data],
            });
          } else {
            rej(Message || 'Something went wrong... Please try again later');
          }
        },
        e => {
          rej('Something went wrong... Please try again later');
        },
      );
    });
};

export default getMenuList;
