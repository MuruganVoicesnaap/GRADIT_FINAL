import React from 'react';
import {StyleSheet} from 'react-native';
import Button from '../Button/button';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Constants, ICON} from '../../constants/constants';

export const AddButton = ({
  iconName = ICON.PLUS,
  isMaterialIcon = false,
  containerStyle = {},
  onPress = () => {},
}) => (
  <Button style={[styles.container, containerStyle]} onPress={onPress}>
    {isMaterialIcon ? (
      <MaterialIcon name={iconName} color={Constants.DARK_COLOR} size={24} />
    ) : (
      <Icons name={iconName} color={Constants.DARK_COLOR} size={24} />
    )}
  </Button>
);

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    right: '5%',
    backgroundColor: Constants.COMMON_COLOR_FOR_APP,
  },
});
