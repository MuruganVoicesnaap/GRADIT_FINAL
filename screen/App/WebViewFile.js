/* eslint-disable react-native/no-inline-styles */
import React from 'react';
// import {WebView} from 'react-native';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../constants/constants';
import {useNavigation} from '@react-navigation/native';
const MyWeb = ({route}) => {
  console.log(route.params);
  const imageUrl = route.params.pageUrl;
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Constants.GREEN001}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
          style={{
            width: 50,
            height: 30,
            borderRadius: 60,
            justifyContent: 'center',
          }}
        >
          <Icons
            name="arrow-left"
            size={27}
            color={Constants.DARK_COLOR}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.text}>{route.params.screenName}</Text>
      </View>
      <WebView
        source={{
          uri: imageUrl,
        }}
      />
      <View style={{height: 110, backgroundColor: Constants.WHITE_COLOR}} />
    </SafeAreaView>
  );
};
export default MyWeb;
const styles = StyleSheet.create({
  header: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Constants.WHITE_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor:
  },
  text: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_TWENTY,
    marginLeft: 15,
  },
  icon: {
    marginLeft: 15,
  },
});
