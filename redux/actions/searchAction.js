import {SEARCH_VALUE} from '../types';

export const searchValue = (dispatch, getValue) => {
  const {search} = getValue();
  dispatch({
    type: SEARCH_VALUE,
    payload: {
      ...search,
    },
  });
};
