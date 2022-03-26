import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
} from 'react-native';
import {Constants} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import Button from '../../../components/Button/button';
import LeaveCard from '../../../components/Card/LeaveCard';
import Advertisement from '../../../components/Advertisement';
import {leaveHistoryListApi} from '../../../redux/actions/numberAction';
import {connect} from 'react-redux';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const LeaveHistory = ({navigation, state, leaveHistoryListApi}) => {
  const reqData = state?.app?.maindata;
  const LeaveList = state.app.leaveHistory;
  // console.log('LeaveList', LeaveList);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    leaveHistoryListApi(reqData);
    wait(100).then(() => setRefreshing(false));
  }, []);

  useEffect(() => leaveHistoryListApi(reqData), [reqData]);

  const renderItem = ({item}) => {
    console.log('Item *************** ', {item});
    return (
      <LeaveCard
        status={item.leavestatus}
        title={item.leaveapplicationtype}
        date={item.createdon}
        fromDate={item.leavefromdate}
        toDate={item.leavetodate}
        totalDays={item.numofdays}
      />
    );
  };
  return (
    <>
      <StatusBar
        backgroundColor={Constants.HEADER_COLOR}
        barStyle="light-content"
      />
      <SafeAreaView style={styles.container}>
        {/* <StatusBar */}
        <Header />
        <Advertisement />
        <View style={styles.innerContainer}>
          <Text style={styles.textHead}>Attendance</Text>
          <Text
            style={{...styles.textnormal, color: Constants.MILD_BLACK_COLOR}}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            suscipit malesuada nunc et.
          </Text>
          <View style={{...styles.row, marginTop: 10}}>
            <Button
              style={{...styles.button}}
              onPress={() => navigation.navigate('AttendanceScreen')}
            >
              <View style={styles.row}>
                <Text style={styles.buttonNormalText}> Attendance</Text>
              </View>
            </Button>
            <Button style={[styles.buttonSelected, {marginHorizontal: 5}]}>
              <View style={styles.row}>
                <Text style={styles.buttonText}> Leave History</Text>
                {LeaveList.length > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.buttonTextBadge}>
                      {LeaveList.length}
                    </Text>
                  </View>
                ) : null}
              </View>
            </Button>
          </View>
        </View>

        <View
          style={LeaveList.length !== 0 ? styles.flatlist : styles.noRecord}
        >
          {LeaveList.length !== 0 ? (
            <FlatList
              data={LeaveList}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          ) : (
            <Text>No data found</Text>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};
const mapStatetoProps = state => ({
  state: state,
});
export default connect(mapStatetoProps, {leaveHistoryListApi})(LeaveHistory);

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
    fontSize: Constants.FONT_LOW_MED,
    fontWeight: Constants.FONT_WEI_BOLD,
  },
  texnormal: {
    fontSize: Constants.FONT_LOW,
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
    fontSize: Constants.FONT_LOW,
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
  flatlist: {
    // flex: 1,
    backgroundColor: '#fff',
    paddingBottom: '25%',
  },
  noRecord: {
    backgroundColor: '#fff',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
