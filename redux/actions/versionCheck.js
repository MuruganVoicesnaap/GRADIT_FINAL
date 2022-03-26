import React, {useState, useEffect} from 'react';
import triggerSimpleAjax from '../../context/Helper/httpHelper';
import {SET_VERSOIN_INFO} from '../../context/types';
import AppConfig from '../app-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {API_URL} = AppConfig;
export const versionCheckApi = () => {
  let appVersion = AppConfig.VERSION_CODE; //change this ApiCurrent Version
  return dispatch =>
    new Promise((res, rej) => {
      console.log(API_URL);
      triggerSimpleAjax(
        `${API_URL}VersionCheck?versionID=${appVersion}`,
        'GET',
        false,
        '',
        response => {
          const {Status, Message, data} = response;
          if (Status === 1) {
            dispatch({
              type: SET_VERSOIN_INFO,
              payload: data[0],
            });
            res(response);
            console.log(response);
          } else {
            rej(Message || 'Something went wrong... Please try again later');
          }
        },
        () => {
          rej('Something went wrong... Please try again later');
        },
      );
    });
};
export default versionCheckApi;
