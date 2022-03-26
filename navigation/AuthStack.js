import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screen/Auth/Login';
import EnterOtp from '../screen/Auth/EnterOtp';
import SendOtp from '../screen/Auth/SendOtp';
import ResetPassword from '../screen/Auth/ResetPassword';
import AppConfig from '../redux/app-config';
import CountryChoose from '../screen/Auth/CountryChoose';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, Text, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';

const Stack = createStackNavigator();
const AuthStack = ({isOtpRequested}) => {
  const [state, setstate] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log('0000000000', isOtpRequested);
  useEffect(() => {
    onPositiveClickListener();
  }, []);
  const onPositiveClickListener = async () => {
    setLoading(true);
    try {
      await AsyncStorage.getItem('BaseUrl').then(res => {
        if (res) {
          console.log(res);
          setstate(true);
          setLoading(false);
        } else {
          setstate(false);
          setLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  console.log(state);
  if (loading) {
    return (
      <>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          <Spinner color="#3b5998" visible={loading} size="large" />
        </View>
      </>
    );
  }
  return (
    <Stack.Navigator
      initialRouteName={
        isOtpRequested === 'Otp_Requested' ? AppConfig.SCREEN.OTP_SCREEN : null
      }
    >
      {!state ? (
        <Stack.Screen
          name={AppConfig.SCREEN.CCOUNTRY_CHOOSE}
          component={CountryChoose}
          options={{headerShown: false}}
        />
      ) : null}
      <Stack.Screen
        name={AppConfig.SCREEN.LOGIN_SCREEN}
        component={Login}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={AppConfig.SCREEN.FORGOT_SCREEN}
        component={SendOtp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={AppConfig.SCREEN.OTP_SCREEN}
        component={EnterOtp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={AppConfig.SCREEN.RESET_PASSWORD_SCREEN}
        component={ResetPassword}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const mapStatetoProps = ({app}) => ({
  isOtpRequested: app.isOtpRequested,
});
export default connect(mapStatetoProps, null)(AuthStack);
