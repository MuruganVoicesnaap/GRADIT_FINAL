import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Constants, FONT} from '../../constants/constants';

const NewText = ({numberOfLines}, props) => {
  return (
    <Text
      style={[styles.textStyle, {...props.style}]}
      numberOfLines={numberOfLines}
    >
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    color: Constants.BRIGHT_COLOR,
    fontFamily: FONT.primaryRegular,
  },
});

export default NewText;
