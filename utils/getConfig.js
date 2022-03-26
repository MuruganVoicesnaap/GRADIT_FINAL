import {IMAGES} from '../assests';
import {Constants} from '../constants/constants';

export const PRINCIPAL = 'p1';
export const HOD = 'p2';
export const STAFF = 'p3';
export const STUDENT = 'p4';
export const PARENT = 'p5';

export const getHeaderColor = priority => {
  switch (priority) {
    case PRINCIPAL:
      return Constants.PRINCIPAL_HEADER;
    case HOD:
    case STAFF:
      return Constants.STAFF_HEADER;
    case STUDENT:
      return Constants.STUDENT_HEADER;
    case PARENT:
      return Constants.PARENT_HEADER;
    default:
      return Constants.STUDENT_HEADER;
  }
};

export const getSwipperColor = priority => {
  switch (priority) {
    case PRINCIPAL:
      return Constants.PRINCIPAL_SWIPER;
    case HOD:
    case STAFF:
      return Constants.STAFF_SWIPER;
    case STUDENT:
      return Constants.STUDENT_SWIPER;
    case PARENT:
      return Constants.PARENT_SWIPER;
    default:
      return Constants.STUDENT_SWIPER;
  }
};

export const getSwipperHeader = priority => {
  switch (priority) {
    case PRINCIPAL:
      return IMAGES.SwipeBackgroundPrincipal;
    case HOD:
    case STAFF:
      return IMAGES.SwipeBackgroundStaff;
    case STUDENT:
      return IMAGES.SwipeBackgroundStudent;
    case PARENT:
      return IMAGES.SwipeBackgroundParent;
    default:
      return IMAGES.SwipeBackgroundStudent;
  }
};
