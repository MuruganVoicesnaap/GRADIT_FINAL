import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const { API_URL, API } = AppConfig;

export const getSubjectDetails = req => {
    console.log("req",req)
      return dispatch =>
        new Promise((res, rej) => {
            triggerSimpleAjax(
                `${API_URL}${API.GET_SUBJECT_DETAILS_FOR_SEM}`,
                'POST',
                false,
                req,
                result => {
                const { Status, Message, data } = result;
                    if (Status === 1) {
                        console.log("SubjectDetails", data)
                        res(data);
                    }  
                    else {
                        rej(Message || 'Something went wrong... Please try again later');
                    }
                },
                () => {
                    rej('Something went wrong... Please try again later');
                },
            );
        });
};







