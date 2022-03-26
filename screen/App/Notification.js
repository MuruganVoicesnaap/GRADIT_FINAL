/* eslint-disable space-infix-ops */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/Header/Header';
import {DateTime} from '../../components/DateTime/DateTime';
import moment from 'moment';
import {notificationData} from '../../redux/actions/notificationInApp';
import AppConfig from '../../redux/app-config';
import {useNavigation} from '@react-navigation/native';
import Card from '../../components/Card/card';
import {Constants} from '../../constants/constants';
import capitializeFirstChar from '../DashboardHome/util/capitializeFirstChar';
import {CommonDateTime} from '../../components/DateTime/CommonDateTime';
const Notification = props => {
  const navigation = useNavigation();
  const {memberid, colgid} = props.maindata;
  const [notificationList, setNotificationData] = useState([]);
  useEffect(() => {
    if (memberid && colgid) {
      getData();
    }
  }, [memberid, colgid, getData]);

  const getData = useCallback(() => {
    if (memberid) {
      const request = {
        member_id: memberid,
        college_id: colgid,
      };
      notificationData({
        request,
      }).then(({data}) => {
        console.log(data, 'data');
        setNotificationData(data);
      });
    }
  }, [memberid, colgid, setNotificationData]);

  const renderItem = ({item}) => {
    const getDate = utc => {
      return moment(utc).format('ll');
    };
    const getTime = utc => {
      return moment(utc).format('LT');
    };
    return (
      <Card
        style={styles.card}
        onPress={() => {
          console.log(item.module_type);
          checkNavigate(item.module_type.toUpperCase());
        }}
      >
        <View style={styles.cardContainer}>
          <View style={styles.firstRow}>
            <View style={{flex: 2}}>
              <Text style={styles.title}>
                {capitializeFirstChar(item.title)}
              </Text>
              <Text style={styles.describe}>{item.notification_content}</Text>
            </View>
            <View style={styles.date}>
              <CommonDateTime
                date={getDate(item.sent_on)}
                time={getTime(item.sent_on)}
              />
            </View>
          </View>
        </View>
      </Card>
    );
  };
  const checkNavigate = data => {
    console.log(data, 'notify');
    if (data === 'VIDEOS') {
      navigation.navigate('Video');
    } else if (data === 'COMMUNICATION') {
      navigation.navigate(AppConfig.SCREEN.COMMUNICATON);
    } else if (data === 'EXAMINATION') {
      navigation.navigate(AppConfig.SCREEN.EXAMINATION_STACk?.NAME);
    } else if (data === 'ATTENDANCE') {
      navigation.navigate('AttendanceScreen');
    } else if (data === 'ASSIGNMENTS') {
      navigation.navigate(AppConfig.SCREEN.ASSIGNMENT);
    } else if (data === 'CIRCULAR') {
      navigation.navigate(AppConfig.SCREEN.CIRCULAR_STACK?.NAME);
    } else if (data === 'NOTICE BOARD') {
      navigation.navigate(AppConfig.SCREEN.NOTICE_BOARD_STACK?.NAME);
    } else if (data === 'EVENTS') {
      navigation.navigate(AppConfig.SCREEN.EVENT_STACK?.NAME);
    } else if (data === 'FACULTY') {
      navigation.navigate('Faculty');
    } else if (data === 'CHAT') {
      navigation.navigate(AppConfig.SCREEN.CHAT_HOME_SCREEN);
    }
  };
  return (
    <>
      <SafeAreaView>
        <Header />
        {notificationList.length !== 0 ? (
          <>
            <FlatList
              data={notificationList}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              style={{
                // height:500,
                paddingBottom: '90%',
                marginBottom: 140,
              }}
            />
            <View style={{height: 100}} />
          </>
        ) : (
          <View style={{alignSelf: 'center', marginTop: 20}}>
            <Text>No new notifications</Text>
          </View>
        )}
        {/* <View style={{height: 100}} /> */}
      </SafeAreaView>
    </>
  );
};

const mapStateToPropes = ({app}) => {
  const {maindata} = app;
  return {
    maindata,
  };
};

export default connect(mapStateToPropes, null)(Notification);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Constants.CARD_COLOR,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: '4%',
    paddingVertical: '3%',
    height: 100,
    marginVertical: '1%',
    borderRadius: 5,
  },
  cardContainer: {
    // backgroundColor: 'red',
    // padding: 30,
  },
  firstRow: {
    flexDirection: 'row',
    width: '100%',
  },
  title: {
    fontSize: 15,
    // padding: 10,
  },
  describe: {
    paddingTop: 5,
    fontSize: 13,
  },
  date: {
    flex: 1,
    alignSelf: 'flex-start',
  },
});
