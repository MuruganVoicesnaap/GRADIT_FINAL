/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
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
} from 'react-native';
import Gradit from '../../assests/images/gradit.png';
import {Constants, FONT} from '../../constants/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import AppConfig from '../../redux/app-config';
import {resetPassword} from '../../redux/actions/login';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResetPassword({navigation, route}) {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [securePasswordEntry, setSecurePasswordEntry] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const updateSecurePasswordEntry = () => {
    setSecurePasswordEntry(!securePasswordEntry);
  };

  const ChangePass = () => {
    if (password === confirmPassword) {
      setLoading(true);
      resetPassword({
        mobilenumber: route.params.mobilenumber,
        newpassword: password,
      })
        .then(msg => {
          setLoading(false);

          clearStorage();
          Alert.alert(msg);
          navigation.navigate(AppConfig.SCREEN.LOGIN_SCREEN);
        })
        .catch(msg => {
          setLoading(false);
          Alert.alert(msg);
        });
    } else if (!password || !confirmPassword) {
      Alert.alert('Missing Password Fields');
    } else {
      Alert.alert('Password is Mismatch');
    }
  };
  const clearStorage = async () => {
    await AsyncStorage.removeItem('OTP_Requested').then(console.log('cleared'));
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Spinner color="#3b5998" visible={loading} size="large" />
        <View>
          <Image source={Gradit} style={styles.image} />
        </View>
        <View style={{marginTop: '5%'}}>
          <Text
            style={{
              ...styles.textMild,
              fontWeight: Constants.FONT_WEI_MED,
              color: Constants.SECONDARY_COLOR,
            }}
          >
            OTP verified Successfully!!!
          </Text>
          <Text style={styles.textBold}>Reset your Password </Text>
          <Text style={styles.textMild}>
            Please set your new password below{' '}
          </Text>

          <View style={{marginTop: '10%'}}>
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
                secureTextEntry={secureTextEntry}
                value={password}
                onChangeText={data => setPassword(data)}
              />
              <TouchableOpacity
                style={{...styles.iconRight, paddingRight: 20}}
                onPress={() => updateSecureTextEntry()}
              >
                {secureTextEntry ? (
                  <Icon name="lock-outline" size={30} color="#000000" />
                ) : (
                  <Icon name="lock-open" size={30} color="#000000" />
                )}
              </TouchableOpacity>
            </View>

            <Text style={{...styles.text, marginTop: 20}}>
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
              ChangePass(password, confirmPassword);
            }}
          >
            <Text
              style={{
                ...styles.text,
                color: Constants.BRIGHT_COLOR,
                fontSize: Constants.FONT_MED,
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.forgetText}
            onPress={() => navigation.navigate(AppConfig.SCREEN.LOGIN_SCREEN)}
          >
            <Text
              style={{
                color: Constants.TEXT_INPUT_COLOR,
                fontSize: Constants.FONT_LOW_MED,
                borderBottomWidth: 1,
              }}
            >
              Login Page
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  text: {
    fontSize: Constants.FONT_LOW,

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
});
