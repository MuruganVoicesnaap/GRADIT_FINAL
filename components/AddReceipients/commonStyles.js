import {FONT, Constants} from '../../constants/constants';
export const stylesForDropDown = {
  modalContainerStyle: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
  },
  container: {
    // paddingHorizontal: 10,
    height: '100%',
  },
  flex: {
    flex: 1,
  },
  heading: {
    fontFamily: FONT.primaryRegular,
    fontSize: 14,
    marginBottom: 5,
    marginTop: 15,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    // marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1B82E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginRight: 15,
  },
  outlineButton: {
    flexDirection: 'row',
    borderColor: '#1B82E1',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  cancelButton: {
    flexDirection: 'row',
    backgroundColor: '#BBBBBB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // marginRight: 15,
    marginLeft: 15,

    position: 'absolute',
    bottom: -30,
    left: 10,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#18984B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginRight: 25,
    position: 'absolute',
    bottom: -30,
    right: 10,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    color: Constants.WHITE_COLOR,
  },
  actionButtonNotSelectedText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    color: '#1B82E1',
  },
  seprator: {
    alignSelf: 'center',
    color: '#B4B4B4',
    fontSize: 12,
  },
  selectWrapper: {
    marginVertical: 15,
  },
  placeholderStyle: {
    color: '#C0C0C0',
  },
  dropDownContainerStyle: {
    borderColor: '#D4D4D4',
    backgroundColor: '#F6FBFF',
  },
  dropdown: {
    marginBottom: 15,
    borderColor: '#D4D4D4',
  },
  searchTextInputStyle: {
    borderColor: '#D4D4D4',
  },
  searchContainerStyle: {
    borderBottomColor: '#F6FBFF',
  },
  iconContainerStyle: {
    marginRight: 10,
  },
  addRecipientPill: {
    borderWidth: 1,
    borderColor: Constants.GREY004,
    height: 65,
    marginTop: 15,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
  },
};
