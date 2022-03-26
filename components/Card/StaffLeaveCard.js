import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Card from './card';
import Button from '../Button/button';
import {Constants, FONT} from '../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {leaveApproveApi} from '../../redux/actions/attendance';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import {dashboardData} from '../../redux/actions/dashboardData';
const StaffLeaveCard = ({
  memberid,
  collegeid,
  priority,
  studentid = '',
  studentname = '',
  coursename = '',
  departmentname = '',
  yearname = '',
  sectionname = '',
  semestername = '',
  applicationid = '',
  leaveapplicationtype = '',
  leavefromdate = '',
  leavetodate = '',
  leavereason = '',
  leavestatus = '',
  leavestatusid = '',
  numofdays = '',
  createdon = '',
  onPress = onPress,
  approveOrReject = '',
  selectedCard,
  setSelectedCard,
  cardIndex,
  checkRead = '',
  backendResponse = () => {},
  getData = () => {},
  getDashboardData,
}) => {
  const [expand, setExpand] = useState(false);
  const toggle = () => {
    cardIndex !== selectedCard;
  };
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const approvalCheck = () => {
    setLoading(true);
    leaveApproveApi({
      leaveid: applicationid,
      userid: memberid,
      processtype: '1',
    })
      .then(data => {
        if (checkRead) {
          setLoading(false);
          Toast.show(data.Message, Toast.LONG);

          refreshDashboard();
        } else {
          getData();
          backendResponse(data.Message);
          // console.log('data from .then', data, data.Message);
          setLoading(false);
          navigation.navigate('AttendanceScreen');
        }
      })
      .catch(data => {
        if (checkRead) {
          refreshDashboard();
          setLoading(false);
          Toast.show(data.Message, Toast.LONG);
        } else {
          setLoading(false);
          backendResponse(data.Message);
          navigation.navigate('AttendanceScreen');
        }
      });
  };

  const approvalReject = () => {
    setLoading(true);
    leaveApproveApi({
      leaveid: applicationid,
      userid: memberid,
      processtype: '2',
    })
      .then(data => {
        if (checkRead) {
          refreshDashboard();
          setLoading(false);
          Toast.show(data.Message, Toast.LONG);
        } else {
          getData();
          setLoading(false);
          backendResponse(data.Message);
          navigation.navigate('AttendanceScreen');
        }
      })
      .catch(data => {
        if (checkRead) {
          refreshDashboard();
          setLoading(false);
          Toast.show(data.Message, Toast.LONG);
        } else {
          setLoading(false);
          backendResponse(data.Message);
          navigation.navigate('AttendanceScreen');
        }
      });
  };
  const refreshDashboard = () => {
    // console.log('refresh');
    getDashboardData({
      userid: memberid,
      collegeid: collegeid,
      priority: priority,
    });
  };
  const approveLeave = () =>
    Alert.alert('Approve leave', "Once done can't be changed", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => approvalCheck()},
    ]);
  const rejectLeave = () =>
    Alert.alert('Reject leave', "Once done can't be changed", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => approvalReject()},
    ]);
  return (
    <Card
      style={styles.card}
      onPress={() => {
        toggle();
        setSelectedCard(cardIndex);
      }}
    >
      <Spinner
        color="#3b5998"
        visible={loading}
        size="large"
        textStyle={styles.spinnerTextStyle}
      />
      <View style={styles.mainRow}>
        <View style={styles.Row}>
          <Icons name="calendar-blank" size={16} color={Constants.DARK_COLOR} />
          <Text style={styles.dateStyle}>{createdon}</Text>
        </View>
        <View style={{...styles.Row}}>
          <Text
            style={{
              ...styles.textLine,
              color:
                leavestatus === 'WaitingForApproval'
                  ? Constants.FACULTY_HEAD_COLOR
                  : leavestatus === 'Approved'
                  ? Constants.GREEN001
                  : Constants.BADGE_COLOR,
            }}
          >
            {leavestatus}
          </Text>
        </View>
      </View>
      <View style={{...styles.mainRow, ...styles.leftLine, marginVertical: 15}}>
        <Text style={styles.reason}>{studentname}</Text>
        <View style={styles.Row}>
          <Text style={styles.textNormal}>No.of days:</Text>
          <Text style={styles.textBold}>{numofdays}</Text>
        </View>
      </View>
      <View style={[styles.Row, styles.profile]}>
        <Text style={[styles.textNormal, {marginRight: 3}]}>{coursename}</Text>
        <Text style={[styles.profileTextNormal]}>{departmentname}</Text>
        <Text style={[styles.profileTextNormal]}>{yearname}</Text>
        <Text style={[styles.profileTextNormal]}>{sectionname}</Text>
      </View>

      <View style={{...styles.Row, alignItems: 'center'}}>
        <Text style={styles.textNormal}>From</Text>
        <View style={styles.dateBox}>
          <Text style={styles.textBold}>{leavefromdate}</Text>
        </View>
        <Text style={styles.textNormal}>To</Text>
        <View style={styles.dateBox}>
          <Text style={styles.textBold}>{leavetodate}</Text>
        </View>
      </View>

      {cardIndex === selectedCard ? (
        <>
          <View style={styles.horizontalLine} />
          <Text style={{...styles.textNormal, width: '90%'}}>
            {leavereason}
          </Text>
          {leavestatus !== 'Approved' && leavestatus !== 'Rejected' ? (
            <View style={styles.actionButtonContainer}>
              <Button style={styles.editButton} onPress={() => rejectLeave()}>
                <Text style={styles.actionButtonText}>Reject</Text>
              </Button>
              <Button
                style={[
                  styles.editButton,
                  {backgroundColor: Constants.GREEN003},
                ]}
                onPress={() => {
                  approveLeave();
                }}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    {color: Constants.BRIGHT_COLOR},
                  ]}
                >
                  Approval
                </Text>
              </Button>
            </View>
          ) : null}
        </>
      ) : null}
    </Card>
  );
};

const mapStatetoProps = ({app}) => ({
  memberid: app.maindata?.memberid,
  collegeid: app.maindata?.colgid,
  priority: app.maindata?.priority,
});
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    getDashboardData: data => dispatch(dashboardData(data)),
    leaveApproveApi,
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(StaffLeaveCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Constants.WHITE_COLOR,
    width: '95%',
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
  profile: {
    alignItems: 'center',
    paddingLeft: '4%',
    marginTop: -7,
    marginBottom: 5,
  },
  Row: {
    flexDirection: 'row',
  },
  dateStyle: {
    fontSize: Constants.FONT_BADGE,
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
  profileTextNormal: {
    fontSize: Constants.FONT_BADGE,
    marginRight: 3,
    borderLeftWidth: 1,
    borderLeftColor: Constants.FACULTY_HEAD_COLOR,
    paddingHorizontal: 5,
  },
  dateBox: {
    borderRadius: 42,
    paddingVertical: 6,
    paddingHorizontal: 11,
    marginHorizontal: 5,
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
    backgroundColor: Constants.RED003,
    flexDirection: 'row',
    width: 78,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.WHITE_COLOR,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
