import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Constants} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import Button from '../../../components/Button/button';
import {Agenda} from 'react-native-calendars';
import {connect} from 'react-redux';
import {
  pastEventTotallList,
  upcomingEventTotallList,
} from '../../../redux/actions/numberAction';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

const timeToString = time => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const PastEvents = ({
  navigation,
  state,
  pastEventTotallList,
  upcomingEventTotallList,
}) => {
  const reqData = state?.app?.maindata;
  const pastEventsList = state.app.pastEvents;
  const upcomingEventsList = state.app.upcomingEvents;

  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);
  // console.log('PastEventsList', pastEventsList);
  useEffect(() => {
    pastEventTotallList(reqData), upcomingEventTotallList(reqData);
  }, [reqData]);
  const [items] = useState({
    '2021-06-02': [
      {
        courseid: '84',
        coursename: 'BL',
        departmentid: '91',
        departmentname: 'Law',
        yearid: '222',
        yearname: 'Year 1',
        sectionid: '178',
        sectionname: 'Evening',
        semesterid: '783',
        semestername: 'Semester 1',
        subjectid: '59',
        subjectname: 'Ethics',
      },
      {
        eventid: '442',
        event_date: '02 Jun 2021',
        event_time: '06:02 PM',
        topic: 'test',
        body: 'testing',
        venue: 'venue',
        createdbyname: 'Principal',
        createdby: '5958',
        filepath: null,
        eventdetailsid: '12053',
        isappread: '0',
        newfilepath: null,
      },
    ],
  });
  const [lastDay, setLastDay] = useState();
  const [month, setMonth] = useState();
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

  useEffect(() => {
    var month = new Date().getMonth() + 1;
    setMonth(month);
    // console.log(month);
    var lastDate = moment().format('YYYY-MM-DD');
    setLastDay(lastDate);
    // console.log('last', lastDate);
  }, []);
  const loadItems = day => {
    setTimeout(() => {
      for (let i = -40; i < 3; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          // console.log('PastEventsList', pastEventsList);
          pastEventsList.map((pastEventobj, index) => {
            // console.log(index, pastEventobj);
            let strTimeDayFormated = moment(
              pastEventobj.event_date,
              'DD MMM YYYY',
            ).format('YYYY-MM-DD');
            if (strTime === strTimeDayFormated)
              items[strTime].push(pastEventobj);
          });
        }
      }
    }, 1000);
  };

  const renderItem = item => {
    return (
      <View style={[styles.item]}>
        <View style={{...styles.leftLine}}>
          <View style={{marginLeft: '5%'}}>
            <Text
              style={{
                fontSize: Constants.FONT_BADGE,
                fontWeight: Constants.FONT_WEI_BOLD,
                marginLeft: 5,
                color: Constants.DARK_COLOR,
              }}
            >
              {item.topic}
            </Text>
          </View>
          <View
            style={{
              marginLeft: '5%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{flexDirection: 'row', marginVertical: '2%'}}>
              <Icons
                name="clock-time-five-outline"
                size={16}
                color={Constants.DARK_COLOR}
              />
              <Text
                style={{
                  fontSize: Constants.FONT_BADGE,
                  marginLeft: 3,
                  color: Constants.DARK_COLOR,
                }}
              >
                {item.event_time}
              </Text>
            </View>
            <TouchableOpacity
              style={{paddingRight: '5%'}}
              onPress={() =>
                navigation.navigate('Events', {
                  Eventdata: item,
                })
              }
            >
              <Icons
                name="chevron-right-circle"
                color={Constants.SKY_BLUE_COLOR}
                size={25}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.horizontalLine} />
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            paddingRight: '3%',
            marginVertical: 5,
            marginBottom: 15,
          }}
        >
          <Text>posted by :</Text>
          <View
            style={{
              paddingVertical: 2,
              paddingHorizontal: '3%',
              backgroundColor: Constants.POSTED_BY_COLOR,
              borderRadius: 15,
            }}
          >
            <Text>{item.createdbyname}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={[styles.item]}>
        {/* <Text>This is empty date!</Text> */}
      </View>
    );
  };

  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };
  return (
    <>
      {/* {console.log(month)} */}
      <StatusBar
        backgroundColor={Constants.HEADER_COLOR}
        barStyle="light-content"
      />
      <SafeAreaView style={styles.container}>
        {/* <StatusBar */}
        <Header />

        <View style={styles.innerContainer}>
          <Text style={styles.textHead}>Events</Text>
          <Text
            style={{...styles.textnormal, color: Constants.MILD_BLACK_COLOR}}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            suscipit malesuada nunc et.
          </Text>
          <View style={{...styles.row, marginTop: 10}}>
            <Button
              style={{...styles.button}}
              onPress={() => navigation.navigate('UpcomingEvents')}
            >
              <View style={styles.row}>
                <Text style={styles.buttonNormalText}>Upcoming - JO</Text>
                <View style={styles.badge}>
                  <Text style={styles.buttonTextBadge}>
                    {upcomingEventsList.length}
                  </Text>
                </View>
              </View>
            </Button>
            <Button style={[styles.buttonSelected, {marginHorizontal: 5}]}>
              <View style={styles.row}>
                <Text style={styles.buttonText}>Past</Text>
                {pastEventsList.length > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.buttonTextBadge}>
                      {pastEventsList.length}
                    </Text>
                  </View>
                ) : null}
              </View>
            </Button>
          </View>
        </View>

        <View
          style={{
            height: 44,
            marginTop: 10,
            backgroundColor: Constants.CALENDAR_HEAD_COLOR,
            flexDirection: 'row',
          }}
        >
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          >
            <Icons
              name="chevron-left"
              size={20}
              color={Constants.WHITE_COLOR}
            />
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          >
            <Text
              style={{...styles.monthText, fontSize: Constants.FONT_ELEVEN}}
            >
              {monthInWord[month - 1]}
            </Text>
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          >
            <Icons
              name="chevron-right"
              size={20}
              color={Constants.WHITE_COLOR}
            />
          </View>
        </View>
        <View style={{flex: 1}}>
          <Agenda
            items={items}
            loadItemsForMonth={loadItems}
            renderEmptyDate={renderEmptyDate}
            renderItem={renderItem}
            selected={lastDay}
            minDate={'2019-01-01'}
            maxDate={lastDay}
            renderDay={(day, item) => {
              return day ? (
                <View style={[styles.itemDay]}>
                  <View style={styles.monthView}>
                    <Text style={styles.monthText}>
                      {monthInWord[day.month - 1]}
                    </Text>
                  </View>
                  <View style={styles.dayView}>
                    <Text
                      style={{
                        fontSize: Constants.FONT_LOW,
                        fontWeight: Constants.FONT_WEI_BOLD,
                      }}
                    >
                      {day.day}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.emptyDay]}></View>
              );
            }}
            onDayChange={day => {
              setMonth(day.month);
            }}
            onDayPress={day => {
              setMonth(day.month);
            }}
            rowHasChanged={rowHasChanged} //  hideExtraDays={false}
            style={{backgroundColor: 'white', width: window.width}}
          />
        </View>
      </SafeAreaView>
    </>
  );
};
const mapStatetoProps = state => ({
  state: state,
});
export default connect(mapStatetoProps, {
  pastEventTotallList,
  upcomingEventTotallList,
})(PastEvents);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },
  innerContainer: {
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  textHead: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_BOLD,
  },
  texnormal: {
    fontSize: Constants.FONT_BADGE,
    fontWeight: Constants.FONT_WEI_NORMAL,
  },
  row: {
    flexDirection: 'row',
  },
  buttonSelected: {
    backgroundColor: Constants.BUTTON_SELECTED_COLOR,
    padding: '2%',
  },
  buttonText: {
    fontSize: Constants.FONT_BADGE,
    color: Constants.WHITE_COLOR,
    fontWeight: Constants.FONT_WEI_MED,
  },
  badge: {
    backgroundColor: Constants.BADGE_COLOR,
    borderRadius: 25,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonTextBadge: {
    fontSize: Constants.FONT_BADGE,
    color: Constants.WHITE_COLOR,
  },
  button: {
    backgroundColor: Constants.BUTTON_NORMAL_COLOR,
    padding: '2%',
  },
  buttonNormalText: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_MED,
    color: Constants.DARK_COLOR,
  },
  emptyDay: {
    flex: 0.3,
    marginLeft: 10,
    marginTop: 17,
    width: 62,
    height: 60,
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
    flex: 6,
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 17,
    width: '90%',
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
});
