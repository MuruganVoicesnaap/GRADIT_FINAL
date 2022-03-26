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
  TouchableOpacity,
  VirtualizedList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Constants, FONT} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import AnimatedSubheaderNav from '../../../components/AnimatedSubheaderNav/index';
import Advertisement from '../../../components/Advertisement';
import {Agenda} from 'react-native-calendars';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {eventsdData} from '../../../redux/actions/events';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AddButton} from '../../../components/AddButton/AddButton';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import AppConfig from '../../../redux/app-config';
import {appReadStatus} from '../../../redux/actions/appReadStatus';
import {stylesForEachTabs} from '../../../components/CommonStyles';
import CommonCard from '../../../components/CommonCard';

// const timeToString = time => {
//   const date = new Date(time);
//   return date.toISOString().split('T')[0];
// };
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const UpcomingEvents = ({
  navigation,
  priority,
  memberid,
  searchText,
  bottomSheetAction,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingEventsList, setUpcomingEventsList] = useState([]);
  const [pastEventsList, setPastEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);

  const isDataAvailableNotUndefined = isLeftTabSelected
    ? upcomingEventsList?.length !== undefined
    : pastEventsList?.length !== undefined;

  const [FilteredReadSource, setFilteredReadSource] = useState(pastEventsList);
  const [selectedCard, setSelectedCard] = useState(-1);
  const [FilteredUnreadSource, setFilteredUnreadSource] =
    useState(upcomingEventsList);
  const isDataAvailable = isLeftTabSelected
    ? FilteredUnreadSource.length !== 0
    : FilteredReadSource.length !== 0;
  useEffect(() => {
    if (searchText) {
      const lowercasedFilter = searchText.toLowerCase();
      const newData = upcomingEventsList.filter(item => {
        return Object.keys(item).some(key =>
          String(item[key]).toLowerCase().includes(lowercasedFilter),
        );
      });
      const newDataPast = pastEventsList.filter(item => {
        return Object.keys(item).some(key =>
          String(item[key]).toLowerCase().includes(lowercasedFilter),
        );
      });

      setFilteredUnreadSource(newData);
      setFilteredReadSource(newDataPast);
    } else {
      setFilteredUnreadSource(upcomingEventsList);
      setFilteredReadSource(pastEventsList);
    }
  }, [searchText, pastEventsList, upcomingEventsList]);
  useEffect(() => {
    console.log(memberid);

    if (memberid) {
      getData();
    }
  }, [memberid]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    wait(100).then(() => setRefreshing(false));
  }, [getData]);

  useFocusEffect(
    useCallback(() => {
      // when the screen is focused
      getData();
    }, []),
  );
  const getData = useCallback(() => {
    setLoading(true);
    if (memberid) {
      const request = {
        userid: memberid,
        appid: '1',
        priority: priority,
      };
      eventsdData({
        request,
        isUpcomingEvents: false,
      })
        .then(({data}) => setPastEventsList(data))
        .then(() => setLoading(false));
      eventsdData({
        request,
        isUpcomingEvents: true,
      })
        .then(({data}) => setUpcomingEventsList(data))
        .then(() => setLoading(false))
        .catch(({data}) => setUpcomingEventsList(null));
    }
  }, [memberid, priority, setPastEventsList, setUpcomingEventsList]);

  const statusChange = (eventdetailsid, readStatus) => {
    if (Number(readStatus) === 0) {
      appReadStatus({
        userid: memberid,
        detailsid: eventdetailsid,
        priority: priority,
        msgtype: 'events',
      });
    } else {
      console.log('already read ');
    }
  };
  const toggleCheck = (cardIndex, selectedCard) => {
    if (cardIndex !== selectedCard) {
      console.log('toggleCheck', cardIndex, selectedCard);
      setSelectedCard(cardIndex);
    } else if (cardIndex === selectedCard) {
      setSelectedCard(-1);
    }
  };

  const onAddEvents = () => {
    bottomSheetAction({hideSheet: true});
    navigation.navigate(AppConfig.SCREEN.ADD_EVENTS);
  };
  const renderItem = ({item, index}) => {
    // console.log(item);
    let itemsValue = item;
    const upcomingData = isLeftTabSelected ? true : false;
    return (
      // <>
      <CommonCard
        title={item.topic}
        date={item.event_date}
        time={item.event_time}
        sentbyname={item.createdbyname}
        content={item.body}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        createdby={item.createdby}
        getData={getData}
        cardIndex={index}
        appReadStatus={item.isappread}
        endContent
        onPress={() => toggleCheck(index, selectedCard)}
        viewButton
        viewOnPress={() => {
          navigation.navigate(
            'Events',
            {
              Eventdata: item,
              upcoming: upcomingData,
            },
            statusChange(item.eventdetailsid, item.isappread),
          );
          bottomSheetAction({hideSheet: true});
        }}
      />
    );
  };

  const onLeftTabPress = () => {
    setIsLeftTabSelected(true);
  };

  const onRightTabPress = () => {
    setIsLeftTabSelected(false);
  };
  return (
    <>
      {/* {console.log(month)} */}
      <StatusBar
        backgroundColor={Constants.HEADER_COLOR}
        barStyle="light-content"
      />
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Constants.HEADER_COLOR}
          barStyle="light-content"
        />
        <Header
          onSearch
          onRefreshingPage={() => {
            onRefresh(); //  isLeftTabSelected ? departmentNoticeList : collegeNoticeList
          }}
        />
        <ScrollView stickyHeaderIndices={[1]}>
          <Advertisement />
          <AnimatedSubheaderNav
            leftTab={
              <View style={styles.tab}>
                <Text style={styles.buttonNormalText}>Upcoming</Text>
                {upcomingEventsList.length > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.buttonTextBadge}>
                      {upcomingEventsList?.length !== 0 &&
                      upcomingEventsList?.length !== undefined
                        ? upcomingEventsList?.length
                        : 0}
                    </Text>
                  </View>
                ) : null}
              </View>
            }
            rightTab={
              <View style={styles.tab}>
                <Text style={styles.buttonNormalText}>Past</Text>
                {pastEventsList.length > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.buttonTextBadge}>
                      {pastEventsList?.length !== 0 &&
                      pastEventsList?.length !== undefined
                        ? pastEventsList?.length
                        : 0}
                    </Text>
                  </View>
                ) : null}
              </View>
            }
            headerContent={
              <>
                <Text style={styles.textHead}>Events</Text>
              </>
            }
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
          {loading ? (
            <View
              style={{
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Spinner color="#3b5998" visible={loading} size="large" />
            </View>
          ) : isDataAvailable && isDataAvailableNotUndefined ? (
            <VirtualizedList
              data={
                isLeftTabSelected ? FilteredUnreadSource : FilteredReadSource
              }
              initialNumToRender={5}
              getItem={(data, index) => data[index]}
              getItemCount={data => data?.length}
              renderItem={renderItem}
              contentContainerStyle={styles.viewLastCard}
              keyExtractor={item => item.detailsid}
              refreshing={refreshing}
              onRefresh={onRefresh}
              onEndReachedThreshold={0.5}
            />
          ) : (
            <View style={styles.noData}>
              <Text style={[styles.title, {fontFamily: FONT.primaryRegular}]}>
                No data found
              </Text>
            </View>
          )}
        </ScrollView>
        {(priority === 'p1' || priority === 'p2' || priority === 'p3') &&
          isLeftTabSelected && <AddButton onPress={onAddEvents} />}
      </SafeAreaView>
    </>
  );
};
const mapStatetoProps = ({app}) => ({
  priority: app.maindata?.priority,
  memberid: app.maindata?.memberid,
  searchText: app.searchText,
});
const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(UpcomingEvents);

const styles = StyleSheet.create({
  ...stylesForEachTabs,
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },
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

  noData: {
    alignSelf: 'center',
    marginVertical: 14,
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
  buttonSelected: {
    backgroundColor: Constants.BUTTON_SELECTED_COLOR,
    padding: '2%',
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
    marginLeft: 15,
    marginTop: 17,
    width: '90%',
    elevation: 5,
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
  flatlist: {flex: 1},

  viewLastCard: {
    paddingBottom: '40%',
  },
  viewFirstCard: {
    paddingTop: '40%',
  },
});
