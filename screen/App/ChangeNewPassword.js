/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  BackHandler,
} from 'react-native';
import Gradit from '../../assests/images/gradit.png';
import {Constants, FONT} from '../../constants/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import AppConfig from '../../redux/app-config';
import triggerSimpleAjax from '../../context/Helper/httpHelper';
import {logOut} from '../../redux/actions/login';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setBottomSheetData} from '../../redux/actions/setBottomSheetData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangeNewPassword = ({
  navigation,
  route,
  triggerLogOut,
  bottomSheetAction,
}) => {
  const [secureOldPassword, setSecureOldPassword] = useState(true);
  const [secureNewPassword, setSecureNewPassword] = useState(true);
  const [securePasswordEntry, setSecurePasswordEntry] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobilieNo, setMobileNo] = useState('');

  const updateSecureOldPassword = () => {
    setSecureOldPassword(!secureOldPassword);
  };
  const updateSecureNewPassword = () => {
    setSecureNewPassword(!secureNewPassword);
  };
  const updateSecurePasswordEntry = () => {
    setSecurePasswordEntry(!securePasswordEntry);
  };

  const goBack = () => {
    bottomSheetAction({hideSheet: false});
    navigation.goBack();
  };

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Ok', onPress: () => goBack()},
    ]);
    return true;
  };
  const checkAuthentication = () => {
    AsyncStorage.getItem('Mobilenumber').then(res => {
      if (res) {
        console.log(res);
        setMobileNo(res);
      }
    });
  };
  useEffect(() => {
    checkAuthentication();
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);
  const ChangePass = () => {
    if (mobilieNo && oldPassword && newPassword === confirmPassword) {
      console.log(typeof mobilieNo, typeof oldPassword, typeof confirmPassword);
      setLoading(true);

      const request = {
        mobilenumber: mobilieNo,
        oldpassword: oldPassword,
        newpassword: confirmPassword,
      };
      console.log('REQUESTTTT', request);
      triggerSimpleAjax(
        `${AppConfig.API_URL}${AppConfig.API.CHANGE_PASSWORD}`,
        'POST',
        false,
        request,
        result => {
          const {Status, Message} = result;
          if (Status === 1) {
            setLoading(false);
            Alert.alert(Message);
            triggerLogOut();
          } else if (Status === 0) {
            setLoading(false);
            Alert.alert(Message);
          }
        },
      );
    } else if (!mobilieNo) {
      Alert.alert('Please Enter Mobilenumber');
    } else if (!oldPassword) {
      Alert.alert('Please Enter OldPassword');
    } else if (!newPassword || !confirmPassword) {
      Alert.alert('Missing Password Fields');
    } else {
      Alert.alert('Password is Mismatch');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Spinner
          color="#3b5998"
          visible={loading}
          size="large"
          textStyle={styles.spinnerTextStyle}
        />
        <View>
          <Image source={Gradit} style={styles.image} />
        </View>
        <View style={{marginTop: '5%'}}>
          <View style={{marginTop: '10%'}}>
            {/* <Text style={{...styles.text}}>Enter Your Mobilenumber</Text>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                alignItems: 'center',
              }}
            >
              <TextInput
                style={styles.input}
                placeholder="999 999 999"
                value={setMobileNo}
                keyboardType="number-pad"
                maxLength={10}
                onChangeText={data => setMobileNo(data)}
              />
            </View> */}
            <Text style={{...styles.text}}>Old Password</Text>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                alignItems: 'center',
              }}
            >
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry={secureOldPassword}
                value={setOldPassword}
                onChangeText={data => setOldPassword(data)}
              />
              <TouchableOpacity
                style={{...styles.iconRight, paddingRight: 20}}
                onPress={() => updateSecureOldPassword()}
              >
                {secureOldPassword ? (
                  <Icon name="lock-outline" size={30} color="#000000" />
                ) : (
                  <Icon name="lock-open" size={30} color="#000000" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={{...styles.text}}>New Password</Text>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                alignItems: 'center',
              }}
            >
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry={secureNewPassword}
                value={setNewPassword}
                onChangeText={data => setNewPassword(data)}
              />
              <TouchableOpacity
                style={{...styles.iconRight, paddingRight: 20}}
                onPress={() => updateSecureNewPassword()}
              >
                {secureNewPassword ? (
                  <Icon name="lock-outline" size={30} color="#000000" />
                ) : (
                  <Icon name="lock-open" size={30} color="#000000" />
                )}
              </TouchableOpacity>
            </View>

            <Text style={{...styles.text, marginTop: 10}}>
              Confirm New Password
            </Text>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                alignItems: 'center',
              }}
            >
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry={securePasswordEntry}
                value={confirmPassword}
                onChangeText={data => setConfirmPassword(data)}
              />
              <TouchableOpacity
                style={{...styles.iconRight, paddingRight: 20}}
                onPress={() => updateSecurePasswordEntry()}
              >
                {securePasswordEntry ? (
                  <Icon name="lock-outline" size={30} color="#000000" />
                ) : (
                  <Icon name="lock-open" size={30} color="#000000" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              ChangePass(mobilieNo, oldPassword, newPassword, confirmPassword);
            }}
          >
            <Text
              style={{
                ...styles.buttonText,
                color: Constants.BRIGHT_COLOR,
                fontSize: Constants.FONT_MED,
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              backAction();
            }}
          >
            <Text
              style={{
                ...styles.buttonText,
                color: Constants.BRIGHT_COLOR,
                fontSize: Constants.FONT_MED,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    triggerLogOut: bindActionCreators(logOut, dispatch),
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};

const mapStateToPropes = ({app}) => {
  const {maindata, versionInfo} = app;
  return {
    maindata,
    versionInfo,
  };
};

export default connect(mapStateToPropes, mapDispatchToProps)(ChangeNewPassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  image: {
    marginTop: '35%',
    resizeMode: 'cover',
    width: 150,
    height: 90,
    alignSelf: 'center',
  },
  textMild: {
    color: Constants.MILD_COLOR,
    fontSize: Constants.FONT_LOW,
  },
  textBold: {
    color: Constants.DARK_COLOR,
    fontSize: Constants.FONT_LOW,
    fontFamily: FONT.primaryMedium,
  },
  input: {
    height: 50,
    flex: 1,
    paddingLeft: '3%',
    // paddingBottom: -5,
    fontSize: Constants.FONT_LOW,
    color: Constants.TEXT_INPUT_COLOR,
  },
  button: {
    height: 45,
    backgroundColor: Constants.SECONDARY_COLOR,
    marginTop: '18%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    height: 45,
    backgroundColor: Constants.SECONDARY_COLOR,
    marginTop: '8%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: Constants.FONT_LOW,
    top: 10,
    fontFamily: FONT.primaryMedium,
  },
  forgetText: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginHorizontal: '20%',
  },
  spinnerTextStyle: {
    color: '#3b5998',
  },
  buttonText: {
    fontSize: Constants.FONT_LOW,
    fontFamily: FONT.primaryMedium,
  },
});
