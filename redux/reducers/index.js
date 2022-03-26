import {
  SET_DEVICE_INFO,
  STORE_COURSE_DATA,
  STORE_DIVISION_DATA,
  STORE_DEPARTMENT_DATA,
  EXAM_CREATION_LIST,
  SET_VERSOIN_INFO,
  CHECK_MOBILE_STATUS,
  REMOVE_EXAM_CREATION_LIST,
  INIT_EXAM_CREATION_LIST,
} from '../../context/types';
import {
  LOGIN_TYPE_INITIAL_DATA,
  READ_COMMUNICATION,
  UNREAD_COMMUNICATION,
  SET_MAIN_DATA,
  UPCOMING_EXAMLIST,
  PAST_EXAMLIST,
  MARK_LIST,
  COLLEGE_NOTICECARD,
  DEPARTMENT_NOTICECARD,
  FACULTY_LIST,
  LEAVE_HISTORY,
  ATTENDANCE_LIST,
  VIDEO_LIST,
  VIDEO_RESTRICTIONS,
  ADD_CIRCULARCARD,
  ADD_NOTICEBOARD,
  DASHBOARD_DATA,
  USER_LOGIN,
  USER_LOGOUT,
  BOTTOM_SHEET_DATA,
  SET_MENU_LIST,
  SEARCH_VALUE,
} from '../types';

