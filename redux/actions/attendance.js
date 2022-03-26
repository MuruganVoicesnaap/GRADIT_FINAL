import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const attendanceData = req => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_ATTENDANCE_FOR_PARENT}`,
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

export const subjectListAPi = req => {
  console.log('sub_request',req)

  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_SUBJECT_LIST_FOR_STAFF}`,
      'POST',
      false,
      req,
      result => {
        console.log('respons_sunjects',result)
        resolve(result);
      },
      result => {
        reject(result);
      },
    ),
  );
};

export const leaveHistoryApi = req => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_LEAVE_HISTORY_RECEPIENT}`,
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

export const leaveHistorySenderApi = req => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_LEAVE_HISTORY_SENDER}`,
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

export const leaveApproveApi = req => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_APPROVE_LEAVE}`,
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
export const leaveApplicatioTypenApi = ({request}) => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_LEAVE_TYPE}`,
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

export const leaveApplicationApi = req => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_LEAVE_APPLY_STUDENT}`,
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

export const markAttendanceApi = req => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.SET_ATTENDANCE_FOR_STUDENTS}`,
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

export const checkAttendanceApi = req => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.CHECK_ATTENDANCE_MARKING}`,
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

export const editAttendanceApi = req => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.EDIT_ATTENDANCE_MARKING}`,
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
