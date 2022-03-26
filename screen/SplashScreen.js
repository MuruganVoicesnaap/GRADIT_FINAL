import React, {useEffect, useState} from 'react';
import {View, Image, Text, StyleSheet, Alert, Linking} from 'react-native';
import Gradit from '../assests/images/gradit.png';
import {Constants} from '../constants/constants';
import DeviceInfo from 'react-native-device-info';
import {connect} from 'react-redux';

// or ES6+ destructured imports

import {getUniqueId, getManufacturer} from 'react-native-device-info';

const SplashScreen = () => {
  useEffect(() => {
    let uniqueId = DeviceInfo.getUniqueId();

    console.log(uniqueId, 'deviceId');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={Gradit} style={styles.image} />
      </View>
      <View style={styles.textPlace}>
        <Text style={styles.version}>Version </Text>
        <Text style={styles.versionValue}>2.1</Text>
      </View>
    </View>
  );
};
const mapStateToPropes = ({app}) => {
  const {versionInfo} = app;
  return {
    versionInfo,
  };
};

export default connect(mapStateToPropes, null)(SplashScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.BRIGHT_COLOR,
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
  },
  imgContainer: {
    width: '50%',
  },
  textPlace: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  version: {fontSize: 20, fontWeight: 'bold'},
  versionValue: {textAlign: 'auto', fontWeight: 'bold'},
});
