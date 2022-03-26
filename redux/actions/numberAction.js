import {httpPostRequestAuth} from '../../context/Helper/Helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LOGIN_TYPE_INITIAL_DATA,
  UPCOMING_EXAMLIST,
  PAST_EXAMLIST,
  MARK_LIST,
  LEAVE_HISTORY,
  UPCOMING_EVENTS,
  PAST_EVENTS,
  ATTENDANCE_LIST,
  VIDEO_LIST,
} from '../types';
import {USER_LOGIN} from '../../context/types';

export function initialLoginType() {
  return async dispatch => {
    const Mobilenumber = await AsyncStorage.getItem('Mobilenumber');
    const Password = await AsyncStorage.getItem('Password');
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({mobilenumber: Mobilenumber, Password: Password});
    httpPostRequestAuth('LoginFromApp', raw, myHeaders)
      .then(res => {
        if (res.Message === 'Login Successfully !') {
          dispatch({
            type: LOGIN_TYPE_INITIAL_DATA,
            payload: res.data,
          });
          dispatch({
            type: USER_LOGIN,
            payload: {
              mobileNumber: Mobilenumber,
            },
          });
          // console.log('succ' + res);
        } else if (res.Status !== 1) {
          dispatch({
            type: LOGIN_TYPE_INITIAL_DATA,
            payload: res.data,
          });
          dispatch({
            type: USER_LOGIN,
            payload: {},
          });
        } else {
        }
      })
      .catch(err => console.log('err'));
  };
}

export const upcomingExams = data => dispatch => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    userid: data.memberid,
    collegeid: data.colgid,
    departmentid: data.deptid,
    sectionid: data.sectionid,
    appid: '2',
    priority: data.priority,
    type: 'upcomingexams',
  });
  httpPostRequestAuth('GetExamListByType', raw, myHeaders)
    .then(res => {
      //   console.log(res);
      if (res.Message === 'Success') {
        dispatch({
          type: UPCOMING_EXAMLIST,
          payload: res.data,
        });
        // console.log('succ' + res);
      } else if (res.Status !== 1) {
        dispatch({
          type: UPCOMING_EXAMLIST,
          payload: res.data,
        });
      } else {
        console.log('res');
      }
    })
    .catch(err => console.log('err'));
};

export const pastExams = data => dispatch => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    userid: data.memberid,
    collegeid: data.colgid,
    departmentid: data.deptid,
    sectionid: data.sectionid,
    appid: '2',
    priority: data.priority,
    type: 'pastexams',
  });
  httpPostRequestAuth('GetExamListByType', raw, myHeaders)
    .then(res => {
      //   console.log(res);
      if (res.Message === 'Success') {
        dispatch({
          type: PAST_EXAMLIST,
          payload: res.data,
        });
        // console.log('succ' + res);
      } else if (res.Status !== 1) {
        dispatch({
          type: PAST_EXAMLIST,
          payload: res.data,
        });
      } else {
        console.log('res');
      }
    })
    .catch(err => console.log('err'));
};

export const examMarkList = data => dispatch => {
  console.log(data);
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    studentid: '2142',
    examheaderid: '873',
  });
  httpPostRequestAuth('GetStudentMarkDetailsForApp', raw, myHeaders)
    .then(res => {
      // console.log(res);
      if (res.Message === 'Success') {
        dispatch({
          type: MARK_LIST,
          payload: res.data,
        });
        // console.log('succ' + res);
      } else if (res.Status !== 1) {
        dispatch({
          type: MARK_LIST,
          payload: res.data,
        });
      } else {
        console.log('res');
      }
    })
    .catch(err => console.log('err'));
};

export const pastEventTotallList = data => dispatch => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    userid: '5958',
    appid: '2',
    priority: 'p2',
    type: 'pastevents',
  });

  httpPostRequestAuth('GetEventListByType', raw, myHeaders)
    .then(res => {
      // console.log(res);
      if (res.Message === 'Success') {
        dispatch({
          type: PAST_EVENTS,
          payload: res.data,
        });
        // console.log('succ' + res);
      } else {
        console.log('res');
      }
    })
    .catch(err => console.log('err'));
};

export const upcomingEventTotallList = data => dispatch => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    userid: '5958',
    appid: '2',
    priority: 'p2',
    type: 'pastevents',
  });

  httpPostRequestAuth('GetEventListByType', raw, myHeaders)
    .then(res => {
      // console.log(res);
      if (res.Message === 'Success') {
        dispatch({
          type: UPCOMING_EVENTS,
          payload: res.data,
        });
        // console.log('succ' + res);
      } else {
        console.log('res');
      }
    })
    .catch(err => console.log('err'));
};

export const leaveHistoryListApi = data => dispatch => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({collegeid: '80', staffid: '5961'});

  httpPostRequestAuth('GetLeaveApplicationListForReceiverApp', raw, myHeaders)
    .then(res => {
      // console.log(res);
      if (res.Message === 'Success') {
        dispatch({
          type: LEAVE_HISTORY,
          payload: res.data,
        });
        // console.log('succ' + res);
      } else {
        console.log('res');
      }
    })
    .catch(err => console.log('err'));
};

export const attendanceListApi = data => dispatch => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    userid: '5411',
    attendancedate: '09/04/2021',
    sectionid: '634',
  });

  httpPostRequestAuth('getattendanceforparent', raw, myHeaders)
    .then(res => {
      // console.log(res);
      if (res.Message === 'Success') {
        dispatch({
          type: ATTENDANCE_LIST,
          payload: res.data,
        });
        // console.log('succ' + res);
      } else if (res.Status !== 1) {
        dispatch({
          type: ATTENDANCE_LIST,
          payload: res.data,
        });
      } else {
        console.log('res');
      }
    })
    .catch(err => console.log('err'));
};

export const videoListApi = (reqData, BackendResponse) => dispatch => {
  // console.log('videoScr');
  const myHeaders = new Headers();

  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    userid: reqData.memberid,
    collegeid: reqData.colgid,
    priority: reqData.priority,
  });
  httpPostRequestAuth('GetVideoList', raw, myHeaders)
    .then(res => {
      // console.log(res, 'videoScr');
      if (res.Message === 'List Received successfully.') {
        console.log("Video List",res.data)
        dispatch({
          type: VIDEO_LIST,
          payload: res.data,
        });
        BackendResponse('success');
      } else if (res.Status !== 1) {
        dispatch({
          type: VIDEO_LIST,
          payload: [],
        });
        BackendResponse('failed');
      } else {
        BackendResponse('failed');
      }
    })
    .catch(err => console.log('err'));
};
