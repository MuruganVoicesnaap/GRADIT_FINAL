import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Constants, FONT, ICON} from '../../constants/constants';

export const DateTime = ({
  date = '',
  time = '',
  textStyle = {},
  containerStyle = {},
}) => {
  return (
    <View style={containerStyle}>
      {date ? (
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <Icons
            name={ICON.CALENDAR}
            size={15}
            color={textStyle.color || Constants.BLACK003}
          />
          <Text style={[styles.text, textStyle]}>{date}</Text>
        </View>
      ) : null}
      {time ? (
        <View style={styles.space}>
          <Icons
            name={ICON.CLOCK}
            size={14}
            color={textStyle.color || Constants.BLACK003}
          />
          <Text style={[styles.text, styles.timeMarginBottom, textStyle]}>
            {time}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: Constants.FONT_BADGE,
    lineHeight: 16,
    marginBottom: 0,
    color: Constants.BLACK003,
    fontFamily: FONT.primaryRegular,
    // alignItems: 'center',
    // alignContent: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'red',
  },
  timeMarginBottom: {
    marginBottom: 0,
    // paddingTop: 3,
  },
  space: {
    // top: 5,
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignSelf: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
});
