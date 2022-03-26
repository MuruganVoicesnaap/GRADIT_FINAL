import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Constants} from '../../constants/constants';

const Button = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={props.onPress}
      disabled={props.disabled}
      style={
        props.disabled
          ? [props.style, styles.disabledButtonStyle]
          : [styles.btnStyle, props.style]
      }
    >
      {props.children}
    </TouchableOpacity>
  );
};

export default Button;
const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: Constants.BRIGHT_COLOR,
    borderRadius: 4,
  },
  disabledButtonStyle: {
    backgroundColor: Constants.GREY004,
    borderRadius: 4,
  },
});
