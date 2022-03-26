import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Header from '../../components/Header/Header';
import Advertisement from '../../components/Advertisement';
import {Constants, FONT} from '../../constants/constants';

const Chat = () => {
  return (
    <View style={styles.container}>
      <Header />
      <Advertisement />
      <View style={styles.centerView}>
        <Text style={styles.text}> Chat coming Soon</Text>
      </View>
    </View>
  );
};
export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontFamily: FONT.primaryBold,
    fontSize: 20,
    color: Constants.BUTTON_RED_COLOR,
  },
});
