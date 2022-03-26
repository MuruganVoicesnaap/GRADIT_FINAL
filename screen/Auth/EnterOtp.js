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
  Alert,
  SafeAreaView,
  Modal,
  FlatList,
  Linking,
  Keyboard,
} from 'react-native';
import Gradit from '../../assests/images/gradit.png';
import {Constants, FONT} from '../../constants/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import {triggerForgotPassword, verifyOtp} from '../../redux/actions/login';
import AppConfig from '../../redux/app-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EnterOtp({navigation, route}) {
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [otp, setOtp] = useState(null);
  const [mobilenumber, setMobileNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [resendOTP, setResendOTP] = useState(false);
  const [data, setData] = useState('');
  const [numbers, setNumbers] = useState('');

  const updateSecureTextEntery = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const VerifyOtp = () => {
    if (otp) {
      setLoading(true);
      verifyOtp({
        mobilenumber: mobilenumber,
        otp,
      })
        .then(data => {
          setLoading(false);
          navigation.navigate(AppConfig.SCREEN.RESET_PASSWORD_SCREEN, {
            mobilenumber: mobilenumber,
          });
        })
        .catch(msg => {
          setLoading(false);
          Alert.alert(msg);
        });
    } else {
      Alert.alert('OTP Not Valid');
    }
  };

  useEffect(() => {
    getMobile();
  }, []);
  const getMobile = async () => {
    try {
      await AsyncStorage.getItem('mobileNumber').then(
        res => {
          setMobileNumber(res);
          console.log(res, '...........');
        },
        //console.log('mobie------', mobileNumber),
      );
    } catch {}
  };

  const resendOtp = () => {
    setLoading(true);
    triggerForgotPassword({
      mobilenumber: mobilenumber,
    })
      .then(data => {
        setResendOTP(true);
        setLoading(false);
        setData(data);
        setNumbers(data.data[0].ivrnumbers);
        console.log('data..,,,', data, data.data[0].ivrnumbers);
        setModalVisible(true);
      })
      .catch(msg => {
        setLoading(false);
        Alert.alert(msg);
      });
  };
  const storeData = async item => {
    // console.log('mob---', mobileNumber);
    await AsyncStorage.setItem('OTP_Requested', 'OTP_Requested').then(
      Linking.openURL(`tel:${item.item}`),
      setModalVisible(false),
      navigation.navigate('EnterOtp'),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Spinner color="#3b5998" visible={loading} size="large" />
        <View>
          <Image source={Gradit} style={styles.image} />
        </View>
        <View style={{marginTop: '5%'}}>
          <Text style={styles.textMild}>Proceed with your </Text>
          <Text style={styles.textBold}>Enter OTP </Text>

          <View style={{marginTop: '10%'}}>
            <Text style={styles.text}>Your Mobile No</Text>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                alignItems: 'center',
              }}
            >
              <TextInput
                style={styles.input}
                disabled={true}
                keyboardType="number-pad"
                maxLength={10}
                value={mobilenumber}
                editable={false}
              />
              <Icon
                name="mail-outline"
                color="#000000"
                size={26}
                style={{...styles.Icon, paddingRight: 20}}
              />
            </View>
            <Text style={{...styles.text, marginTop: 20}}>Enter OTP</Text>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                alignItems: 'center',
              }}
            >
              <TextInput
                style={styles.input}
                placeholder="****"
                secureTextEntry={secureTextEntry}
                maxLength={4}
                keyboardType="number-pad"
                value={otp}
                editable={true}
                onChangeText={data => setOtp(data)}
                returnKeyType="done"
                returnKeyLabel="Done"
                onSubmitEditing={() => Keyboard.dismiss()}
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
            <View style={styles.row}>
              <Text>Dont recive code? </Text>
              <TouchableOpacity onPress={resendOtp}>
                <Text
                  style={{
                    fontFamily: FONT.primaryBold,
                    fontSize: 14,
                    textDecorationLine: 'underline',
                  }}
                >
                  Resend Code Again
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {resendOTP ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
              onDismiss={() => setModalVisible(false)}
            >
              <View style={styles.containerModal}>
                <View style={styles.contentContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={{color: 'red'}}>close</Text>
                  </TouchableOpacity>
                  <Text style={styles.mesageText} numberOfLines={3}>
                    {data.msg}
                  </Text>
                  <FlatList
                    style={{marginTop: 80}}
                    data={numbers}
                    renderItem={item => {
                      console.log('......', item);
                      return (
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'blue',
                            width: 200,
                            height: 50,
                            marginTop: 20,
                          }}
                          onPress={() => {
                            storeData(item);
                          }}
                        >
                          <Text
                            style={{
                              color: 'white',
                              alignSelf: 'center',
                              top: 15,
                            }}
                          >
                            {item.item}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={item => item.id}
                  />
                </View>
              </View>
            </Modal>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={VerifyOtp}>
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
          <TouchableOpacity
            style={styles.forgetText}
            onPress={() => navigation.navigate('Login')}
          >
            <Text
              style={{
                color: Constants.TEXT_INPUT_COLOR,
                fontSize: Constants.FONT_LOW_MED,
                textDecorationLine: 'underline',
              }}
            >
              Login Page
            </Text>
          </TouchableOpacity>
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
    fontSize: Constants.FONT_MED,
  },
  textBold: {
    color: Constants.DARK_COLOR,
    fontSize: Constants.FONT_MED_LAR,
    // fontWeight: Constants.FONT_WEI_BOLD,
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
    marginTop: '15%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: Constants.FONT_LOW,
    // fontWeight: Constants.FONT_WEI_BOLD,
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
  row: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: '2%',
  },
  Text: {
    fontFamily: FONT.primaryRegular,
  },
  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
  },
  contentContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    height: '55%',
    width: '95%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    alignSelf: 'flex-end',
    top: '7%',
    right: 20,
  },
  mesageText: {
    fontSize: Constants.FONT_FULL_MED,
    top: '13%',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
});
