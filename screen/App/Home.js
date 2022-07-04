/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Dimensions} from 'react-native';
import {
  Alert,
  AppState,
  Button,
  FlatList,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Gradit from '../../assests/images/gradit.png';
import HomeCard from '../../components/Card/HomeCard';
import {Constants} from '../../constants/constants';
import {dashboardData, updateFCMToken} from '../../redux/actions/dashboardData';
import getMenuList from '../../redux/actions/getMenuList';
import {logOut} from '../../redux/actions/login';
import {initialLoginType} from '../../redux/actions/numberAction';
import AppConfig from '../../redux/app-config';
import {SET_MAIN_DATA} from '../../redux/types';
import Spinner from 'react-native-loading-spinner-overlay';

const {API_URL, API} = AppConfig;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Home = ({
  navigation,
  state,
  initialLoginType,
  logindata,
  getDashboardData,
  getMenuLists,
  triggerLogOut,
}) => {
  const dispatch = useDispatch();
  const loginType = state.app.loginTypeList;
  // const data = state.app.versionInfo;
  const dataIterate = loginType?.length !== 0;
  const [appCurrentVersionForApi] = useState(AppConfig.VERSION_CODE); //change this ApiCurrent Version
  const [appCurrentVersion] = useState('1'); //dont change this
  // console.log('List', loginType);
  const [data, setData] = useState({});
  const [appState, setAppState] = useState(AppState.currentState);
  const [loadTime, setLoadTime] = useState(false);
  const handleAppStateChange = something => {
    setAppState(something);
  };
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    updateFcmTokenhandler();
    checkApplicationPermission();
    getPushNotification();
    // console.log(appState);
    // initialLoginType();
    fetchData();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log({remoteMessage});
      if (Platform.OS === 'android') {
        PushNotification.createChannel({
          channelId: 'com.gradit', // (required)
          channelName: 'Gradit', // (required)
        });
        PushNotification.localNotification({
          channelId: 'com.gradit',
          title: remoteMessage.data.title,
          message: remoteMessage.data.body,
          ignoreInForeground: false,
          priority: 'high',
          data: remoteMessage.data,
          // bigPictureUrl: remoteMessage.data.android.imageUrl,

          largeIcon: 'ic_launcher',
          smallIcon: 'ic_notification',
        });
      } else {
        PushNotificationIOS.addNotificationRequest({
          title: remoteMessage.data.title,
          body: remoteMessage.data.body,
          id: remoteMessage.messageId,
        });
      }
      // console.log(remoteMessage);
    });
    return unsubscribe;
  }, [appState]);

  const checkApplicationPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
    }
  };

  const updateFcmTokenhandler = async () => {
    const fcmToken = await messaging().getToken();
    console.log({fcmToken});
    const mobileNumber = await AsyncStorage.getItem('Mobilenumber');

    const userDeviceData = {
      mobileno: mobileNumber.toString(),
      devicetoken: fcmToken,
      devicetype: Platform.OS === 'android' ? 'android' : 'iphone',
    };

    dispatch(updateFCMToken(userDeviceData));
  };

  const getPushNotification = async () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (Platform.OS === 'android') {
        PushNotification.createChannel({
          channelId: 'com.gradit', // (required)
          channelName: 'Gradit', // (required)
        });
        PushNotification.localNotification({
          channelId: 'com.gradit',
          title: remoteMessage.data.title,
          message: remoteMessage.data.body,
          ignoreInForeground: false,
          priority: 'high',
          data: remoteMessage.data,
          // bigPictureUrl: remoteMessage.data.android.imageUrl,

          largeIcon: 'ic_launcher',
          smallIcon: 'ic_notification',
        });
      } else {
        PushNotificationIOS.addNotificationRequest({
          title: remoteMessage.data.title,
          body: remoteMessage.data.body,
          id: remoteMessage.messageId,
        });
      }
      console.log('Message handled in the background!', remoteMessage);
    });
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log('Message handled in the opennn!', remoteMessage);
    });
    messaging().getInitialNotification(async remoteMessage => {
      console.log(
        'Message handled in the getInitialNotification!',
        remoteMessage,
      );
    });
  };

  PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: async function (notification) {
      console.log({notification}, 'kgu', notification.data);
      try {
        let userItem = await loginType.filter(
          user => user.memberid == notification.data.memberid,
        )[0];
        console.log({userItem});
        if (typeof userItem == 'object') {
          loginUserData(userItem);
        } else {
          return navigation.navigate(AppConfig.SCREEN.HOME);
        }

        console.warn(' try NOTICE', notification.data);

        await navigation.navigate(AppConfig.SCREEN.DASHBOARD);
        if (notification.data.screen.toUpperCase() == 'NOTICE BOARD') {
          return navigation.navigate(AppConfig.SCREEN.NOTICE_BOARD_STACK?.NAME);
        } else if (notification.data.screen.toUpperCase() == 'CIRCULAR') {
          return navigation.navigate(AppConfig.SCREEN.CIRCULAR_STACK?.NAME);
        } else if (notification.data.screen.toUpperCase() == 'EXAMINATION') {
          return navigation.navigate(AppConfig.SCREEN.EXAMINATION_STACk?.NAME);
        } else if (notification.data.screen.toUpperCase() == 'ASSIGNMENT') {
          return navigation.navigate(AppConfig.SCREEN.ASSIGNMENT);
        } else if (notification.data.screen.toUpperCase() == 'COMMUNICATION') {
          return navigation.navigate(AppConfig.SCREEN.COMMUNICATON);
        } else if (notification.data.screen.toUpperCase() == 'ATTENDANCE') {
          return navigation.navigate('AttendanceScreen');
        } else if (notification.data.screen.toUpperCase() == 'EVENTS') {
          return navigation.navigate(AppConfig.SCREEN.EVENT_STACK?.NAME);
        } else if (notification.data.screen.toUpperCase() == 'VIDEOS') {
          return navigation.navigate('Video');
        } else if (notification.data.screen.toUpperCase() == 'CHAT') {
          return navigation.navigate(AppConfig.SCREEN.CHAT_HOME_SCREEN);
        }
      } catch (err) {
        console.warn('NOTICE');
        return navigation.navigate(AppConfig.SCREEN.HOME);
      }

      // (required) Called when a remote is received or opened, or local notification is opened
      // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    senderID: '735943104104',
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    requestPermissions: true,
    popInitialNotification: true,
  });
  const fetchData = () => {
    setLoadTime(true);
    fetch(
    //  `http://106.51.127.215:8090/api/AppDetailsBal/VersionCheck?versionID=${appCurrentVersionForApi}`,
      AppConfig.API_URL + 'VersionCheck'+'?versionID='+appCurrentVersionForApi+"&device_type="+Platform.OS
    )
      .then(response => {
        console.log("URL",response.status +"  : "+response.url)
            return response.json();
      }
      )
      .then(json => {

        console.log("versionCheck_date",json.data[0])
        setData(json.data[0]);
        setLoadTime(false);
        isValidVersion(json.data[0],true)
      })
      .catch(error => console.error(error));
    setLoadTime(false);
  };
  const isValidVersion = (data, validate) => {
    console.log(typeof data, 'hhhh');
    const playStoreUrl = data?.playstorelink;
  
    if (
      data.isversionupdateavailable === Number(appCurrentVersion) &&
      data.isforceupdaterequired === Number(appCurrentVersion)
    ) {
      Alert.alert(data?.versionalerttitle, data?.versionalertcontent, [
        {
          text: 'NOW',
          onPress: () => {
            console.log(`${playStoreUrl}com.vsca.vsnapvoicecollege`);
            Linking.openURL(`${playStoreUrl}com.vsca.vsnapvoicecollege`);
          },
        },
      ]);
    } else if (
      data.isversionupdateavailable === Number(appCurrentVersion) &&
      data.isforceupdaterequired !== Number(appCurrentVersion)
    ) {
      Alert.alert(data?.versionalerttitle, data?.versionalertcontent, [
        {
          text: 'LATER',
          style: 'cancel',
        },
        {
          text: 'NOW',
          onPress: () => {
            Linking.openURL(
              'http://play.google.com/store/apps/details?id=com.vsca.vsnapvoicecollege',
            );
          },
        },
      ]);
    }
  };

  const loginUserData = async item => {

    console.log('Item',item)
    logindata(item);

    getDashboardData({
      userid: item.memberid,
      collegeid: item.colgid,
      priority: item.priority,
    });
    getMenuLists({
      collegeid: item.colgid,
      userid: item.memberid,
      countryid: '1',
      langid: '1',
    });
    console.log(data);
    console.log(
      'user',
      data?.isforceupdaterequired,
      data?.isversionupdateavailable,
    );

     return navigation.navigate(AppConfig.SCREEN.DASHBOARD);
  
  };

  const checkNavigate = validate => {
    if (validate) {
      navigation.navigate(AppConfig.SCREEN.DASHBOARD);
    } else {
      // console.log('pere');
    }
  };
  const renderItem = ({item}) => {
    const loginAs =
      item.priority === 'p1'
        ? 'Principal'
        : item.priority === 'p2'
        ? 'HOD'
        : item.priority === 'p3'
        ? 'Staff'
        : item.priority === 'p4'
        ? 'Student'
        :item.priority === 'p5' 
        ?'Parent'
        :'Non Teaching'

    return (

      
      <HomeCard
        onPress={() => loginUserData(item)}
        topic={item.topic}
        description={item.description}
        membername={item.membername}
        colgname={item.colgname}
        yearname={item.yearname}
        semestername={item.semestername}
        loginas={loginAs}
      />


    );
  };
  const exitConfirm = () =>
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => triggerLogOut()},
    ]);
  return (
    <SafeAreaView
      style={{height: '100%', backgroundColor: Constants.WHITE_COLOR}}
    >
      <View style={styles.container}>
        <StatusBar
          animated={true}
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent
        />
        <View
          style={{
            marginVertical: '10%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20%',
          }}
        >
          <View style={{...styles.horizontalLine}} />
          <View style={{flex: 1}}>
            <Image source={Gradit} style={styles.image} />
          </View>
          <View style={{...styles.horizontalLine}} />
        </View>

        <Text style={styles.text}>Choose Your Login Type</Text>
        {dataIterate ? (
          <>
            <FlatList
              data={loginType}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
            <View style={{height: 50, marginTop: 10}}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                  exitConfirm();
                }}
              >
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner color="#3b5998" visible={loadTime} size="large" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
const mapStatetoProps = state => ({
  state: state,
});

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    initialLoginType: () => dispatch(initialLoginType()),
    logindata: data => dispatch({type: SET_MAIN_DATA, payload: data}),
    getDashboardData: data => dispatch(dashboardData(data)),
    getMenuLists: data => dispatch(getMenuList(data)),
    triggerLogOut: bindActionCreators(logOut, dispatch),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.WHITE_COLOR,
  },
  image: {
    alignSelf: 'center',
    resizeMode: 'cover',
    width: 150,
    height: 70,
    backgroundColor: 'red',
  },
  horizontalLine: {
    width: '20%',
    borderWidth: 0.5,
    borderColor: Constants.MILD_COLOR,
    marginHorizontal: '8%',
  },
  logoutButton: {
    height: 35,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: '2%',
    // backgroundColor: 'red',
  },
  text: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_BOLD,
    alignSelf: 'center',
    marginBottom: '5%',
  },
  logoutText: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_BOLD,
    color: Constants.SKY_BLUE_COLOR,
    alignSelf: 'center',
    // top: '30%',
    borderWidth: 1,
    borderColor: Constants.SKY_BLUE_COLOR,
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 30,
  },
});