const initialState = {
  maindata: {},
  isAuthenticated: false,
  userDetails: {},
  deviceInfo: {},
  versionInfo: {},
  courseData: [],
  divisionData:[],
  departmentData:[],
  menuList: [],
  isOtpRequested: '',
  loginTypeList: [
    // {
    //   colgid: 53,
    //   memberid: 5971,
    //   priority: 'p5',
    //   membername: 'Student1',
    //   colgname: 'Voicesnap First College, chennai',
    //   colgcity: 'hello fine',
    //   colglogo: 'http://grad.voicesnap.com/Files',
    //   courseid: '84',
    //   coursename: 'BL',
    //   deptid: '91',
    //   deptname: 'Law',
    //   yearid: '222',
    //   yearname: 'Year 1',
    //   sectionid: '179',
    //   sectionname: 'Morning',
    //   semesterid: '783',
    //   semestername: 'Semester 1',
    //   loginas: 'Student / Parent',
    // },
  ],
  unReadCommunicationData: [],
  readCommunicationData: [],
  markData: [],
  ExamCreateData: [],
  facultyList: [
    // {
    //   memberid: '5958',
    //   staffname: 'Principal',
    //   subjectname: 'Science',
    //   subjectcode: '101',
    //   stafftype: 'Principal',
    //   facultyphoto:
    //     'https://college-app-files.s3.amazonaws.com/80/12-04-2021/File_20210412094855_IMG_20210412_094828_2209072349602096881.jpg',
    // },
  ],

  leaveHistory: [
    // {
    //   createdon: '13 Apr 2021',
    //   applicationid: '170',
    //   leaveapplicationtype: 'SickLeave',
    //   leavefromdate: '13 Apr 2021',
    //   leavetodate: '15 Apr 2021',
    //   numofdays: '3 Days',
    //   leavereason: 'sick',
    //   leavestatus: 'Approved',
    //   leavestatusid: '1',
    // },
  ],
  attendancelist: [
    // {
    //   subjectname: 'Tamil',
    //   attendancedate: '2021-06-04',
    //   attendancetype: 'Present',
    // },
  ],
  videoList: [],
  videoRestrictions: [
    {
      content:
        'Time taken to upload a video depends on the video size and the users internet strength',
    },
    {
      content: 'Video file Size must not exceed 500 MB.',
    },
    {
      content: 'Previously uploaded 20 videos only will be available.',
    },
    {
      content:
        'Do not upload a Video that infringes any third party’s copyrights or other rights (e.g., trademark, privacy rights, etc.);',
    },
    {
      content:
        'Do not upload a Video that is sexually explicit (e.g., pornography) or proposes a transaction of a sexual nature;',
    },
    {
      content:
        'Do not upload a Video that is hateful, defamatory, or discriminatory or incites hatred against any individual or group;',
    },
    {
      content:
        'Do not upload a Video that promotes or supports terror or hate groups;',
    },
    {
      content: 'Do not upload a Video that exploits minors;',
    },
    {
      content:
        'Do not upload a Video that depicts unlawful acts or extreme violence;',
    },
    {
      content:
        'Do not upload a Video that provides instructions on how to assemble explosive/incendiary devices or homemade/improvised firearms;',
    },
    {
      content:
        'Do not upload a Video that depicts animal cruelty or extreme violence towards animals;',
    },
    {
      content:
        'Do not upload a Video that promotes fraudulent or dubious business schemes or proposes an unlawful transaction;',
    },
    {
      content:
        'Do not upload a Video that makes false or misleading claims about vaccination safety;',
    },
    {
      content:
        'Do not upload a Video that conveys false or misleading health-related information that has a serious potential to cause public harm;',
    },
    {
      content:
        'Do not upload a Video that claims that mass tragedies are hoaxes or false flag operations;',
    },
    {
      content: 'Do not upload a Video that depicts or encourages self-harm;',
    },
    {
      content: 'Do not upload a Video that violates any applicable law.',
    },
    {
      content:
        'If any of the video uploaded is found to be violating any of the above terms and conditions, action will be taken as per Section 153 A of Indian Penal Code 1860.',
    },
  ],
  addNotice: {},
  addCircular: {},
  dashboard: {
    error: false,
    loading: true,
    data: [],
  },
  bottomSheetData: {
    hideSheet: false,
    tabList: [],
  },
  searchText: '',
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN: {
      return {
        ...state,
        isAuthenticated: true,
        userDetails: {
          ...state.userDetails,
          ...action.payload,
        },
      };
    }
    case USER_LOGOUT: {
      return {
        ...state,
        isAuthenticated: false,
        userDetails: {},
        courseData: [],
        divisionData: [],
        departmentData:[],
        menuList: [],
        maindata: {},
        loginTypeList: [],
      };
    }
    case LOGIN_TYPE_INITIAL_DATA:
      // console.log('item', action.payload);
      return {
        ...state,
        loginTypeList: action.payload,
      };
    case STORE_COURSE_DATA:
      return {
        ...state,
        courseData: [...action.payload],
      };
      case STORE_DIVISION_DATA:
        return {
          ...state,
          divisionData: [...action.payload],
        };

        case STORE_DEPARTMENT_DATA:
          return {
            ...state,
            departmentData: [...action.payload],
          };
    case BOTTOM_SHEET_DATA:
      return {
        ...state,
        bottomSheetData: action.payload,
      };
    case SET_MAIN_DATA:
      // console.log('item', action.payload);
      return {
        ...state,
        maindata: action.payload,
      };
    case SET_MENU_LIST:
      return {
        ...state,
        menuList: [...action.payload],
      };
    case REMOVE_EXAM_CREATION_LIST: {
      const examData = state.ExamCreateData;
      const currentData = action.payload;

      const examDataIndex = examData.findIndex(
        a =>
          a.clgsectionid === currentData.clgsectionid &&
          a.examsubjectid === currentData.examsubjectid,
      );

      examData.splice(examDataIndex, 1);

      return {
        ...state,
        ExamCreateData: [...examData],
      };
    }
    case INIT_EXAM_CREATION_LIST: {
      console.log('action.payload', action.payload);
      return {
        ...state,
        ExamCreateData: [...action.payload],
      };
    }
    case EXAM_CREATION_LIST: {
      const examData = state.ExamCreateData;
      const currentData = action.payload;

      const examDataIndex = examData.findIndex(
        a =>
          a.clgsectionid === currentData.clgsectionid &&
          a.examsubjectid === currentData.examsubjectid,
      );

      if (examDataIndex !== -1) {
        examData.splice(examDataIndex, 1, currentData);
      } else {
        examData.push(currentData);
      }

      return {
        ...state,
        ExamCreateData: [...examData],
      };
    }
    case UPCOMING_EXAMLIST:
      return {
        ...state,
        upcomingData: action.payload,
      };
    case PAST_EXAMLIST:
      return {
        ...state,
        pastData: action.payload,
      };
    case MARK_LIST:
      return {
        ...state,
        // markData: action.payload,
      };
    case COLLEGE_NOTICECARD:
      return {
        ...state,
        collegeNotice: action.payload,
      };
    case DEPARTMENT_NOTICECARD:
      return {
        ...state,
        departmentNotice: action.payload,
      };
    case FACULTY_LIST:
      return {
        ...state,
        facultyList: action.payload,
      };
    case LEAVE_HISTORY:
      return {
        ...state,
        leaveHistory: action.payload,
      };
    case ATTENDANCE_LIST:
      return {
        ...state,
        attendancelist: action.payload,
      };

    case VIDEO_LIST:
      return {
        ...state,
        videoList: action.payload,
      };
    case VIDEO_RESTRICTIONS:
      return {
        ...state,
        videoRestrictions: action.payload,
      };
    case ADD_CIRCULARCARD:
      return {
        ...state,
        addCircular: action.payload,
      };
    case ADD_NOTICEBOARD:
      return {
        ...state,
        addNotice: action.payload,
      };
    case DASHBOARD_DATA:
      return {
        ...state,
        dashboard: action.payload,
      };
    case SET_DEVICE_INFO:
      return {
        ...state,
        deviceInfo: {
          ...action.payload,
        },
      };
    case SET_VERSOIN_INFO:
      console.log('item', action.payload);
      return {
        ...state,
        versionInfo: {
          ...action.payload,
        },
      };
    case SEARCH_VALUE:
      return {
        ...state,
        searchText: action.payload,
      };
    case CHECK_MOBILE_STATUS:
      console.log('forgot OTP', action.payload);
      return {
        ...state,
        isOtpRequested: action.payload,
      };
    default:
      return state;
  }
};
