import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import SplashScreen from '../screen/SplashScreen';
import {AppStack} from './AppStack';
import {checkAuthentication} from '../redux/actions/login';
import {baseUrlApi} from '../redux/actions/login';
import getDeviceInfo from '../redux/actions/getDeviceInfo';
import {versionCheckApi} from '../redux/actions/versionCheck';
import checkMobileStatus from '../redux/actions/checkMobileStatus';
import {initialLoginType} from '../redux/actions/numberAction';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthStatus = (props, navigation) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('');
  useEffect(() => {
    props.checkAuthentication();
    props.getDeviceInfo();
    mobileStatus();
    props.versionCheckApi();
    if (props.isAuthenticated) {
      dispatch(initialLoginType());
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [props, props.isAuthenticated]);

  const mobileStatus = async () => {
    try {
      await AsyncStorage.multiGet(['OTP_Requested', 'mobileNumber']).then(
        res => {
          setMobileNumber(res);
          console.log(
            res[0].includes('OTP_Requested'),
            res,
            typeof res[0][1],
            '...........',
            res[0][1] === null,
          );
          // console.log()
          if (res[0][1] !== null) {
            props.checkMobileStatus({mobilenumber: res[1][1]});
          }
        },
        //console.log('mobie------', mobileNumber),
      );
    } catch {}
  };

  return isLoading ? (
    <SplashScreen />
  ) : (
    <NavigationContainer>
      {props?.isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const mapStateToProps = ({app}) => {
  const {isAuthenticated} = app;
  return {
    isAuthenticated,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkAuthentication: bindActionCreators(checkAuthentication, dispatch),
    getDeviceInfo: bindActionCreators(getDeviceInfo, dispatch),
    versionCheckApi: bindActionCreators(versionCheckApi, dispatch),
    checkMobileStatus: bindActionCreators(checkMobileStatus, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthStatus);
