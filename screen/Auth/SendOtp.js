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
  FlatList,
  Alert,
  Modal,
  Button,
  WebView,
  Linking,
  Keyboard,
  // Platform,
} from 'react-native';
import Gradit from '../../assests/images/gradit.png';
import {Constants, FONT} from '../../constants/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import AppConfig from '../../redux/app-config';
import {triggerForgotPassword} from '../../redux/actions/login';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResetPassword = ({navigation, hideModal}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpResponse, setOtpResponse] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => setModalVisible(prevState => !prevState);
  const [data, setData] = useState('');
  const [numbers, setNumbers] = useState('');

  const storeData = async item => {
    console.log('mob---', mobileNumber);
    await AsyncStorage.setItem('OTP_Requested', 'OTP_Requested');
    await AsyncStorage.setItem('mobileNumber', mobileNumber).then(
      Linking.openURL(`tel:${item.item}`),
      setModalVisible(false),
      navigation.navigate('EnterOtp'),
    );
  };
  console.log('mobileno---', mobileNumber);

  const getOtp = () => {
    if (mobileNumber.length === 10) {
      setLoading(true);
      triggerForgotPassword({
        mobilenumber: mobileNumber,
      })
        .then(data => {
          setLoading(false);
          setOtpResponse(true);
          setData(data);
          setNumbers(data.data[0].ivrnumbers);
          console.log('data..,,,', data, data.data[0].ivrnumbers);
          openAlert();
          //Alert.alert(JSON.stringify(data));
          // navigation.navigate(AppConfig.SCREEN.OTP_SCREEN, {
          //   mobilenumber: mobileNumber,
          // });
        })
        .catch(msg => {
          setLoading(false);
          Alert.alert(msg);
        });
    } else {
      Alert.alert('Invalid Mobile Number');
    }
  };
  const openAlert = () => {
    toggleModal();
  };
  const goBack = () => {
    navigation.goBack();
  };

  // console.log(',,,,,,,', data.data[0].ivrnumbers);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Spinner color="#3b5998" visible={loading} size="large" />
        <View>
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
                onChangeText={e => setMobileNumber(e)}
                returnKeyType="done"
                returnKeyLabel="Done"
                onSubmitEditing={() => Keyboard.dismiss()}
                value={mobileNumber}
              />
              <Icon
                name="mail-outline"
                color="#000000"
                size={26}
                style={{...styles.Icon, paddingRight: 20}}
              />
            </View>
            {otpResponse ? (
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
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              getOtp(mobileNumber);
            }}
          >
            <Text
              style={{
                ...styles.text,
                color: Constants.BRIGHT_COLOR,
                fontSize: Constants.FONT_MED,
              }}
            >
              GET OTP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
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
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default ResetPassword;
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
  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
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
    marginTop: '43%',
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
