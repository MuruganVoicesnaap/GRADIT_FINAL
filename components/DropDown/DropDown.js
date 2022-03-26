import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Provider, TextInput} from 'react-native-paper';
import DropDownPicker from 'react-native-paper-dropdown';
import { Constants } from '../../constants/constants';


const DropDown = ({
  label = '',
  value = '',
  iconName = 'menu-down',
  setValue,
  list,
  visible = false,
  showDropDown = () => {},
  onDismiss = () => {},
}) => {
  return (
    <DropDownPicker
      label={label}
      mode={'flat'}
      value={value}
      setValue={setValue}
      list={list}
      visible={visible}
      showDropDown={showDropDown}
      onDismiss={onDismiss}
      inputProps={{
        right: <TextInput.Icon name={iconName} />,
        style: styles.pickerStyle,
      }}
    />
  );
};

export default DropDown;

const styles = StyleSheet.create({
  pickerStyle: {
    backgroundColor: Constants.WHITE_COLOR,
  },
});
