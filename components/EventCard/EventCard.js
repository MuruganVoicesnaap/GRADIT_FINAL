import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../constants/constants';
import {DateTime} from '../DateTime/DateTime';

export const EventCard = ({
  backgroundColor = Constants.VIOLET000,
  title = '',
  date = '',
  time = '',
  onPress,
}) => {
  const timeFinal = time.slice(0, 5) + ' ' + time.slice(-2).toUpperCase();
  return (
    <TouchableOpacity
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      onPress={onPress}
    >
      <View
        style={[styles.container, backgroundColor ? {backgroundColor} : null]}
      >
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>
        <DateTime
          date={date}
          time={timeFinal}
          containerStyle={styles.dateTime}
          textStyle={styles.text}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 187,
    height: 130,
    borderRadius: 6,
    // padding: 16,
    paddingHorizontal: 8,
    paddingTop: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 13,
    lineHeight: 17,
    color: Constants.BLACK002,
    marginBottom: 4,
    fontFamily: FONT.primaryBold,
  },
  dateTime: {
    fontSize: 10,
    lineHeight: 14,
    color: Constants.BLACK002,
    // marginTop: 5,
    marginBottom: 0,
    fontFamily: FONT.primaryRegular,
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  text: {
    fontSize: 11,
    fontFamily: FONT.primaryRegular,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
});
