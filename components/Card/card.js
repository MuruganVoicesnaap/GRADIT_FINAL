import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Constants, TOUCHABLE_ACTIVE_OPACITY} from '../../constants/constants';

const Card = props => {
  return (
    <TouchableOpacity
      style={[styles.card, props.style]}
      onPress={props.onPress}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}>
      {props.children}
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Constants.BRIGHT_COLOR,
    marginHorizontal: 16,
    shadowColor: Constants.BLACK003,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
