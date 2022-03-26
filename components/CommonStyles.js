import {Constants, FONT} from '../constants/constants';

export const stylesForEachTabs = {
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noData: {
    alignSelf: 'center',
    marginVertical: 14,
  },
  viewLastCard: {
    paddingBottom: '40%',
  },
  badge: {
    backgroundColor: Constants.BADGE_COLOR,
    borderRadius: 20,
    paddingHorizontal: 5,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    alignSelf: 'center',
    minWidth: 20,
  },
  buttonTextBadge: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_TEN,
    color: Constants.WHITE_COLOR,
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
  },
  titleDescription: {
    fontFamily: FONT.primaryRegular,
    color: Constants.MILD_BLACK_COLOR,
    fontSize: Constants.FONT_ELEVEN,
  },
  tabWrapperStyle: {
    // width: 120,
    minWidth: '50%',
    marginLeft: -10,
    padding: 10,
    height: 45,
    marginVertical: 30,
    marginHorizontal: -1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.COMMON_COLOR_FOR_APP_MILD,
  },
  selectedTabWrapperStyle: {
    // width: 120,
    minWidth: '50%',
    marginLeft: -10,
    padding: 10,
    height: 45,
    marginVertical: 30,
    marginHorizontal: -1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.COMMON_COLOR_FOR_APP,
  },
};
