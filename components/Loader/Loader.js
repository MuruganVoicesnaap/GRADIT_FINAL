import React from 'react';
import {StyleSheet, View,ActivityIndicator} from 'react-native';
import NewText from '../Text/CustomText';
import {Constants} from '../../constants/constants';
import Spinner from 'react-native-loading-spinner-overlay';

const Loader = () => {
  return (
    <View style={styles.loaderContainer}>
      <Spinner
          color="#3b5998"
          visible={Loader}
          size="large"
          textStyle={styles.spinnerTextStyle}
        />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: Constants.BRIGHT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
