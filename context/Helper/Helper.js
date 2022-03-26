//const baseUrl = 'http://106.51.127.215:8090/api/AppDetailsBal/';  //testing
//const baseUrl= 'http://202.21.35.131:8091/api/AppDetailsBal/'; //live testing db
const baseUrl = 'https://gradit.voicesnap.com/api/AppDetailsBal/';  //live
const httpPostRequestAuth = (url, credentials, myHeaders) => {
  const requestBody = {
    method: 'POST',
    headers: myHeaders,
    body: credentials,
  };
  // console.log(baseUrl + url);
  return new Promise((resolve, reject) => {
    fetch(baseUrl + url, requestBody)
      .then(responseJson => {
        resolve(responseJson.json());
      })
      .catch(error => {
        reject(error);
      });
  });
};

const httpPostRequest = (url, credentials) => {
  const requestBody = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: credentials,
  };

  return new Promise((resolve, reject) => {
    fetch(baseUrl + url, requestBody)
      .then(responseJson => {
        resolve(responseJson.json());
      })
      .catch(error => {
        reject(error);
      });
  });
};

export {httpPostRequest, httpPostRequestAuth};
