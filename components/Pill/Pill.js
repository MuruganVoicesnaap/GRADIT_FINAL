import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

export const Pill = ({
  text = 'View all',
  icon,
  iconSize,
  containerStyle = {},
  textStyle = {},
  onPress,
  disabled = false,
  numberOfLines,
  home,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      style={[styles.container, containerStyle]}
    >
      {icon ? (
        <Icons
          name={icon}
          size={iconSize || 14}
          color={textStyle.color || Constants.BLACK000}
        />
      ) : null}
      <Text
        style={[
          styles.text,
          !icon ? {marginLeft: 0} : null,
          home ? {marginTop: 3} : null,
          textStyle,
        ]}
        numberOfLines={numberOfLines ? numberOfLines : null}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    paddingHorizontal: 12,
    backgroundColor: Constants.GREY002,
  },
  text: {
    fontSize: 10,
    lineHeight: 14,
    color: Constants.BLACK000,
    marginLeft: 4,
    fontFamily: FONT.primaryRegular,
    alignSelf: 'center',
  },
});
