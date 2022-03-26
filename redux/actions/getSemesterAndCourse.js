import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const { API_URL, API } = AppConfig;

export const getSemesterAndCourse = req => {

    console.log('SemRequest',req)

      return dispatch =>
        new Promise((res, rej) => {
            triggerSimpleAjax(
                `${API_URL}${API.GET_SEMESTER_LIST_FOR_COURSE}`,
                'POST',
                false,
                req,
                result => {

                    const { Message,Status, data } = result;
                    if (Status === 1) {
                        console.log("GETSEMESTER", data)
                        res(data);
                    }  
                    else {
                        rej(Message || 'Something went wrong... Please try again later');
                    }
                },
                () => {
                    rej('Something went wrong... Please ');
                },
            );
        });
};

export const getCreditListForSingleSem = req => {
    console.log('SingleSemRequest :',req)

    return dispatch =>
      new Promise((res, rej) => {
          triggerSimpleAjax(
              `${API_URL}${API.GET_SEM_STUDENT_CREDIT}`,
              'POST',
              false,
              req,
              result => {
                
                  res(result);

                 
              },
              () => {
                  rej('Something went wrong... Please ');
              },
          );
      });
};
export const getCreditListForAllSemester = req => {
    console.log('SemesterCreditALLRequest :',req)

    return dispatch =>
      new Promise((res, rej) => {
          triggerSimpleAjax(
              `${API_URL}${API.GET_SEM_ALL_CREDIT}`,
              'POST',
              false,
              req,
              result => {
                res(result);

                
              },
              () => {
                  rej('Something went wrong... Please ');
              },
          );
      });
};


export const getCategorylist = req => {
    console.log('Category',req)

    return dispatch =>
      new Promise((res, rej) => {
          triggerSimpleAjax(
              `${API_URL}${API.GET_CATEGORY_LIST}`,
              'POST',
              false,
              req,
              result => {
                  const { Message,Status, data } = result;
                  if (Status === 1) {
                      console.log("GetCategory", data)
                      res(data);
                  }  
                  else {
                    // res(data);

                      rej(Message || 'Something went wrong... Please try again later');
                  }
              },
              () => {
                  rej('Something went wrong... Please ');
              },
          );
      });
};


export const getCategoryCreditsList = req => {
    console.log('CategoryCreditRequest :',req)

    return dispatch =>
      new Promise((res, rej) => {
          triggerSimpleAjax(
              `${API_URL}${API.GET_CATEGORY_STUDENT_CREDIT}`,
              'POST',
              false,
              req,
              result => {

                res(result);

                  
              },
              () => {
                  rej('Something went wrong... Please ');
              },
          );
      });
};







