import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Constants, FONT, ICON} from '../../constants/constants';

export const CommonDateTime = ({
  date = '',
  time = '',
  textStyle = {},
  containerStyle = {},
}) => {
  return (
    <View style={containerStyle}>
      {date ? <Text style={[styles.text, textStyle]}>{date}</Text> : null}
      {time ? (
        <Text style={[styles.text, styles.timeMarginBottom, textStyle]}>
          {time}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: Constants.FONT_TEN,
    lineHeight: 16,
    marginBottom: 0,
    color: Constants.BLACK003,
    fontFamily: FONT.primaryRegular,
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  timeMarginBottom: {
    marginBottom: 0,
  },
});
