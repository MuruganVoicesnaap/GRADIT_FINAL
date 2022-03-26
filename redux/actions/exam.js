import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const examdData = ({request, priority, isUpcomingExam = true}) => {
  request.type = isUpcomingExam ? 'upcomingexams' : 'pastexams';
  const priCheck = priority === 'p4' || priority === 'p5';
  const url = !priCheck ? API.GET_EXAM_LIST_SENDER : API.GET_EXAM_LIST;
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${url}`,
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

export const createExamDetails = req => {
  console.log('exam req....', {reqData: JSON.stringify(req)});
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.EXAM_CREATE}`,
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

export const getExamMarks = ({request}) => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_STUDENTS_MARKS}`,
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

export const examDetails = request => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_EXAM_DETAILS}`,
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

export const subjectListForExamEdit = request => {
  // debugger;
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.GET_SUBJECTS_EXAM_EDIT}`,
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

export const sectionWiseForExamEdit = request => {
  //debugger;
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.EDIT_DELETE_EXAM_API}`,
      'POST',
      false,
      request,
      result => {
       // debugger;
        resolve(result);
      },
      result => {
        //debugger;
        reject(result);
      },
    ),
  );
};

export const addSectionForExamEdit = request => {
  //debugger;
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${API.ADD_EXAM_API}`,
      'POST',
      false,
      request,
      result => {
        //debugger;
        resolve(result);
      },
      result => {
        reject(result);
      },
    ),
  );
};
