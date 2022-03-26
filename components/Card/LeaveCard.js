/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import Card from './card';
import Button from '../Button/button';
import {Constants, FONT} from '../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setBottomSheetData} from '../../redux/actions/setBottomSheetData';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import {leaveApplicationApi} from '../../redux/actions/attendance';
const LeaveCard = ({
  collegeId,
  memberid,
  sectionid,
  status = '',
  title = '',
  date = '',
  fromDate = '',
  toDate = '',
  totalDays = '',
  leavereason = '',
  priority = '',
  applicationid = '',
  onPress = onPress,
  bottomSheetAction,
  selectedCard,
  setSelectedCard,
  cardIndex,
  checkRead = '',
  getData = () => {},
}) => {
  const [expand, setExpand] = useState(false);
  // const toggle = () => {
  //   cardIndex !== selectedCard;
  // };
  const navigation = useNavigation();
  const startDate = moment(fromDate).format('DD/MM/YYYY');
  const startDateDiff = moment(fromDate).format('MM/DD/YYYY');
  //console.log("low date", startDate);
  const endDate = moment(toDate).format('DD/MM/YYYY');
  const endDateDiff = moment(toDate).format('MM/DD/YYYY');
  //console.log("start date", endDate);

  const deleteConfirm = () =>
    Alert.alert('Delete Leave', "Once done can't be changed", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteLeave()},
    ]);
  const deleteLeave = () => {
    leaveApplicationApi({
      colgid: collegeId,
      memberid: memberid,
      applicationid: applicationid,
      leavetypeid: '',
      leavefromdate: '',
      leavetodate: '',
      numofdays: '',
      clgsectionid: sectionid,
      leavereason: '',
      processtype: 'delete',
    })
      .then(() => {
        getData();
        Toast.show('Deleted Successfully', Toast.LONG);
      })
      .catch(() => {
        Toast.show('Not Fetched Successfully', Toast.LONG);
      });
  };
  return (
    <Card
      style={styles.card}
      onPress={() => {
        // toggle();
        setSelectedCard(cardIndex);
      }}
    >
      <View style={styles.mainRow}>
        <View style={styles.Row}>
          <Icons name="calendar-blank" size={16} color={Constants.DARK_COLOR} />
          <Text style={styles.dateStyle}>{date}</Text>
        </View>
        <View style={{...styles.Row}}>
          <Text
            style={{
              ...styles.textLine,
              color:
                status === 'WaitingForApproval'
                  ? Constants.FACULTY_HEAD_COLOR
                  : status === 'Approved'
                  ? Constants.GREEN001
                  : Constants.BADGE_COLOR,
            }}
          >
            {status}
          </Text>
        </View>
      </View>

      <View style={{...styles.mainRow, ...styles.leftLine, marginVertical: 5}}>
        <Text style={styles.reason}>{title}</Text>
        <View style={styles.Row}>
          <Text style={styles.textNormal}>No.of days:</Text>
          <Text style={styles.textBold}>{totalDays}</Text>
        </View>
      </View>

      <View style={{...styles.Row, alignItems: 'center'}}>
        <Text style={styles.textNormal}>From</Text>
        <View style={styles.dateBox}>
          <Text style={styles.textBold}>{fromDate}</Text>
        </View>
      </View>
      <View style={{...styles.Row, alignItems: 'center'}}>
        <Text style={styles.textNormal}>To</Text>
        <View style={styles.dateBox}>
          <Text style={styles.textBold}>{toDate}</Text>
        </View>
      </View>

      {cardIndex === selectedCard ? (
        <>
          {/* <View style={styles.horizontalLine} /> */}
          <Text style={{...styles.textNormal, width: '90%'}}>
            {leavereason}
          </Text>
          {status === 'WaitingForApproval' && (
            <View style={styles.actionButtonContainer}>
              <Button
                style={styles.editButton}
                onPress={() => {
                  bottomSheetAction({hideSheet: true});
                  navigation.navigate('AddLeave', {
                    id: applicationid,
                    title: title,
                    describe: leavereason,
                    edit: 'edit',
                    fromDate: startDate,
                    toDate: endDate,
                    totalDays: totalDays,
                    fromDateDiff: startDateDiff,
                    toDateDiff: endDateDiff,
                  });
                }}
              >
                <Text style={styles.actionButtonText}>Edit</Text>
              </Button>
              <Button
                style={styles.deleteButton}
                onPress={() => {
                  deleteConfirm();
                }}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    {color: Constants.BRIGHT_COLOR},
                  ]}
                >
                  Delete
                </Text>
              </Button>
            </View>
          )}
        </>
      ) : null}
    </Card>
  );
};
const mapStatetoProps = ({app}) => ({
  collegeId: app?.maindata?.colgid,
  memberid: app?.maindata?.memberid,
  sectionid: app?.maindata?.sectionid,
});
const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(LeaveCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Constants.WHITE_COLOR,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    height: undefined,
    marginVertical: '2%',
    borderRadius: 5,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  Row: {
    flexDirection: 'row',
  },
  dateStyle: {
    fontSize: Constants.FONT_TEN,
    marginLeft: 3,
    color: Constants.DARK_COLOR,
  },
  textLine: {
    borderBottomColor: Constants.BLACK000,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 4,
  },
  leftLine: {
    borderLeftWidth: 3,
    borderLeftColor: Constants.FACULTY_HEAD_COLOR,
    paddingHorizontal: '3%',
  },
  reason: {
    fontSize: Constants.FONT_FULL_LOW,
    fontWeight: Constants.FONT_WEI_BOLD,
  },
  textBold: {
    fontWeight: Constants.FONT_WEI_BOLD,
    fontSize: Constants.FONT_BADGE,
  },
  textNormal: {
    fontSize: Constants.FONT_BADGE,
  },
  dateBox: {
    // borderRadius: 42,
    // paddingVertical: 6,
    paddingHorizontal: 11,
    // marginHorizontal: 5,
    backgroundColor: Constants.BACKGROUND_MILD_BLUE001,
  },
  horizontalLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Constants.BLACK000,
    width: '50%',
    marginVertical: '4%',
    marginBottom: '2%',
  },
  editButton: {
    marginHorizontal: 3,
    borderColor: Constants.BUTTON_SELECTED_COLOR,
    borderWidth: 1,
    flexDirection: 'row',
    width: 78,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  deleteButton: {
    marginHorizontal: 3,
    flexDirection: 'row',
    backgroundColor: Constants.BUTTON_RED_COLOR,
    width: 78,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  actionButtonText: {
    fontSize: Constants.FONT_TEN,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.BUTTON_SELECTED_COLOR,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
