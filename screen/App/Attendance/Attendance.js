/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  FlatList,
  Image,
  ScrollView,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import {Constants, FONT} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import AnimatedSubheaderNav from '../../../components/AnimatedSubheaderNav/index';
import Advertisement from '../../../components/Advertisement';
import {Agenda} from 'react-native-calendars';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LeaveCard from '../../../components/Card/LeaveCard';
import StaffLeaveCard from '../../../components/Card/StaffLeaveCard';
import AttendanceCard from '../../../components/Card/AttendanceCard';
// import AttendanceEmptyImage from '../../../assests/index';
import AttendanceEmptyImage from '../../../assests/images/attendanceEmpty.png';
import AppConfig from '../../../redux/app-config';
import {AddButton} from '../../../components/AddButton/AddButton';
import {useFocusEffect} from '@react-navigation/native';
import {
  attendanceData,
  leaveHistorySenderApi,
  leaveHistoryApi,
  subjectListAPi,
} from '../../../redux/actions/attendance';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import {ActivityIndicator} from 'react-native';
import {stylesForEachTabs} from '../../../components/CommonStyles';
import { stringify } from 'querystring';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const AttendanceScreen = ({
  navigation,
  priority,
  memberid,
  collegeid,
  sectionid,
  bottomSheetAction,
}) => {
  const [dimensions, setDimensions] = useState({window, screen});
  // const window = useWindowDimensions();
  console.log(dimensions);
  const [leaveList, setLeaveList] = useState([]);
  const [subjectLst, setSubjectLst] = useState({});

  const [refreshingPageComponet, setRefreshingPageComponet] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);
  const [isSelectedDate, setIsSelectedDate] = useState('');
  const [currenttDay, setcurrenttDay] = useState();
  const [month, setMonth] = useState();
  const [itemObj, setItemObj] = useState({});
  const [selectedCard, setSelectedCard] = useState(-1);
  const monthInWord = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const [items] = useState({
    '2021-06-25': [
      {
        subjectname: 'Tamil',
        attendancedate: '2021-04-09',
        attendancetype: 'Present',
      },
      {
        subjectname: 'Tamil',
        attendancedate: '2021-04-09',
        attendancetype: 'Present',
      },
    ],
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimensions({window, screen});
      },
    );
    return () => subscription?.remove();
  },[]);

  // useEffect(() => {

  //   console.log('IsSelectedDate',isSelectedDate)
  //   console.log('subjects', JSON.stringify(subjectLst[isSelectedDate]))

  // }, [isSelectedDate]);


  
  useEffect(() => {
    if (memberid) {
      getData();
    }
  }, [memberid, getData]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    // wait(100).then(() => setRefreshing(false));
  }, [getData]);

  const getData = useCallback(() => {
    if (priority !== 'p4' && priority !== 'p5') {
      leaveHistorySenderApi({collegeid: collegeid, staffid: memberid}).then(
        ({data}) => {
          setRefreshing(false);
          setLeaveList(data);
        },
      );
    } else {
      leaveHistoryApi({collegeid: collegeid, staffid: memberid}).then(
        ({data}) => {
          setRefreshing(false);
          setLeaveList(data);
        },
      );
    }
  }, [memberid, collegeid, priority, setLeaveList, setSubjectLst]);

  useFocusEffect(
    useCallback(() => {
      // when the screen is focused
      getData();
    }, []),
  );
  const getStaffData = selectedDate => {

    console.log('staff')
    if (selectedDate !== '') {
      subjectListAPi({
        collegeid: collegeid,
        staffid: memberid,
      }).then(({data}) => setSubjectLst({[selectedDate]: data})   );
    }
  };
  const getStudentData = selectedDate => {
    if (selectedDate !== '') {
      attendanceData({
        userid: memberid,
        attendancedate: moment(selectedDate).format('DD/MM/YYYY'),
        sectionid: sectionid,
      }).then(({data}) => setSubjectLst({[selectedDate]: data})  );
    }
  };
  useEffect(() => {
    var initialMonth = new Date().getMonth() + 1;
    setMonth(initialMonth);
    var todayDate = moment().format('YYYY-MM-DD');
    setcurrenttDay(todayDate);
  }, []);

  const renderHistoryItem = ({item, index}) => {
    return (
      <LeaveCard
        status={item.leavestatus}
        title={item.leaveapplicationtype}
        date={item.createdon}
        fromDate={item.leavefromdate}
        toDate={item.leavetodate}
        totalDays={item.numofdays}
        leavereason={item.leavereason}
        priority={priority}
        applicationid={item.applicationid}
        onPress
        getData={getData}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        cardIndex={index}
      />
    );
  };

  const renderStaffCard = ({item, index}) => {
    //console.log(item, 'item.................', item.leavestatus);
    return (
      <StaffLeaveCard
        studentname={item.studentname}
        coursename={item.coursename}
        departmentname={item.departmentname}
        yearname={item.yearname}
        sectionname={item.sectionname}
        semestername={item.semestername}
        applicationid={item.applicationid}
        leaveapplicationtype={item.leaveapplicationtype}
        leavefromdate={item.leavefromdate}
        leavetodate={item.leavetodate}
        leavereason={item.leavereason}
        leavestatus={item.leavestatus}
        numofdays={item.numofdays}
        createdon={item.createdon}
        onPress
        getData={getData}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        cardIndex={index}
        backendResponse={data => {
          Toast.show(data, Toast.LONG);
        }}
      />
    );
  };

  const renderItem = (item, index) => {
    // const totalCard = subjectLst[isSelectedDate]?.length;
    return (
      <AttendanceCard
        index={index}
        // totalCard={totalCard}
        collegeid={collegeid}
        courseid={item.courseid}
        coursename={item.coursename}
        departmentid={item.departmentid}
        departmentname={item.departmentname}
        yearid={item.yearid}
        yearname={item.yearname}
        sectionid={item.sectionid}
        sectionname={item.sectionname}
        semesterid={item.semesterid}
        semestername={item.semestername}
        subjectid={item.subjectid}
        subjectname={item.subjectname}
        item={item}
        memberid={memberid}
        selectedDate={isSelectedDate}
        onPress
        backendResponce={data => {
          //Toast.show(JSON.stringify(data));
          Toast.show(data, Toast.LONG);
          // Alert.alert(gify(data));
        }}
      />
    );
  };

  const renderStudentItem = item => {
    return (
      <View style={styles.item}>
        <View style={styles.AttendaceSubView}>
          <View
            style={[
              styles.AbsentView,
              {
                backgroundColor:
                  item.attendancetype === 'Present'
                    ? Constants.GREEN003
                    : Constants.RED003,
              },
            ]}
          >
            <Text style={styles.buttonText}>
              {item.attendancetype === 'Present' ? 'P' : 'Ab'}
            </Text>
          </View>

          <Text style={[styles.buttonNormalText, {marginLeft: 5}]}>
            {item.subjectname}
          </Text>
        </View>
      </View>
    );
  };
  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };

  const onLeftTabPress = () => {
    setRefreshingPageComponet(true);
    navigation.navigate('AttendanceScreen');
    onRefresh();
    changeTab();
  };
  const changeTab = () => {
    wait(1).then(() => {
      setRefreshingPageComponet(false);
      setIsLeftTabSelected(true);
    });
  };
  const onRightTabPress = () => {
    setIsLeftTabSelected(false);
    setSelectedCard(-1);
  };

  const onAddLeave = () => {
    bottomSheetAction({hideSheet: true});
    navigation.navigate(AppConfig.SCREEN.ADD_LEAVE_SCREEN);
  };
  return (
    <>
      {/* {console.log(month)} */}
      <StatusBar
        backgroundColor={Constants.HEADER_COLOR}
        barStyle="light-content"
      />
      {!refreshingPageComponet ? (
        <SafeAreaView style={styles.container}>
          <StatusBar
            backgroundColor={Constants.HEADER_COLOR}
            barStyle="light-content"
          />
          <Header
            onRefreshingPage={() => {
              onRefresh();
            }}
          />
          <ScrollView
            scrollEnabled={!isLeftTabSelected ? true : false}
            stickyHeaderIndices={[1]}
            // contentOffset={(0, 0)}
          >
            <Advertisement />
            <AnimatedSubheaderNav
              leftTab={
                <View style={styles.tab}>
                  <Text style={styles.buttonNormalText}>Attendance</Text>
                  <View style={styles.badge}>
                    <Text style={styles.buttonTextBadge}>
                      {subjectLst[isSelectedDate]
                        ? subjectLst[isSelectedDate].length
                        : 0}
                    </Text>
                  </View>
                </View>
              }
              rightTab={
                <View style={styles.tab}>
                  <Text style={styles.buttonNormalText}>Leave History</Text>
                  {leaveList.length > 0 ? (
                    <View style={styles.badge}>
                      <Text style={styles.buttonTextBadge}>
                        {leaveList.length}
                      </Text>
                    </View>
                  ) : null}
                </View>
              }
              headerContent={<Text style={styles.textHead}>Attendance</Text>}
              onLeftTabPress={onLeftTabPress}
              onRightTabPress={onRightTabPress}
              leftTabWrapperStyle={
                isLeftTabSelected
                  ? styles.selectedTabWrapperStyle
                  : styles.tabWrapperStyle
              }
              rightTabWrapperStyle={
                !isLeftTabSelected
                  ? styles.selectedTabWrapperStyle
                  : styles.tabWrapperStyle
              }
            />

            {isLeftTabSelected ? (
              <>
                {/* <View
                style={{
                  height: 44,
                  marginTop: 10,
                  backgroundColor: Constants.CALENDAR_HEAD_COLOR,
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      ...styles.monthText,
                      fontSize: Constants.FONT_ELEVEN,
                    }}
                  >
                    {monthInWord[month - 1]}
                  </Text>
                </View>
              </View> */}
                <View
                  style={{
                    height: dimensions.screen.height - 290,
                    paddingBottom:
                      dimensions.screen.height > 850 ? '25%' : '35%',
                    // backgroundColor: 'red',
                  }}
                >
                  <Agenda
                    items={subjectLst}
                    renderItem={
                      priority !== 'p4' && priority !== 'p5'
                        ? renderItem
                        : renderStudentItem
                    }
                    minDate={'2019-01-01'}
                    selected={moment().format(isSelectedDate)}
                    maxDate={currenttDay}
                    renderDay={(day, item) => {
                      return day ? (
                        <View style={[styles.emptyDay]} />
                      ) : (
                        <View style={[styles.emptyDay]} />
                      );
                    }}
                    onDayChange={day => {
                      setMonth(day.month);
                    }}
                    onDayPress={day => {
                      console.log('Day',day);
                      setMonth(day.month);
                      setIsSelectedDate(day.dateString);
                      {
                        priority !== 'p4' && priority !== 'p5'
                          ? getStaffData(day.dateString)
                          : getStudentData(day.dateString);
                      }
                    }}
                    renderEmptyDate={() => {
                      return (
                        <View style={styles.item}>
                          <View
                            style={{
                              alignSelf: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Image
                              source={AttendanceEmptyImage}
                              style={{
                                height: 100,
                                width: 100,
                                resizeMode: 'cover',
                                alignSelf: 'center',
                                justifyContent: 'center',
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              alignSelf: 'center',
                              marginVertical: 10,
                              fontFamily: FONT.primaryMedium,
                            }}
                          >
                            Still Attendance not Taken for this date
                          </Text>
                        </View>
                      );
                    }}
                    rowHasChanged={rowHasChanged} //  hideExtraDays={false}
                    style={{
                      backgroundColor: 'white',
                      width: window.width,
                    }}
                  />
                </View>
                {/* <View style={{height: 100, backgroundColor: 'green'}} /> */}
              </>
            ) : refreshing ? (
              <View
                style={{
                  height: 70,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner color="#3b5998" visible={refreshing} size="large" />
              </View>
            ) : (
              <View
                style={
                  leaveList.length !== 0 ? styles.flatlist : styles.noRecord
                }
              >
                {leaveList.length !== 0 ? (
                  <FlatList
                    data={leaveList}
                    renderItem={
                      priority !== 'p4' && priority !== 'p5'
                        ? renderStaffCard
                        : renderHistoryItem
                    }
                    keyExtractor={item => item.id}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                  />
                ) : (
                  <Text>No data found</Text>
                )}
              </View>
            )}
            <View
              style={{
                marginBottom: isLeftTabSelected ? 250 : 0,
                backgroundColor: Constants.WHITE_COLOR,
              }}
            />
          </ScrollView>
          {priority === 'p4' && (
            <>
              {!isLeftTabSelected ? <AddButton onPress={onAddLeave} /> : null}
            </>
          )}
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          <StatusBar
            backgroundColor={Constants.HEADER_COLOR}
            barStyle="light-content"
          />
          <Header
            onRefreshingPage={() => {
              onRefresh();
            }}
          />
          <ActivityIndicator size="large" />
        </SafeAreaView>
      )}
    </>
  );
};
const mapStatetoProps = ({app}) => ({
  priority: app.maindata?.priority,
  memberid: app.maindata?.memberid,
  collegeid: app.maindata?.colgid,
  sectionid: app.maindata?.sectionid,
});
const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(AttendanceScreen);

const styles = StyleSheet.create({
  ...stylesForEachTabs,
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  innerContainer: {
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  textHead: {
    fontSize: Constants.FONT_BADGE,
    fontWeight: Constants.FONT_WEI_BOLD,
  },
  texnormal: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_NORMAL,
  },

  tab: {
    width: 140,
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: Constants.FONT_BADGE,
    color: Constants.WHITE_COLOR,
    fontWeight: Constants.FONT_WEI_MED,
  },

  buttonNormalText: {
    fontSize: Constants.FONT_BADGE,
    fontWeight: Constants.FONT_WEI_MED,
    color: Constants.DARK_COLOR,
  },
  emptyDay: {
    marginLeft: 0,
    marginTop: 0,
    width: 0,
    height: 0,
  },
  itemDay: {
    backgroundColor: Constants.WHITE_COLOR,
    flex: 0.3,
    borderRadius: 8,
    marginLeft: 10,
    marginTop: 17,
    width: 62,
    height: 60,
    alignSelf: 'center',
  },
  monthView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 23,
    backgroundColor: Constants.BLUE000,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  monthText: {
    fontSize: Constants.FONT_ELEVEN,
    fontWeight: Constants.FONT_WEI_BOLD,
    color: Constants.WHITE_COLOR,
  },
  dayView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 37,
  },
  item: {
    backgroundColor: Constants.WHITE_COLOR,
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 17,
    width: '95%',
    justifyContent: 'center',
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  leftLine: {
    borderLeftWidth: 5,
    borderLeftColor: Constants.BLUE000,
    paddingLeft: -5,
    marginLeft: -2.5,
    marginVertical: '3%',
  },
  horizontalLine: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Constants.TEXT_INPUT_COLOR,
    width: '90%',
    alignSelf: 'center',
    marginVertical: '4%',
    marginBottom: '2%',
    marginTop: -5,
  },
  flatlist: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: '60%',
  },
  noRecord: {
    backgroundColor: '#fff',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AttendaceSubView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '5%',
  },
  AbsentView: {
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
  },
});
