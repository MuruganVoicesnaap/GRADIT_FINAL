import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Constants, FONT} from '../constants/constants';

export const NavTab = ({text, active, count}) => (
  <View style={styles.container}>
    <Text style={active ? styles.activeButtonText : styles.buttonText}>
      {text}
    </Text>
    {count > 0 ? (
      <View style={styles.countContainer}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
  },
  activeButtonText: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
  },
  countContainer: {
    backgroundColor: Constants.BADGE_COLOR,
    borderRadius: 20,
    paddingHorizontal: 5,
    height: 20,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  countText: {
    fontFamily: FONT.primaryBold,
    fontSize: 10,
    color: Constants.WHITE_COLOR,
  },
});
