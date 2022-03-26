import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  Constants,
  FONT,
  ICON,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
//[{lable:'',value:''}]
export const Checkbox = ({
  options = [],
  selectedOptions = [],
  onPress = () => null,
  containerStyle = {},
}) => {
  const selectValue = selectedOptions.map(values => values.value);
  return (
    <View style={[styles.row, containerStyle]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onPress(option)}
          style={styles.itemRow}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}>
          <View
            style={[
              styles.box,
              selectValue.includes(option.value)
                ? {backgroundColor: Constants.GREEN002}
                : null,
            ]}>
            <Icons name={ICON.CHECK} size={12} color={Constants.BRIGHT_COLOR} />
          </View>
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    marginEnd: 12,
  },
  box: {
    width: 15,
    height: 15,
    borderRadius: 4,
    backgroundColor: Constants.GREY004,
    marginEnd: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: FONT.primaryRegular,
    fontSize: 12,
    color: Constants.BLACK000,
  },
});
