/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import Gradit from '../../assests/images/gradit.png';
import {Constants, FONT} from '../../constants/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import {triggerLogin} from '../../redux/actions/login';
import AppConfig from '../../redux/app-config';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/Button/button';
import {Checkbox} from 'react-native-paper';

const Login = props => {
  const window = useWindowDimensions();
  const {navigation} = props;
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPasswords] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loginResponse, setLoginResponse] = useState(null);
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const [appCurrentVersionForApi] = useState(AppConfig.VERSION_CODE); //change this ApiCurrent Version
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => setModalVisible(prevState => !prevState);

  const [accepted, setAccepted] = useState(false);
  const checkAccepted = () => setAccepted(prevState => !prevState);
  const updateSecureTextEntery = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleLogin = () => {
    if (mobileNumber.length < 10) {
      Alert.alert('Invalid Mobile Number');
    } else if (!password.length) {
      Alert.alert('Required Password');
    } else {
      setLoading(true);
      props
        .triggerLogin({
          mobilenumber: mobileNumber,
          Password: password,
        })
        .then(() => {
          setLoading(false);
          setLoginResponse(null);
          setToast(true);
        })
        .catch(message => {
          setLoading(false);
          Alert.alert(message);
          // setLoginResponse(message);
        });
    }
  };
  useFocusEffect(
    useCallback(() => {
      // when the screen is focused
      setMobileNumber('');
      setPasswords('');
    }, []),
  );

  const storeData = async () => {
    await AsyncStorage.setItem('FirstLogin', 'alreadyLogged').then(
      toggleModal(),
    );
  };

  useEffect(() => {

 

    AsyncStorage.getItem('FirstLogin').then(res => {
      if (res) {
        // console.log(res);
        // toggleModal()
      } else {
        // console.log('else');
        AsyncStorage.getItem('BaseUrl').then(respo => {
          fetch(
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
              openAlert();
            }) 
            .catch(error => console.error(error));
        });
      }
    });
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => setToast(false), 1000);
    // clearing interval

    return () => clearInterval(timer);
  });
  const openAlert = () => {
    toggleModal();
  };
  // console.log(data);
  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.containerModal}>
          <View style={styles.contentContainer}>
            {/* <Text style={[styles.title, styles.titlePosition]}>
              Selected Recipients
            </Text> */}
            <WebView
              source={{
                uri: data.termsandcondition,
              }}
              style={{
                height: window.height - 40,
                width: window.width - 40,
              }}
            />
            {/* <TouchableOpacity
              style={{
                height: 40,
                width: window.width - 40,
              }}
            >
              <Checkbox.Item
                label="Terms and Conditions"
                status={accepted ? 'checked' : 'unchecked'}
                onPress={() => {
                  checkAccepted();
                }}
              />
            </TouchableOpacity> */}
            <Button
              style={styles.buttonStyle}
              onPress={() => {
                storeData();
              }}
            >
              <Text style={[styles.title, {color: Constants.BRIGHT_COLOR}]}>
                Accept & Continue
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
        <ScrollView style={styles.containerInner}>
          <Spinner color="#3b5998" visible={loading} size="large" />
          <View>
            {toast ? (
              <TouchableOpacity style={styles.toast}>
                <Text>Login Successfull !!!</Text>
              </TouchableOpacity>
            ) : null}
            <Image source={Gradit} style={styles.image} />
          </View>
          <View style={{marginTop: '5%'}}>
            <Text style={styles.textMild}>Proceed with your </Text>
            <Text style={styles.textBold}>Login </Text>

            <View style={{marginTop: '10%'}}>
              <Text style={styles.text}> Enter Mobile No</Text>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  alignItems: 'center',
                }}
              >
                <TextInput
                  style={styles.input}
                  placeholder="999 999 9999"
                  keyboardType="number-pad"
                  maxLength={10}
                  onChangeText={data => setMobileNumber(data)}
                  value={mobileNumber}
                />
                <Icon
                  name="mail-outline"
                  color="#000000"
                  size={26}
                  style={{...styles.Icon, paddingRight: 20}}
                />
              </View>
              {loginResponse ? (
                <Text style={{color: 'red', textAlign: 'right'}}>
                  {loginResponse}
                </Text>
              ) : null}
              <Text
                style={{
                  ...styles.text,
                  marginTop: 20,
                  fontWeight: Constants.FONT_WEI_NORMAL,
                }}
              >
                {' '}
                Password
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
                  secureTextEntry={secureTextEntry}
                  value={password}
                  onChangeText={data => setPasswords(data)}
                />
                <TouchableOpacity
                  style={{...styles.iconRight, paddingRight: 20}}
                  onPress={() => updateSecureTextEntery()}
                >
                  {secureTextEntry ? (
                    <Icon name="lock-outline" size={30} color="#000000" />
                  ) : (
                    <Icon name="lock-open" size={30} color="#000000" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text
                style={{
                  ...styles.text,
                  color: Constants.BRIGHT_COLOR,
                  fontSize: Constants.FONT_MED,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.forgetText}
              onPress={() =>
                navigation.navigate(AppConfig.SCREEN.FORGOT_SCREEN)
              }
            >
              <Text
                style={{
                  color: Constants.TEXT_INPUT_COLOR,
                  fontSize: Constants.FONT_LOW_MED,
                  textDecorationLine: 'underline',
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    triggerLogin: bindActionCreators(triggerLogin, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
  },
  title: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_LOW,
    color: Constants.DARK_COLOR,
  },

  buttonStyle: {
    height: 40,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.FACULTY_HEAD_COLOR,
    marginTop: 15,
  },
  contentContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    height: '95%',
    width: '95%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
  },
  containerInner: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '3%',
  },
  image: {
    marginTop: '35%',
    resizeMode: 'cover',
    width: 150,
    height: 90,
  },
  textMild: {
    color: Constants.MILD_COLOR,
    fontSize: Constants.FONT_MED,
  },
  textBold: {
    color: Constants.DARK_COLOR,
    fontSize: Constants.FONT_MED_LAR,
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
    height: '10%',
    backgroundColor: Constants.SECONDARY_COLOR,
    marginTop: '20%',
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
    // marginHorizontal: '20%',
  },
  toast: {
    backgroundColor: Constants.SECONDARY_COLOR,
    position: 'absolute',
    top: 100,
    right: 0,
    padding: 5,
    elevation: 5,
    borderRadius: 3,
  },
  spinnerTextStyle: {
    color: '#3b5998',
  },
});
