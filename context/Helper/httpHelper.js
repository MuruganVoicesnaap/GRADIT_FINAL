import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConfig from '../../redux/app-config';

const timeoutDuration = 50000;

const _isEmpty = collection => {
  if (collection) {
    return collection.constructor === Object
      ? !Object.keys(collection).length > 0
      : !collection.length > 0;
  }
  return true;
};

/**
 * Common function for http call. Replacement for axios
 * @param {*} baseURL
 * @param {*} method
 * @param {*} body
 * @param {*} onSuccess
 * @param {*} onFailure
 * @param {*} customHeader
 * @param {*} requesHeaders
 * @param {*} isHandledError
 */
export default async function triggerSimpleAjax(
  requestURL,
  method = 'POST',
  isFormData = false,
  body = {},
  onSuccess,
  onFailure,
  customHeader = {},
  requesHeaders = null,
  isHandledError = false,
) {
  let headerObject = {};
  if (!isFormData) {
    headerObject = {
      'Content-Type': 'application/json',
    };
  }
  const requestBody = {
    ...body,
  };
  if (customHeader && !_isEmpty(customHeader)) {
    headerObject = {
      ...headerObject,
      ...customHeader,
    };
  }

  const countryBaseURL = await AsyncStorage.getItem('BaseUrl');
  let baseURL;
  if (countryBaseURL) {
    baseURL = requestURL.replace(
      'http://106.51.127.215:8090/',
      countryBaseURL,
    );
  } else {
    baseURL = requestURL;
  }

   console.log("testUrl",baseURL);
  const headers = headerObject;
  const requestDetails = {
    method,
    mode: 'cors',
    credentials: 'include',
    headers,
  };

  if (method !== 'GET' && !isFormData) {
    requestDetails.body = JSON.stringify(requestBody);
  }

  if (isFormData) {
    const data = new FormData();
    if (body instanceof FormData) {
      requestDetails.body = body;
    } else {
      // eslint-disable-next-line array-callback-return
      Object.keys(requestBody).map(key => {
        data.append(key, requestBody[key]);
      });
      requestDetails.body = data;
    }
  }
  // console.log('baseURL', baseURL, requestDetails);
  /**
   * This promise will start the network request and will return the data from the server
   * or throw errors in case the network request fails
   */
  const request = new Promise((resolve, reject) => {
    fetch(baseURL, requesHeaders || requestDetails)
      .then(data => {
        if (data.status === 200 || data.status === 201) {
          return data.json();
        }
        if (data.status === 400 && isHandledError) {
          return data.json().then(result => {
            return {
              ...result,
              statusCode: 400,
            };
          });
        }
        return reject(data);
      })
      .then(result => {
        if (result.Status === 1 || result.Status === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      })
      .catch(err => {
        console.log('ERROR : ',err)
        reject(err);
      });
  });

  /**
   * Will execute a reject action after the `timeoutDuration`
   * If it executes this will mark the network request as timed out
   */
  const networkTimeOut = reject => {
    return setTimeout(() => {
      const errorObject = Error(
        JSON.stringify({
          status: 'Request timed out!',
          url: baseURL,
        }),
      );
      reject(errorObject);
      
    }, timeoutDuration);
  };

  /**
   * Starts both the timeout and the network request
   * and resolves whichever executes first.
   */
  // eslint-disable-next-line no-new
  new Promise((resolve, reject) => {
    const timeoutId = networkTimeOut(reject);
    request
      .then(result => {
        clearTimeout(timeoutId);
        onSuccess(result);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        // eslint-disable-next-line no-unused-expressions
        onFailure && onFailure(error);
        console.log('ERROR 2: ',error)
        reject(error);
      });
  });
}
