import {BOTTOM_SHEET_DATA} from '../types';

export const setBottomSheetData =
  ({hideSheet = false}) =>
  (dispatch, getState) => {
    const {bottomSheetData} = getState();
    dispatch({
      type: BOTTOM_SHEET_DATA,
      payload: {
        ...bottomSheetData,
        hideSheet,
      },
    });
  };
